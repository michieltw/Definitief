export default function ScoreboardHeader({ matchInfo }) {
  return (
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
  );
}
