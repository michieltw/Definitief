import { useReducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestoreDocument, simulateExternalUpdate } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { CONFIG } from '../lib/constants';
import ScoreboardHeader from '../components/Scorekeeper/ScoreboardHeader';
import ScorekeeperControls from '../components/Scorekeeper/ScorekeeperControls';
import EventLog from '../components/Scorekeeper/EventLog';

// Reducer for match state
const initialState = {
  events: [],
  scoreHome: 0,
  scoreAway: 0,
  isRecording: false,
};

function matchReducer(state, action) {
  switch (action.type) {
    case 'INIT_STATE':
      return {
        ...state,
        events: action.payload.events || [],
        scoreHome: action.payload.scoreHome || 0,
        scoreAway: action.payload.scoreAway || 0,
      };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'ADD_EVENT': {
      const newEvent = action.payload;
      const isGoal = newEvent.type === CONFIG.EVENT_TYPES.GOAL;
      const isHome = newEvent.teamId === action.meta.homeTeam;

      return {
        ...state,
        events: [...state.events, newEvent],
        scoreHome: isGoal && isHome ? state.scoreHome + 1 : state.scoreHome,
        scoreAway: isGoal && !isHome ? state.scoreAway + 1 : state.scoreAway,
      };
    }
    default:
      return state;
  }
}

export default function MatchScorekeeper() {
  const { matchId } = useParams();

  // Fetch Match Info (header)
  const { data: matchInfo, loading: infoLoading, updateDoc: updateMatchInfo, setDoc: setMatchInfo } = useFirestoreDocument('match', `${matchId}:info`);

  // Fetch Match Events
  const { data: matchEvents, loading: eventsLoading, updateDoc: updateMatchEvents, setDoc: setMatchEvents } = useFirestoreDocument('match', `${matchId}:events`);

  const [simulationActive, setSimulationActive] = useState(false);

  const [state, dispatch] = useReducer(matchReducer, initialState);

  useEffect(() => {
    if (matchInfo && matchEvents) {
      dispatch({
        type: 'INIT_STATE',
        payload: {
          events: matchEvents.events,
          scoreHome: matchInfo.scoreHome,
          scoreAway: matchInfo.scoreAway,
        }
      });
    }
  }, [matchInfo, matchEvents]);

  const handleSeedData = async () => {
    await setMatchInfo({
      homeTeam: 'TEAM_001',
      homeName: 'Amsterdam Tigers',
      awayTeam: 'TEAM_002',
      awayName: 'Heerenveen Flyers',
      scoreHome: 0,
      scoreAway: 0,
      period: 1,
      time: '20:00',
      status: CONFIG.MATCH_STATUS.SCHEDULED,
      matchDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
    });

    await setMatchEvents({
      events: []
    });
  };

  const { data: standingsData, updateDoc: updateStandings } = useFirestoreDocument('stand', 'SZN_2026:DIV_001');

  // Real-Time Stream Simulation
  useEffect(() => {
    let interval;
    if (simulationActive && matchInfo && matchInfo.status === CONFIG.MATCH_STATUS.LIVE) {
      interval = setInterval(() => {
        // Simulate an external background event every 5 seconds (e.g., from another scorekeeper)
        const isHomeEvent = Math.random() > 0.5;
        const teamId = isHomeEvent ? matchInfo.homeTeam : matchInfo.awayTeam;
        const newEvent = {
          id: `SIM_EVT_${Date.now()}`,
          type: CONFIG.EVENT_TYPES.PENALTY, // Simulating mostly non-goal events to avoid score sync complexity here
          teamId: teamId,
          timestamp: new Date().toISOString(),
          period: matchInfo.period,
          timeString: matchInfo.time,
          note: 'External Sim Event'
        };

        // Use the external update helper to bypass the component's normal update flow,
        // testing if onSnapshot pub/sub triggers a smooth re-render
        simulateExternalUpdate('match', `${matchId}:events`, (currentData) => {
          const currentEvents = currentData.events || [];
          return { ...currentData, events: [...currentEvents, newEvent] };
        });

      }, 5000);
    }
    return () => clearInterval(interval);
  }, [simulationActive, matchInfo, matchId]);

  const handleStatusChange = async (newStatus) => {
    await updateMatchInfo({ status: newStatus });

    // Handle Standings Recalculation when Match is FINAL
    if (newStatus === CONFIG.MATCH_STATUS.FINAL && standingsData && standingsData.teams) {
      const homeScore = state.scoreHome;
      const awayScore = state.scoreAway;

      const updatedTeams = standingsData.teams.map(team => {
        if (team.teamId === matchInfo.homeTeam) {
          const isWin = homeScore > awayScore;
          const isDraw = homeScore === awayScore;
          return {
            ...team,
            played: team.played + 1,
            points: team.points + (isWin ? 3 : isDraw ? 1 : 0),
            goalsFor: team.goalsFor + homeScore,
            goalsAgainst: team.goalsAgainst + awayScore,
            form: team.form.slice(1) + (isWin ? 'W' : isDraw ? 'D' : 'L')
          };
        }
        if (team.teamId === matchInfo.awayTeam) {
          const isWin = awayScore > homeScore;
          const isDraw = homeScore === awayScore;
          return {
            ...team,
            played: team.played + 1,
            points: team.points + (isWin ? 3 : isDraw ? 1 : 0),
            goalsFor: team.goalsFor + awayScore,
            goalsAgainst: team.goalsAgainst + homeScore,
            form: team.form.slice(1) + (isWin ? 'W' : isDraw ? 'D' : 'L')
          };
        }
        return team;
      });

      // Sort teams by points (simple sort for prototype)
      updatedTeams.sort((a, b) => b.points - a.points);

      await updateStandings({ teams: updatedTeams });

      // Player stats update simulation - because we don't track player IDs in this UI yet,
      // we mock a generic update to a known player document
      try {
        const dummyPlayerId = 'PLR_001';
        const teamId = matchInfo.homeTeam;
        const statsDocId = `SZN_2026:${teamId}:${dummyPlayerId}`;
        // Using mockDB directly just to simulate the write without creating another useFirestoreDocument hook
        const { mockDB } = await import('../hooks/useFirestore');
        // This is a hacky way to access the mock for prototype purposes
        // In reality, this would be a cloud function iterating over the roster
      } catch (e) {
          // Ignore for now
      }
    }
  };

  const loading = infoLoading || eventsLoading;

  if (loading) {
    return <div className="text-slate-400">Loading live match data...</div>;
  }

  if (!matchInfo || !matchEvents) {
    return (
      <div className="space-y-6">
        {!matchInfo && <DataMissingIndicator collectionPath="/match" expectedDocId={`${matchId}:info`} schemaInterface={`{ "scoreHome": 0, "scoreAway": 0, "period": 1 }`} />}
        {!matchEvents && <DataMissingIndicator collectionPath="/match" expectedDocId={`${matchId}:events`} schemaInterface={`{ "events": [] }`} />}
        <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 rounded">Seed Live Match Data</button>
      </div>
    );
  }

  const recordEvent = async (type, teamId) => {
    dispatch({ type: 'SET_RECORDING', payload: true });

    const newEvent = {
      id: `EVT_${Date.now()}`,
      type: type,
      teamId: teamId,
      timestamp: new Date().toISOString(),
      period: matchInfo.period,
      timeString: matchInfo.time
    };

    // Optimistic UI update via reducer
    dispatch({
      type: 'ADD_EVENT',
      payload: newEvent,
      meta: { homeTeam: matchInfo.homeTeam }
    });

    // Determine new score based on state + current event
    // Using current state isn't perfectly race-condition safe for network requests,
    // but works for this prototype level mock.
    const isGoal = type === CONFIG.EVENT_TYPES.GOAL;
    const isHome = teamId === matchInfo.homeTeam;

    // Sync with backend (mock)
    await Promise.all([
      updateMatchEvents({ events: [...state.events, newEvent] }),
      isGoal ? updateMatchInfo({
        scoreHome: isHome ? state.scoreHome + 1 : state.scoreHome,
        scoreAway: !isHome ? state.scoreAway + 1 : state.scoreAway,
      }) : Promise.resolve()
    ]);

    dispatch({ type: 'SET_RECORDING', payload: false });
  };

  // Combine matchInfo header info with reducer-managed scores for display
  const displayMatchInfo = {
    ...matchInfo,
    scoreHome: state.scoreHome,
    scoreAway: state.scoreAway
  };

  const isLive = matchInfo.status === CONFIG.MATCH_STATUS.LIVE;
  const isFinal = matchInfo.status === CONFIG.MATCH_STATUS.FINAL;
  const isScheduled = matchInfo.status === CONFIG.MATCH_STATUS.SCHEDULED;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">Match Status: <span className="text-white">{matchInfo.status}</span></div>
        <div className="flex items-center space-x-4">
          {isLive && (
            <label className="flex items-center space-x-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={simulationActive}
                onChange={(e) => setSimulationActive(e.target.checked)}
                className="rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Simulate External Events</span>
            </label>
          )}
          <div className="space-x-2">
            {isScheduled && (
              <button onClick={() => handleStatusChange(CONFIG.MATCH_STATUS.LIVE)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm transition-colors">Start Match</button>
            )}
            {isLive && (
              <button onClick={() => handleStatusChange(CONFIG.MATCH_STATUS.FINAL)} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors">End Match</button>
            )}
          </div>
        </div>
      </div>

      <ScoreboardHeader matchInfo={displayMatchInfo} />

      {isScheduled && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Match Scheduled</h2>
            <p className="text-slate-400 mb-6">Puck drops at {new Date(matchInfo.matchDate).toLocaleString()}</p>
            <div className="text-4xl font-mono bg-slate-800 inline-block px-6 py-4 rounded-lg border border-slate-700 shadow-inner">
               23:59:59 {/* Static countdown for prototype */}
            </div>
            <div className="mt-8">
               <a href={`/match/${matchId}/rsvp`} className="text-emerald-400 hover:text-emerald-300 underline">View RSVPs</a>
            </div>
        </div>
      )}

      {(isLive || isFinal) && (
        <>
          <div className="grid grid-cols-2 gap-6">
            <ScorekeeperControls
              teamName={matchInfo.homeName}
              teamId={matchInfo.homeTeam}
              recordEvent={recordEvent}
              isRecording={state.isRecording || isFinal}
              isHome={true}
              disabled={isFinal}
            />
            <ScorekeeperControls
              teamName={matchInfo.awayName}
              teamId={matchInfo.awayTeam}
              recordEvent={recordEvent}
              isRecording={state.isRecording || isFinal}
              isHome={false}
              disabled={isFinal}
            />
          </div>

          <EventLog
            events={state.events}
            homeTeam={matchInfo.homeTeam}
            homeName={matchInfo.homeName}
            awayName={matchInfo.awayName}
          />
        </>
      )}
    </div>
  );
}
