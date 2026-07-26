export default function StandingsRow({ team, rank }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="py-2.5 px-4 text-slate-500 font-medium">{rank}</td>
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
  );
}
