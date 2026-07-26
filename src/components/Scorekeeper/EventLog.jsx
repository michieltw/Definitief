import { CONFIG, getLabelByCode } from '../../../constants';

export default function EventLog({ events, homeTeam, homeName, awayName }) {
  return (
    <div className="bg-white text-slate-900 rounded border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Event Log</h3>
      <div className="space-y-2 h-64 overflow-y-auto">
        {[...events].reverse().map(evt => (
          <div key={evt.id} className="flex items-center p-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm">
            <div className="w-16 font-mono text-slate-500">{evt.timeString}</div>
            <div className="w-24">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${evt.type === CONFIG.EVENT_TYPES.GOAL ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                {getLabelByCode('EVENT_TYPES', evt.type) || evt.type}
              </span>
            </div>
            <div className="flex-1">
              {evt.teamId === homeTeam ? homeName : awayName}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-slate-400 italic text-center py-8">No events recorded yet.</div>
        )}
      </div>
    </div>
  );
}
