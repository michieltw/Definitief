import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { CONFIG, getLabelByCode } from '../../constants'; // Need to create this

export default function MatchScorekeeper() {
  const { matchId } = useParams();

  // Fetch Match Info (header)
  const { data: matchInfo, loading: infoLoading, updateDoc: updateMatchInfo, setDoc: setMatchInfo } = useFirestoreDocument('match', `${matchId}:info`);

  // Fetch Match Events (append-only array ideally, but here we just mock the array in a single doc)
  const { data: matchEvents, loading: eventsLoading, updateDoc: updateMatchEvents, setDoc: setMatchEvents } = useFirestoreDocument('match', `${matchId}:events`);

  const [isRecording, setIsRecording] = useState(false);

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
      status: 'LIVE'
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

  const recordEvent = async (type, team) => {
    setIsRecording(true);

    const newEvent = {
      id: `EVT_${Date.now()}`,
      type: type,
      teamId: team,
      timestamp: new Date().toISOString(),
      period: matchInfo.period,
      timeString: matchInfo.time // In real app, we'd need a running clock
    };

    // Append event
    const currentEvents = matchEvents.events || [];
    await updateMatchEvents({ events: [...currentEvents, newEvent] });

    // Update score if goal
    if (type === 'GOAL') {
      if (team === matchInfo.homeTeam) {
        await updateMatchInfo({ scoreHome: matchInfo.scoreHome + 1 });
      } else {
        await updateMatchInfo({ scoreAway: matchInfo.scoreAway + 1 });
      }
    }

    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard Header */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl flex items-center justify-between">
        <div className="text-center w-1/3">
          <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">Home</div>
          <div className="text-2xl font-bold">{matchInfo.homeName}</div>
          <div className="text-6xl font-black mt-2 text-emerald-400">{matchInfo.scoreHome}</div>
        </div>

        <div className="text-center w-1/3 flex flex-col items-center">
          <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest mb-4">
            Live
          </div>
          <div className="text-slate-400 font-mono">Period {matchInfo.period}</div>
          <div className="text-4xl font-mono font-bold my-2">{matchInfo.time}</div>
        </div>

        <div className="text-center w-1/3">
          <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">Away</div>
          <div className="text-2xl font-bold">{matchInfo.awayName}</div>
          <div className="text-6xl font-black mt-2 text-blue-400">{matchInfo.scoreAway}</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-2 gap-6">
        {/* Home Controls */}
        <div className="bg-slate-800 rounded p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">{matchInfo.homeName} Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isRecording}
              onClick={() => recordEvent('GOAL', matchInfo.homeTeam)}
              className="bg-emerald-600 hover:bg-emerald-500 py-3 rounded font-bold transition-colors disabled:opacity-50"
            >
              + GOAL
            </button>
            <button
              disabled={isRecording}
              onClick={() => recordEvent('SOG', matchInfo.homeTeam)}
              className="bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold transition-colors disabled:opacity-50"
            >
              Shot on Goal
            </button>
            <button
              disabled={isRecording}
              onClick={() => recordEvent('PENALTY', matchInfo.homeTeam)}
              className="bg-red-900/50 hover:bg-red-800/50 text-red-200 border border-red-900 py-3 rounded font-bold transition-colors col-span-2 disabled:opacity-50"
            >
              Penalty
            </button>
          </div>
        </div>

        {/* Away Controls */}
        <div className="bg-slate-800 rounded p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">{matchInfo.awayName} Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isRecording}
              onClick={() => recordEvent('GOAL', matchInfo.awayTeam)}
              className="bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition-colors disabled:opacity-50"
            >
              + GOAL
            </button>
            <button
              disabled={isRecording}
              onClick={() => recordEvent('SOG', matchInfo.awayTeam)}
              className="bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold transition-colors disabled:opacity-50"
            >
              Shot on Goal
            </button>
             <button
              disabled={isRecording}
              onClick={() => recordEvent('PENALTY', matchInfo.awayTeam)}
              className="bg-red-900/50 hover:bg-red-800/50 text-red-200 border border-red-900 py-3 rounded font-bold transition-colors col-span-2 disabled:opacity-50"
            >
              Penalty
            </button>
          </div>
        </div>
      </div>

      {/* Event Feed */}
      <div className="bg-white text-slate-900 rounded border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Event Log</h3>
        <div className="space-y-2 h-64 overflow-y-auto">
          {[...(matchEvents.events || [])].reverse().map(evt => (
            <div key={evt.id} className="flex items-center p-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm">
              <div className="w-16 font-mono text-slate-500">{evt.timeString}</div>
              <div className="w-24">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${evt.type === 'GOAL' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {evt.type}
                </span>
              </div>
              <div className="flex-1">
                {evt.teamId === matchInfo.homeTeam ? matchInfo.homeName : matchInfo.awayName}
              </div>
            </div>
          ))}
          {(!matchEvents.events || matchEvents.events.length === 0) && (
            <div className="text-slate-400 italic text-center py-8">No events recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
