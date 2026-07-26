import { getLabelByCode } from '../../lib/constants';

export default function PlayerCard({ player }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 text-slate-900 relative overflow-hidden">
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
          <span className="font-semibold">{getLabelByCode('POSITIONS', player.position)}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-xs uppercase tracking-wider">Shoots</span>
          <span className="font-semibold">{getLabelByCode('SHOOTS', player.shoots)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
          View Full Profile & Stats
        </button>
      </div>
    </div>
  );
}
