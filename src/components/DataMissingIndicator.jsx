import { AlertTriangle } from 'lucide-react';

export default function DataMissingIndicator({ collectionPath, expectedDocId, schemaInterface }) {
  return (
    <div className="border border-red-500/50 bg-red-500/10 p-6 rounded-lg font-mono text-sm">
      <div className="flex items-center gap-3 text-red-400 mb-4">
        <AlertTriangle className="w-6 h-6" />
        <h3 className="text-lg font-bold">Data Missing</h3>
      </div>

      <p className="text-slate-300 mb-4">
        Strict zero-mock-data policy enforced. The required Firestore document was not found.
      </p>

      <div className="bg-slate-900 p-4 rounded border border-slate-700 space-y-2">
        <div className="flex">
          <span className="text-slate-500 w-32">Collection Path:</span>
          <span className="text-emerald-400">{collectionPath}</span>
        </div>
        <div className="flex">
          <span className="text-slate-500 w-32">Expected Doc ID:</span>
          <span className="text-cyan-400">{expectedDocId}</span>
        </div>
      </div>

      {schemaInterface && (
        <div className="mt-4">
          <span className="text-slate-500 mb-2 block">Expected Schema Interface:</span>
          <pre className="bg-slate-900 p-4 rounded border border-slate-700 text-slate-300 overflow-x-auto">
            {schemaInterface}
          </pre>
        </div>
      )}
    </div>
  );
}
