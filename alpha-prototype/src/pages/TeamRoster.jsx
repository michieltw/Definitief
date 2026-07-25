import { useParams } from 'react-router-dom';
import { useFirestoreDocument, useFirestoreCollection } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';

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
          <div key={player.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 text-slate-900 relative overflow-hidden">
            {/* Accent border top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-400">
                {player.name.charAt(0)}
              </div>
              <div className="text-3xl font-black text-slate-200">
                #{player.number}
              </div>
            </div>

            <h3 className="text-lg font-bold">{player.name}</h3>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">Position</span>
                <span className="font-semibold">{player.position}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs uppercase tracking-wider">Shoots</span>
                <span className="font-semibold">{player.shoots}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                View Full Profile & Stats
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
