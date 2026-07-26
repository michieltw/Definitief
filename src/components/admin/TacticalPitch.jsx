import { useState, useEffect } from 'react';
import { Users, AlertCircle, Save } from 'lucide-react';
import { useFirestoreDocument } from '../../hooks/useFirestore';
import DataMissingIndicator from '../DataMissingIndicator';

export default function TacticalPitch() {
  const { data: rosterDoc, loading } = useFirestoreDocument('match', 'MCH_2026_001:roster');

  const [benched, setBenched] = useState([]);
  const [onIce, setOnIce] = useState([]);

  useEffect(() => {
    if (rosterDoc && rosterDoc.rosterHome) {
      // In a real app we'd likely map the roster IDs to actual player profiles here.
      // Since the rule is no mock data, we will map what is available in the doc.
      setBenched(rosterDoc.rosterHome);
    }
  }, [rosterDoc]);

  // Basic drag and drop state
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  const handleDragStart = (e, player, source) => {
    setDraggedPlayer({ player, source });
    // Required for Firefox
    e.dataTransfer.setData('text/plain', player.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleDropOnIce = (e, zoneX, zoneY) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    const { player, source } = draggedPlayer;

    if (source === 'bench') {
      setBenched(benched.filter(p => p.id !== player.id));
    } else {
      setOnIce(onIce.filter(p => p.id !== player.id));
    }

    setOnIce([...onIce.filter(p => p.id !== player.id), { ...player, x: zoneX, y: zoneY }]);
    setDraggedPlayer(null);
  };

  const handleDropOnBench = (e) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    const { player, source } = draggedPlayer;

    if (source === 'ice') {
      setOnIce(onIce.filter(p => p.id !== player.id));
      setBenched([...benched, player]);
    }
    setDraggedPlayer(null);
  };

  if (loading) {
    return <div className="text-slate-400 p-8">Loading match roster...</div>;
  }

  if (!rosterDoc) {
    return (
      <div className="p-8 w-full max-w-3xl mx-auto">
        <DataMissingIndicator
          collectionPath="/match"
          expectedDocId="MCH_2026_001:roster"
          schemaInterface={`{ "homeTeamId": "TEAM_001", "rosterHome": [ { "playerId": "PLR_001", "jerseyNumber": 10, "positionCode": "C" } ] }`}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar: Bench & Roster */}
      <div className="w-1/4 bg-slate-800 rounded border border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-emerald-500"/> Team Roster</h2>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded">{benched.length} Available</span>
        </div>

        <div
          className="flex-1 p-4 overflow-auto space-y-2"
          onDragOver={handleDragOver}
          onDrop={handleDropOnBench}
        >
          {benched.length === 0 && (
            <div className="text-center p-4 text-slate-500 text-sm italic border-2 border-dashed border-slate-700 rounded">
              Bench is empty. Drop players here to remove from ice.
            </div>
          )}
          {benched.map(player => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => handleDragStart(e, player, 'bench')}
              className="bg-slate-700 p-3 rounded cursor-grab active:cursor-grabbing border border-slate-600 hover:border-emerald-500 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-slate-900 text-slate-300 flex items-center justify-center rounded text-xs font-mono">{player.jerseyNumber || '?'}</span>
                <span className="font-medium text-sm">{player.playerId}</span>
              </div>
              <span className="text-xs font-bold text-slate-400 w-6 text-center">{player.positionCode}</span>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700 bg-slate-900/30">
           <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium flex items-center justify-center gap-2">
             <Save className="w-4 h-4"/> Save Lineup
           </button>
        </div>
      </div>

      {/* Main Area: Tactical Pitch */}
      <div className="flex-1 bg-slate-800 rounded border border-slate-700 p-6 flex flex-col items-center justify-center relative overflow-hidden">

        <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-slate-400">
           <span className="font-mono text-sm bg-slate-900 px-3 py-1 rounded">Match Roster: MCH_2026_001</span>
           <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-900/20 px-3 py-1 rounded">
             <AlertCircle className="w-4 h-4" /> Drop players onto the ice
           </div>
        </div>

        {/* Ice Rink Representation */}
        <div
          className="relative w-full max-w-3xl bg-blue-50/10 border-4 border-blue-900/50 rounded-[4rem] aspect-[1/2] md:aspect-[2/1] overflow-hidden shadow-2xl mx-auto mt-8"
          onDragOver={handleDragOver}
          onDrop={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            // Calculate relative percentage
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            handleDropOnIce(e, x, y);
          }}
        >
          {/* Center Line (Red) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-red-900/40 -translate-x-1/2" />
          {/* Blue Lines */}
          <div className="absolute top-0 bottom-0 left-[35%] w-2 bg-blue-900/40 -translate-x-1/2" />
          <div className="absolute top-0 bottom-0 right-[35%] w-2 bg-blue-900/40 -translate-x-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-blue-900/40 rounded-full -translate-x-1/2 -translate-y-1/2" />
          {/* Goal Creases */}
          <div className="absolute top-1/2 left-4 w-12 h-16 bg-blue-900/30 rounded-r-full -translate-y-1/2" />
          <div className="absolute top-1/2 right-4 w-12 h-16 bg-blue-900/30 rounded-l-full -translate-y-1/2" />

          {/* Render Players on Ice */}
          {onIce.map(player => (
            <div
              key={player.id}
              draggable
              onDragStart={(e) => handleDragStart(e, player, 'ice')}
              className="absolute w-10 h-10 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing text-emerald-400 font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
              title={player.playerId}
            >
              {player.jerseyNumber || '?'}
              <div className="absolute -bottom-6 text-[10px] whitespace-nowrap bg-slate-900/80 px-1 rounded text-white">
                {player.positionCode}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
