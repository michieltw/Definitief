import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import StandingsTable from '../components/Standings/StandingsTable';

export default function StandingsDashboard() {
  const seasonId = 'SZN_2026';
  const divisionId = 'DIV_001';

  // Data structure: stand:[SEIZOEN]:[DIVISIE_ID]
  const docId = `${seasonId}:${divisionId}`;

  const { data, loading, setDoc } = useFirestoreDocument('stand', docId);

  // Helper to inject initial data for the prototype since there's no backend
  const handleSeedData = async () => {
    await setDoc({
      teams: [
        { teamId: 'TEAM_001', name: 'Amsterdam Tigers', points: 15, played: 5, goalsFor: 25, goalsAgainst: 10, form: 'WWWWW' },
        { teamId: 'TEAM_002', name: 'Heerenveen Flyers', points: 12, played: 5, goalsFor: 18, goalsAgainst: 12, form: 'WWLWW' },
        { teamId: 'TEAM_003', name: 'Nijmegen Devils', points: 9, played: 5, goalsFor: 15, goalsAgainst: 15, form: 'WLLWW' },
      ]
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-slate-800 rounded animate-pulse"></div>
        <div className="h-64 bg-slate-800 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!data || !data.teams) {
    return (
      <div className="space-y-6">
        <DataMissingIndicator
          collectionPath="/stand"
          expectedDocId={docId}
          schemaInterface={`{ "teams": [ { "teamId": "TEAM_001", "punten": 12, "gespeeld": 5, "goalsVoor": 20, "goalsTegen": 8 } ] }`}
        />
        <button
          onClick={handleSeedData}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium transition-colors"
        >
          [Dev] Seed Standings Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Division Standings</h1>
          <p className="text-slate-400 text-sm">Season 2026/2027 • First Division</p>
        </div>
      </div>

      <StandingsTable teams={data.teams} />
    </div>
  );
}
