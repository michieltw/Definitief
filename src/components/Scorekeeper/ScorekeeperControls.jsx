import { CONFIG, getLabelByCode } from '../../../constants';

export default function ScorekeeperControls({ teamName, teamId, recordEvent, isRecording, isHome }) {
  return (
    <div className="bg-slate-800 rounded p-6 border border-slate-700">
      <h3 className="text-lg font-bold mb-4 border-b border-slate-700 pb-2">{teamName} Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button
          disabled={isRecording}
          onClick={() => recordEvent(CONFIG.EVENT_TYPES.GOAL, teamId)}
          className={`py-3 rounded font-bold transition-colors disabled:opacity-50 ${isHome ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}
        >
          + {getLabelByCode('EVENT_TYPES', CONFIG.EVENT_TYPES.GOAL)}
        </button>
        <button
          disabled={isRecording}
          onClick={() => recordEvent(CONFIG.EVENT_TYPES.SHOT_ON_GOAL, teamId)}
          className="bg-slate-700 hover:bg-slate-600 py-3 rounded font-bold transition-colors disabled:opacity-50"
        >
          {getLabelByCode('EVENT_TYPES', CONFIG.EVENT_TYPES.SHOT_ON_GOAL)}
        </button>
        <button
          disabled={isRecording}
          onClick={() => recordEvent(CONFIG.EVENT_TYPES.PENALTY, teamId)}
          className="bg-red-900/50 hover:bg-red-800/50 text-red-200 border border-red-900 py-3 rounded font-bold transition-colors col-span-2 disabled:opacity-50"
        >
          {getLabelByCode('EVENT_TYPES', CONFIG.EVENT_TYPES.PENALTY)}
        </button>
      </div>
    </div>
  );
}
