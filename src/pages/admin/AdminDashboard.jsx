import { useState } from 'react';
import { Search, Database, LayoutDashboard, Settings, Map as MapIcon, ArrowRightLeft, Users } from 'lucide-react';
import CRUDManager from '../../components/admin/CRUDManager';
import SchemaBuilder from '../../components/admin/SchemaBuilder';
import VisualDataMap from '../../components/admin/VisualDataMap';
import BulkEditor from '../../components/admin/BulkEditor';
import TacticalPitch from '../../components/admin/TacticalPitch';
import MatchKanban from '../../components/admin/MatchKanban';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('crud');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'crud':
        return <CRUDManager />;
      case 'schema':
        return <SchemaBuilder />;
      case 'map':
        return <VisualDataMap />;
      case 'bulk':
        return <BulkEditor />;
      case 'tactics':
        return <TacticalPitch />;
      case 'kanban':
        return <MatchKanban />;
      default:
        return <CRUDManager />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-500">Database Studio & Master Admin</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Global Entity Search..."
            className="w-full bg-slate-800 border border-slate-700 rounded py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Navigation Sidebar for Admin */}
        <div className="w-48 flex flex-col gap-2">
          <button onClick={() => setActiveTab('crud')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'crud' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <Database className="w-4 h-4" /> Core CRUD
          </button>
          <button onClick={() => setActiveTab('schema')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'schema' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <Settings className="w-4 h-4" /> Schema Builder
          </button>
          <button onClick={() => setActiveTab('map')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'map' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <MapIcon className="w-4 h-4" /> Visual Map
          </button>
          <button onClick={() => setActiveTab('bulk')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'bulk' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-4 h-4" /> Bulk / Import
          </button>
          <button onClick={() => setActiveTab('tactics')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'tactics' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <Users className="w-4 h-4" /> Pitch Mapper
          </button>
          <button onClick={() => setActiveTab('kanban')} className={`flex items-center gap-2 p-2 rounded text-left ${activeTab === 'kanban' ? 'bg-emerald-600' : 'hover:bg-slate-800'}`}>
            <ArrowRightLeft className="w-4 h-4" /> Match Kanban
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-800 rounded-lg p-4 overflow-auto border border-slate-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
