import { useState } from 'react';
import { Plus, Trash2, Save, Settings } from 'lucide-react';

export default function SchemaBuilder() {
  const [customCollections] = useState([
    {
      id: 'sponsors',
      name: 'Sponsors',
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'value', type: 'number', required: false }
      ]
    }
  ]);

  const [activeSchema, setActiveSchema] = useState(null);

  return (
    <div className="flex h-full gap-6">
      {/* Schema List */}
      <div className="w-1/3 bg-slate-800 rounded border border-slate-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" /> Custom Collections
          </h2>
          <button className="p-1 hover:bg-slate-700 rounded text-emerald-400">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-2">
          {customCollections.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveSchema(col)}
              className={`w-full text-left p-3 rounded transition-colors ${
                activeSchema?.id === col.id ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-700 hover:bg-slate-600'
              } border border-transparent`}
            >
              <div className="font-semibold">{col.name}</div>
              <div className="text-xs text-slate-300 mt-1">{col.fields.length} fields defined</div>
            </button>
          ))}
          {customCollections.length === 0 && (
            <div className="text-slate-400 text-sm italic">No custom collections defined yet.</div>
          )}
        </div>
      </div>

      {/* Schema Editor */}
      <div className="flex-1 bg-slate-800 rounded border border-slate-700 p-6 flex flex-col">
        {activeSchema ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{activeSchema.name} Schema</h2>
                <div className="text-sm text-slate-400 font-mono">Collection ID: {activeSchema.id}</div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium">
                <Save className="w-4 h-4" /> Save Schema
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-auto">
              {activeSchema.fields.map((field, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-slate-700 p-4 rounded">
                  <input
                    type="text"
                    value={field.name}
                    placeholder="Field Name"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-slate-100"
                    readOnly
                  />
                  <select
                    value={field.type}
                    className="bg-slate-800 border border-slate-600 rounded p-2 text-slate-100"
                    disabled
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date (ISO)</option>
                    <option value="reference">Reference (ID)</option>
                  </select>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input type="checkbox" checked={field.required} readOnly className="accent-emerald-500" />
                    Required
                  </label>
                  <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button className="w-full py-3 border-2 border-dashed border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 rounded flex items-center justify-center gap-2 font-medium transition-colors">
                <Plus className="w-5 h-5" /> Add Field
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
            <Settings className="w-16 h-16 opacity-20" />
            <p>Select a collection to edit its schema, or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
