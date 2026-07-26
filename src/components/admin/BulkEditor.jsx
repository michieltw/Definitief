import { useState } from 'react';
import { UploadCloud, Download, CheckSquare, Settings2, Play, AlertCircle } from 'lucide-react';

export default function BulkEditor() {
  const [activeTab, setActiveTab] = useState('import'); // 'import', 'export', 'bulk'

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded border border-slate-700">
      <div className="flex gap-4 p-4 border-b border-slate-700 bg-slate-800">
        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'import' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Import Data
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'export' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'bulk' ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" /> Batch Update
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto bg-slate-800">
        {activeTab === 'import' && (
          <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Import Data via CSV/JSON</h2>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer group">
              <UploadCloud className="w-16 h-16 text-slate-400 group-hover:text-emerald-400 mb-4 transition-colors" />
              <h3 className="text-lg font-medium text-slate-200 mb-2">Drag and drop your file here</h3>
              <p className="text-sm text-slate-400 mb-6">Support CSV or JSON formats. Data will be automatically mapped based on headers.</p>
              <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium">
                Browse Files
              </button>
            </div>
            <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded flex gap-3 text-yellow-200/80">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">Imported data must conform to the strict NoSQL Datamodel specifications (e.g. IDs must match TEAM_xxx pattern). Invalid records will be skipped during batch write.</p>
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="max-w-2xl mx-auto mt-8">
             <h2 className="text-xl font-bold mb-4">Export Collection Data</h2>
             <div className="bg-slate-700/50 border border-slate-600 p-6 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Select Collection to Export</label>
                  <select className="w-full bg-slate-800 border border-slate-600 rounded p-3 text-slate-100">
                    <option value="team">Teams (team)</option>
                    <option value="player">Players (player)</option>
                    <option value="match">Matches (match)</option>
                    <option value="stats">Statistics (stats)</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-white font-medium transition-colors">
                    <Download className="w-5 h-5" /> Export as CSV
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium transition-colors">
                    <Download className="w-5 h-5" /> Export as JSON
                  </button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'bulk' && (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Spreadsheet Batch Editor</h2>
              <div className="flex gap-2">
                <select className="bg-slate-700 border border-slate-600 rounded p-2 text-sm">
                  <option>Action: Update Status</option>
                  <option>Action: Assign Team</option>
                  <option>Action: Delete</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white text-sm font-medium">
                  <Play className="w-4 h-4" /> Run Batch Job
                </button>
              </div>
            </div>

            <div className="flex-1 border border-slate-600 rounded bg-slate-900 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-600 bg-slate-800">
                    <th className="p-3 w-10"><input type="checkbox" className="accent-emerald-500" /></th>
                    <th className="p-3 text-slate-300 font-medium">Document ID</th>
                    <th className="p-3 text-slate-300 font-medium">Name / Title</th>
                    <th className="p-3 text-slate-300 font-medium">Current Status</th>
                    <th className="p-3 text-slate-300 font-medium">New Status (Edit)</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-slate-700 hover:bg-slate-800/50">
                      <td className="p-3"><input type="checkbox" className="accent-emerald-500" /></td>
                      <td className="p-3 font-mono text-xs text-slate-400">PLR_00{i}</td>
                      <td className="p-3">Player Name {i}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs">ACTIVE</span>
                      </td>
                      <td className="p-3">
                        <select className="bg-slate-800 border border-slate-600 rounded p-1 text-sm w-full">
                          <option>ACTIVE</option>
                          <option>INJURED</option>
                          <option>SUSPENDED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-slate-400 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Executes using Firestore Batched Writes (Limit 500 ops/batch).
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
