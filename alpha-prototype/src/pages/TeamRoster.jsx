import { useParams } from 'react-router-dom';
import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import PlayerCard from '../components/TeamRoster/PlayerCard';

export default function TeamRoster() {
  const { teamId } = useParams();
  const seasonId = 'SZN_2026';

  // Data structure for team stats: team:[SEIZOEN]:[TEAM_ID]:stats
  const statsDocId = `${seasonId}:${teamId}:stats`;
  const { data: teamStats, loading: statsLoading, setDoc: setTeamStats } = useFirestoreDocument('team', statsDocId);

  // Players collection: player (In real app, we'd query by teamId in Firestore, here we mock it)
  // Let's use a specific roster doc instead to match the NoSQL principles
  const rosterDocId = `${seasonId}:${teamId}:roster`;
  const { data: roster, loading: rosterLoading, setDoc: setRoster } = useFirestoreDocument('team', rosterDocId);

  const handleSeedData = async () => {
    await setTeamStats({
      winst: 4,
      verlies: 1,
      vorm: 'WWVWW',
      gemiddeldGoals: 4.0,
      naam: 'Amsterdam Tigers'
    });

    await setRoster({
      players: [
        { id: 'PLR_001', name: 'John Doe', number: 10, position: 'C', shoots: 'L' },
        { id: 'PLR_002', name: 'Jane Smith', number: 22, position: 'LD', shoots: 'R' },
        { id: 'PLR_003', name: 'Bob Johnson', number: 31, position: 'G', shoots: 'L' },
      ]
    });
  };

  const loading = statsLoading || rosterLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 w-full bg-slate-800 rounded animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-800 rounded animate-pulse"></div>)}
        </div>
      </div>
    );
  }

  if (!teamStats || !roster) {
    return (
      <div className="space-y-6">
        {!teamStats && (
          <DataMissingIndicator
            collectionPath="/team"
            expectedDocId={statsDocId}
            schemaInterface={`{ "winst": 4, "verlies": 1, "vorm": "WWVWW", "gemiddeldGoals": 4.0 }`}
          />
        )}
        {!roster && (
          <DataMissingIndicator
            collectionPath="/team"
            expectedDocId={rosterDocId}
            schemaInterface={`{ "players": [ { "id": "PLR_001", "name": "John Doe", "number": 10, "position": "C" } ] }`}
          />
        )}
        <button
          onClick={handleSeedData}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition-colors"
        >
          [Dev] Seed Team Roster Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{teamStats.naam || teamId}</h1>
          <p className="text-slate-400 mt-1">Season 2026/2027 Roster</p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-slate-900 px-4 py-2 rounded">
            <div className="text-sm text-slate-400">Wins</div>
            <div className="text-xl font-bold text-emerald-400">{teamStats.winst}</div>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded">
            <div className="text-sm text-slate-400">Losses</div>
            <div className="text-xl font-bold text-red-400">{teamStats.verlies}</div>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded">
            <div className="text-sm text-slate-400">Avg Goals</div>
            <div className="text-xl font-bold text-blue-400">{teamStats.gemiddeldGoals}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roster.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
