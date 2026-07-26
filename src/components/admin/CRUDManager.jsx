import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import DataMissingIndicator from '../DataMissingIndicator';

// Core Schema Definition matching Firebase_NoSQL_Datamodel_Hockey.md
const CORE_COLLECTIONS = [
  { id: 'person', name: 'Persons' },
  { id: 'user', name: 'Users' },
  { id: 'player', name: 'Players' },
  { id: 'organization', name: 'Organizations' },
  { id: 'team', name: 'Teams' },
  { id: 'location', name: 'Locations' },
  { id: 'season', name: 'Seasons' },
  { id: 'competition', name: 'Competitions' },
  { id: 'match', name: 'Matches' },
  { id: 'stand', name: 'Standings (O1)' },
  { id: 'stats', name: 'Statistics (O1)' },
  { id: 'social', name: 'Social Feeds' },
  { id: 'chat', name: 'Chat Channels' },
  { id: 'finance', name: 'Finances' },
  { id: 'subscription', name: 'Subscriptions' },
  { id: 'training', name: 'Trainings' },
  { id: 'transfers', name: 'Transfers' },
  { id: 'dfs', name: 'DFS Slates' },
  { id: 'marketplace', name: 'Marketplace' }
];

export default function CRUDManager() {
  const [activeCollection, setActiveCollection] = useState('team');
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(false);

  // [Verified against GitHub: Firebase_NoSQL_Datamodel_Hockey.md -> Universal CRUD]
  const fetchDocuments = async (colId) => {
    setLoading(true);
    try {
      // In a real implementation we'd handle the document ID structures (e.g. team:[TEAM_ID])
      // This is a simplified fetch for the UI structural implementation
      const querySnapshot = await getDocs(collection(db, colId));
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docs.length > 0 ? docs : null);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments(activeCollection);
  }, [activeCollection]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded border border-slate-700">
      <div className="flex gap-4 p-4 border-b border-slate-700 overflow-x-auto bg-slate-800">
        {CORE_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveCollection(col.id)}
            className={`px-4 py-2 rounded font-semibold whitespace-nowrap transition-colors ${
              activeCollection === col.id ? 'bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      <div className="p-4 flex justify-between items-center bg-slate-800">
        <h2 className="text-xl font-bold text-slate-100">Managing {CORE_COLLECTIONS.find(c => c.id === activeCollection)?.name}</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-medium">
          <Plus className="w-4 h-4" /> New Document
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-800 rounded w-full"></div>
            ))}
          </div>
        ) : !documents ? (
          <DataMissingIndicator
            collectionPath={`/${activeCollection}`}
            expectedDocId={`<ANY_VALID_DOC_ID>`}
            schemaInterface={`Expected document format for ${activeCollection}`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="p-3 text-slate-400 font-medium">ID</th>
                  <th className="p-3 text-slate-400 font-medium">Data Preview</th>
                  <th className="p-3 text-slate-400 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-mono text-sm text-emerald-400">{doc.id}</td>
                    <td className="p-3">
                      <pre className="text-xs text-slate-300 max-w-md truncate">
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                    </td>
                    <td className="p-3 flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
