import { Outlet, Link } from 'react-router-dom';
import { Home, Users, Activity, CalendarCheck, MessageSquare } from 'lucide-react';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-700">
          Ice Hockey Manager
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700">
            <Home className="w-5 h-5 text-slate-400" />
            <span>Standings</span>
          </Link>
          <Link to="/team/TEAM_001" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700">
            <Users className="w-5 h-5 text-slate-400" />
            <span>Team Roster</span>
          </Link>
          <Link to="/match/MCH_2026_001/scorekeeper" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700">
            <Activity className="w-5 h-5 text-slate-400" />
            <span>Live Scorekeeper</span>
          </Link>
          <Link to="/match/MCH_2026_001/rsvp" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700">
            <CalendarCheck className="w-5 h-5 text-slate-400" />
            <span>RSVP</span>
          </Link>
          <Link to="/social" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700">
            <MessageSquare className="w-5 h-5 text-slate-400" />
            <span>Social & Market</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link to="/admin" className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 text-emerald-400">
            <Activity className="w-5 h-5" />
            <span>Admin Panel</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-0 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
