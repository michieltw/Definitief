import React from 'react';

/**
 * [Verified against GitHub: Firebase_NoSQL_Datamodel_Hockey.md -> StandingsDocument]
 */

const StandingsTable = ({ standings, isLoading, divisionId, seasonId }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-lg p-6 shadow-xl w-full">
        <div className="h-8 bg-slate-800 rounded w-1/3 mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!standings || !standings.rows) {
    return (
      <div className="bg-slate-900 border border-red-500/50 rounded-lg p-6 text-slate-300 w-full max-w-2xl">
        <h3 className="text-red-400 font-bold mb-2 flex items-center">
          <span className="mr-2">⚠️</span> REQUIRED FIRESTORE DATA MISSING
        </h3>
        <div className="font-mono text-sm bg-slate-950 p-4 rounded text-slate-400 space-y-1">
          <p>Collection Path: <span className="text-cyan-400">`stand`</span></p>
          <p>Expected Doc ID: <span className="text-cyan-400">`{seasonId || 'SZN_XXXX'}:{divisionId || 'DIV_XXXX'}`</span></p>
          <p>Schema Interface: <span className="text-cyan-400">`StandingsDocument`</span></p>
        </div>
      </div>
    );
  }

  if (standings.rows.length === 0) {
    return (
      <div className="bg-slate-900 rounded-lg p-8 text-center text-slate-400 border border-slate-800">
        <p>No teams found in this division.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-800 w-full">
      <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
        <h2 className="text-xl font-bold text-slate-100">League Standings</h2>
        {standings.lastCalculatedAt && (
          <span className="text-xs text-slate-400">
            Updated: {new Intl.DateTimeFormat(undefined, {
              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }).format(new Date(standings.lastCalculatedAt))}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
          <thead className="text-xs uppercase bg-slate-950/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold w-12 text-center">Rnk</th>
              <th scope="col" className="px-4 py-3 font-semibold">Team</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Games Played">GP</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Wins">W</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Losses">L</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Overtime Wins">OTW</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Overtime Losses">OTL</th>
              <th scope="col" className="px-4 py-3 font-bold text-emerald-400 text-center" title="Points">PTS</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Goals For">GF</th>
              <th scope="col" className="px-3 py-3 font-semibold text-center" title="Goals Against">GA</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center hidden md:table-cell" title="Streak Form">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[...standings.rows]
              .sort((a, b) => a.rank - b.rank)
              .map((row) => (
              <tr key={row.teamId} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3 font-medium text-center">{row.rank}</td>
                <td className="px-4 py-3 font-medium text-slate-100 flex items-center min-w-[150px]">
                  <div className="h-6 w-6 rounded bg-slate-800 mr-3 flex items-center justify-center text-xs overflow-hidden border border-slate-700">
                     {row.teamLogoUrl ? (
                        <img src={row.teamLogoUrl} alt={row.teamName || row.teamId} className="h-full w-full object-cover" />
                     ) : (
                        <span className="text-slate-500">T</span>
                     )}
                  </div>
                  {/* Note: Team Name typically resolved via a mapping or included in row if denormalized */}
                  {row.teamName || row.teamId}
                </td>
                <td className="px-3 py-3 text-center">{row.gamesPlayed}</td>
                <td className="px-3 py-3 text-center">{row.wins}</td>
                <td className="px-3 py-3 text-center">{row.losses}</td>
                <td className="px-3 py-3 text-center">{row.otWins}</td>
                <td className="px-3 py-3 text-center">{row.otLosses}</td>
                <td className="px-4 py-3 font-bold text-emerald-400 text-center bg-emerald-900/10">{row.points}</td>
                <td className="px-3 py-3 text-center">{row.goalsFor}</td>
                <td className="px-3 py-3 text-center">{row.goalsAgainst}</td>
                <td className="px-4 py-3 text-center hidden md:table-cell font-mono text-xs tracking-widest">
                  {row.streakForm?.split('').map((char, idx) => (
                    <span key={idx} className={`inline-block w-4 text-center ${
                      char === 'W' ? 'text-emerald-400' : char === 'L' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {char}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
