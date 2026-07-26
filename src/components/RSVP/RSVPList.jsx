import { CONFIG, getLabelByCode } from '../../../constants';

export default function RSVPList({ responses, attending, notAttending }) {
  const attendingCode = CONFIG.RSVP_STATUS[0].code;
  const notAttendingCode = CONFIG.RSVP_STATUS[1].code;

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold mb-4 flex justify-between">
        <span>Team Responses</span>
        <span className="text-sm font-normal text-slate-400">{attending} In • {notAttending} Out</span>
      </h3>

      <div className="space-y-3">
        {responses.map((resp, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
            <span className="font-medium">{resp.name || resp.playerId}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              resp.status === attendingCode ? 'bg-emerald-500/20 text-emerald-400' :
              resp.status === notAttendingCode ? 'bg-red-500/20 text-red-400' :
              'bg-orange-500/20 text-orange-400'
            }`}>
              {getLabelByCode('RSVP_STATUS', resp.status)}
            </span>
          </div>
        ))}
        {responses.length === 0 && <p className="text-slate-400 italic">No responses yet.</p>}
      </div>
    </div>
  );
}
