import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';

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

      <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-12">#</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">GP</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">GF</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">GA</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-16">GD</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-900 uppercase tracking-wider text-center w-20">PTS ▼</th>
              <th className="py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-32">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.teams.sort((a, b) => b.points - a.points).map((team, index) => (
              <tr key={team.teamId} className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 px-4 text-slate-500 font-medium">{index + 1}</td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {team.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-slate-900">{team.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-center text-slate-500">{team.played}</td>
                <td className="py-2.5 px-4 text-center text-slate-500">{team.goalsFor}</td>
                <td className="py-2.5 px-4 text-center text-slate-500">{team.goalsAgainst}</td>
                <td className="py-2.5 px-4 text-center text-slate-500">{team.goalsFor - team.goalsAgainst}</td>
                <td className="py-2.5 px-4 text-center font-bold text-blue-600">{team.points}</td>
                <td className="py-2.5 px-4 text-center">
                  <div className="flex justify-center gap-1">
                    {team.form.split('').map((result, i) => (
                      <span key={i} className={`w-4 h-4 flex items-center justify-center rounded-sm text-[10px] font-bold text-white ${result === 'W' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                        {result}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
