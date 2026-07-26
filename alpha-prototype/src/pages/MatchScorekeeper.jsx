import { useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestoreDocument } from '../hooks/useFirestore';
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
      status: CONFIG.MATCH_STATUS.LIVE
    });

    await setMatchEvents({
      events: []
    });
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

  return (
    <div className="space-y-6">
      <ScoreboardHeader matchInfo={displayMatchInfo} />

      <div className="grid grid-cols-2 gap-6">
        <ScorekeeperControls
          teamName={matchInfo.homeName}
          teamId={matchInfo.homeTeam}
          recordEvent={recordEvent}
          isRecording={state.isRecording}
          isHome={true}
        />
        <ScorekeeperControls
          teamName={matchInfo.awayName}
          teamId={matchInfo.awayTeam}
          recordEvent={recordEvent}
          isRecording={state.isRecording}
          isHome={false}
        />
      </div>

      <EventLog
        events={state.events}
        homeTeam={matchInfo.homeTeam}
        homeName={matchInfo.homeName}
        awayName={matchInfo.awayName}
      />
    </div>
  );
}
