import { useState } from 'react';
import { Database, Shield, Users, Calendar, Activity, X } from 'lucide-react';

const MAP_NODES = [
  { id: 'team', label: 'Teams', icon: Shield, type: 'core', x: 200, y: 150 },
  { id: 'player', label: 'Players', icon: Users, type: 'core', x: 400, y: 100 },
  { id: 'match', label: 'Matches', icon: Calendar, type: 'core', x: 400, y: 250 },
  { id: 'stats', label: 'Stats', icon: Activity, type: 'derived', x: 600, y: 175 },
  { id: 'user', label: 'Users', icon: Users, type: 'auth', x: 50, y: 50 }
];

const MAP_EDGES = [
  { source: 'team', target: 'player', label: 'has members' },
  { source: 'team', target: 'match', label: 'plays in' },
  { source: 'player', target: 'stats', label: 'generates' },
  { source: 'match', target: 'stats', label: 'updates' }
];

export default function VisualDataMap() {
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex h-full gap-4 relative">
      {/* Visual Canvas */}
      <div className={`flex-1 bg-slate-800 rounded border border-slate-700 relative overflow-hidden transition-all ${selectedNode ? 'mr-[320px]' : ''}`}>
        <div className="absolute top-4 left-4 text-slate-400 font-mono text-sm flex items-center gap-2">
          <Database className="w-4 h-4" /> Cluster Overview Map
        </div>

        {/* Render Edges (Simplified straight lines for demo) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {MAP_EDGES.map((edge, idx) => {
            const sourceNode = MAP_NODES.find(n => n.id === edge.source);
            const targetNode = MAP_NODES.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={idx}>
                <line
                  x1={sourceNode.x + 48}
                  y1={sourceNode.y + 24}
                  x2={targetNode.x}
                  y2={targetNode.y + 24}
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Midpoint Label could go here */}
              </g>
            );
          })}
        </svg>

        {/* Render Nodes */}
        {MAP_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node)}
              className={`absolute flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border-2 transition-transform hover:scale-105 ${
                selectedNode?.id === node.id
                  ? 'bg-emerald-900 border-emerald-500 text-emerald-100 z-10'
                  : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-emerald-400 z-0'
              }`}
              style={{ left: node.x, top: node.y, width: '120px', height: '48px', justifyContent: 'center' }}
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold text-sm">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Edit Drawer */}
      <div
        className={`absolute top-0 right-0 h-full w-80 bg-slate-800 border-l border-slate-700 shadow-2xl transition-transform duration-300 transform ${
          selectedNode ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedNode && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900/50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <selectedNode.icon className="w-5 h-5 text-emerald-500" />
                Quick Edit: {selectedNode.label}
              </h3>
              <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto">
              <p className="text-sm text-slate-400 mb-6">Select a document below to quick-edit its properties without leaving the map.</p>

              {/* Dummy list for quick edit */}
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-700/50 border border-slate-600 rounded p-3">
                    <div className="font-mono text-xs text-emerald-400 mb-1">{selectedNode.id}_00{i}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Example Entity {i}</span>
                      <button className="text-xs bg-slate-600 hover:bg-emerald-600 px-2 py-1 rounded transition-colors">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
