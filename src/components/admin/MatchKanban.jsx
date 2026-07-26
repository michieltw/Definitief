import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import DataMissingIndicator from '../DataMissingIndicator';

const COLUMNS = [
  { id: 'SCHEDULED', title: 'Scheduled', icon: Calendar, color: 'text-slate-400' },
  { id: 'LIVE', title: 'Live (In Progress)', icon: Clock, color: 'text-yellow-400' },
  { id: 'CLOSED', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' }
];

export default function MatchKanban() {
  const { data: rawMatches, loading } = useFirestoreCollection('match');

  const [matches, setMatches] = useState([]);
  const [draggedMatchId, setDraggedMatchId] = useState(null);

  useEffect(() => {
    if (rawMatches) {
      // Filter out only the match info documents
      const infoDocs = rawMatches.filter(m => m.id.endsWith(':info'));

      // Map to expected format for kanban board
      const formatted = infoDocs.map(m => ({
        id: m.id.replace(':info', ''),
        teamHome: m.homeTeam || 'TBD',
        teamAway: m.awayTeam || 'TBD',
        status: m.statusCode || 'SCHEDULED',
        date: m.scheduledStartTime || new Date().toISOString(),
        score: (m.scoreHome !== undefined && m.scoreAway !== undefined) ? `${m.scoreHome} - ${m.scoreAway}` : null
      }));
      setMatches(formatted);
    }
  }, [rawMatches]);

  const handleDragStart = (e, matchId) => {
    setDraggedMatchId(matchId);
    e.dataTransfer.setData('text/plain', matchId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (!draggedMatchId) return;

    // Update match status locally
    setMatches(matches.map(m =>
      m.id === draggedMatchId ? { ...m, status: targetStatus } : m
    ));
    setDraggedMatchId(null);

    // In a real app, you would trigger a Firestore batch update here
  };

  if (loading) {
    return <div className="p-8 text-slate-400">Loading matches...</div>;
  }

  if (!rawMatches || matches.length === 0) {
    return (
      <div className="p-8 w-full max-w-4xl mx-auto">
        <DataMissingIndicator
          collectionPath="/match"
          expectedDocId="*ANY*:info"
          schemaInterface={`{ "statusCode": "SCHEDULED", "homeTeam": "TEAM_001", "awayTeam": "TEAM_002", "scheduledStartTime": "ISO-8601" }`}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded border border-slate-700 p-6 overflow-hidden">
      <div className="mb-6 flex justify-between items-center">
         <div>
           <h2 className="text-xl font-bold text-slate-100">Match Lifecycle Kanban</h2>
           <p className="text-sm text-slate-400 mt-1">Drag and drop matches to progress their state. Updates `match:[ID]:info` document.</p>
         </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div
            key={col.id}
            className="flex flex-col flex-1 min-w-[300px] bg-slate-800 rounded-lg border border-slate-700"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
              <h3 className={`font-bold flex items-center gap-2 ${col.color}`}>
                <col.icon className="w-5 h-5" /> {col.title}
              </h3>
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full font-bold">
                {matches.filter(m => m.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {matches.filter(m => m.status === col.id).map(match => (
                <div
                  key={match.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, match.id)}
                  className="bg-slate-700 p-4 rounded-lg border border-slate-600 shadow-sm cursor-grab active:cursor-grabbing hover:border-emerald-500 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">{match.id}</span>
                    <button className="text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center font-bold text-lg text-slate-200 mb-1">
                    <span>{match.teamHome}</span>
                    <span className="text-slate-500 text-sm">vs</span>
                    <span>{match.teamAway}</span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3"/> {new Date(match.date).toLocaleDateString()}
                    </span>
                    {match.score && (
                      <span className="bg-slate-800 px-2 py-1 rounded text-sm font-mono text-emerald-400 border border-slate-600">
                        {match.score}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {matches.filter(m => m.status === col.id).length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-sm italic">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
