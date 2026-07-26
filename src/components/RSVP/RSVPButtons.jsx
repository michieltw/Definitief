import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { CONFIG, getLabelByCode } from '../../../constants';

export default function RSVPButtons({ currentUserResponse, handleRSVP }) {
  const attendingCode = CONFIG.RSVP_STATUS[0].code;
  const notAttendingCode = CONFIG.RSVP_STATUS[1].code;
  const tentativeCode = CONFIG.RSVP_STATUS[2].code;

  return (
    <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-100">
      <h2 className="text-lg font-bold mb-4">Your Attendance</h2>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleRSVP(attendingCode)}
          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === attendingCode ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
        >
          <CheckCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === attendingCode ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span className={`font-medium ${currentUserResponse?.status === attendingCode ? 'text-emerald-700' : 'text-slate-500'}`}>
            {getLabelByCode('RSVP_STATUS', attendingCode)}
          </span>
        </button>

        <button
          onClick={() => handleRSVP(notAttendingCode)}
          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === notAttendingCode ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
        >
          <XCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === notAttendingCode ? 'text-red-600' : 'text-slate-400'}`} />
          <span className={`font-medium ${currentUserResponse?.status === notAttendingCode ? 'text-red-700' : 'text-slate-500'}`}>
            {getLabelByCode('RSVP_STATUS', notAttendingCode)}
          </span>
        </button>

        <button
          onClick={() => handleRSVP(tentativeCode)}
          className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === tentativeCode ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}
        >
          <HelpCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === tentativeCode ? 'text-orange-600' : 'text-slate-400'}`} />
          <span className={`font-medium ${currentUserResponse?.status === tentativeCode ? 'text-orange-700' : 'text-slate-500'}`}>
            {getLabelByCode('RSVP_STATUS', tentativeCode)}
          </span>
        </button>
      </div>
    </div>
  );
}
