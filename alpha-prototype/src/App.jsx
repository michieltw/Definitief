import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import StandingsDashboard from './pages/StandingsDashboard';
import TeamRoster from './pages/TeamRoster';
import MatchScorekeeper from './pages/MatchScorekeeper';
import MatchRSVP from './pages/MatchRSVP';
import SocialFeed from './pages/SocialFeed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StandingsDashboard />} />
          <Route path="team/:teamId" element={<TeamRoster />} />
          <Route path="match/:matchId/scorekeeper" element={<MatchScorekeeper />} />
          <Route path="match/:matchId/rsvp" element={<MatchRSVP />} />
          <Route path="social" element={<SocialFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
