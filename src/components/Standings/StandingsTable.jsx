import StandingsRow from './StandingsRow';

export default function StandingsTable({ teams }) {
  // Sort teams by points descending
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
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
          {sortedTeams.map((team, index) => (
            <StandingsRow key={team.teamId} team={team} rank={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
