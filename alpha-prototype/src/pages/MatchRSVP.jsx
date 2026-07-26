import { useParams } from 'react-router-dom';
import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { CONFIG } from '../lib/constants';
import RSVPButtons from '../components/RSVP/RSVPButtons';
import RSVPList from '../components/RSVP/RSVPList';

export default function MatchRSVP() {
  const { matchId } = useParams();
  const currentUserId = 'PLR_001'; // Simulated logged-in user
  const currentUserName = 'John Doe (You)';

  // RSVP Document path: match:[WEDSTRIJD_ID]:rsvp
  const { data: rsvpData, loading, setDoc, arrayUnion, arrayRemove } = useFirestoreDocument('match', `${matchId}:rsvp`);

  const handleSeedData = async () => {
    await setDoc({
      matchDate: '2026-10-14T20:00:00Z',
      opponent: 'Heerenveen Flyers',
      responses: [
        { playerId: 'PLR_002', status: CONFIG.RSVP_STATUS[0].code, name: 'Jane Smith' },
        { playerId: 'PLR_003', status: CONFIG.RSVP_STATUS[1].code, name: 'Bob Johnson' }
      ]
    });
  };

  if (loading) return <div className="text-slate-400">Loading RSVP data...</div>;

  if (!rsvpData) {
    return (
      <div className="space-y-6">
        <DataMissingIndicator
          collectionPath="/match"
          expectedDocId={`${matchId}:rsvp`}
          schemaInterface={`{ "responses": [ { "playerId": "PLR_001", "status": "ATTENDING" } ] }`}
        />
        <button onClick={handleSeedData} className="px-4 py-2 bg-emerald-600 rounded">Seed RSVP Data</button>
      </div>
    );
  }

  const responses = rsvpData.responses || [];
  const currentUserResponse = responses.find(r => r.playerId === currentUserId);
  const attending = responses.filter(r => r.status === CONFIG.RSVP_STATUS[0].code).length;
  const notAttending = responses.filter(r => r.status === CONFIG.RSVP_STATUS[1].code).length;

  const handleRSVP = async (status) => {
    // Atomic update simulation: remove old, then add new
    if (currentUserResponse) {
      await arrayRemove('responses', { playerId: currentUserId });
    }

    await arrayUnion('responses', {
      playerId: currentUserId,
      name: currentUserName,
      status
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white text-slate-900 rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h1 className="text-2xl font-bold">vs. {rsvpData.opponent || 'TBD'}</h1>
          <p className="text-slate-500">{new Date(rsvpData.matchDate).toLocaleString()}</p>
        </div>

        <RSVPButtons
          currentUserResponse={currentUserResponse}
          handleRSVP={handleRSVP}
        />
      </div>

      <RSVPList
        responses={responses}
        attending={attending}
        notAttending={notAttending}
      />
    </div>
  );
}
