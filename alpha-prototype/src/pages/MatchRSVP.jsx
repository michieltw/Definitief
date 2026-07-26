import { useParams } from 'react-router-dom';
import { useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function MatchRSVP() {
  const { matchId } = useParams();
  const currentUserId = 'PLR_001'; // Simulated logged-in user

  // RSVP Document path: match:[WEDSTRIJD_ID]:rsvp
  const { data: rsvpData, loading, updateDoc, setDoc } = useFirestoreDocument('match', `${matchId}:rsvp`);

  const handleSeedData = async () => {
    await setDoc({
      matchDate: '2026-10-14T20:00:00Z',
      opponent: 'Heerenveen Flyers',
      responses: [
        { playerId: 'PLR_002', status: 'ATTENDING', name: 'Jane Smith' },
        { playerId: 'PLR_003', status: 'NOT_ATTENDING', name: 'Bob Johnson' }
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
  const attending = responses.filter(r => r.status === 'ATTENDING').length;
  const notAttending = responses.filter(r => r.status === 'NOT_ATTENDING').length;

  const handleRSVP = async (status) => {
    // Optimistic / simulated update
    const newResponses = [...responses.filter(r => r.playerId !== currentUserId), { playerId: currentUserId, name: 'John Doe (You)', status }];
    await updateDoc({ responses: newResponses });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white text-slate-900 rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-4 mb-4">
          <h1 className="text-2xl font-bold">vs. {rsvpData.opponent || 'TBD'}</h1>
          <p className="text-slate-500">{new Date(rsvpData.matchDate).toLocaleString()}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-100">
          <h2 className="text-lg font-bold mb-4">Your Attendance</h2>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleRSVP('ATTENDING')}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === 'ATTENDING' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}
            >
              <CheckCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === 'ATTENDING' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${currentUserResponse?.status === 'ATTENDING' ? 'text-emerald-700' : 'text-slate-500'}`}>Attending</span>
            </button>

            <button
              onClick={() => handleRSVP('NOT_ATTENDING')}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === 'NOT_ATTENDING' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-red-300'}`}
            >
              <XCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === 'NOT_ATTENDING' ? 'text-red-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${currentUserResponse?.status === 'NOT_ATTENDING' ? 'text-red-700' : 'text-slate-500'}`}>Not Attending</span>
            </button>

            <button
              onClick={() => handleRSVP('TENTATIVE')}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${currentUserResponse?.status === 'TENTATIVE' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-orange-300'}`}
            >
              <HelpCircle className={`w-8 h-8 mb-2 ${currentUserResponse?.status === 'TENTATIVE' ? 'text-orange-600' : 'text-slate-400'}`} />
              <span className={`font-medium ${currentUserResponse?.status === 'TENTATIVE' ? 'text-orange-700' : 'text-slate-500'}`}>Tentative</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex justify-between">
          <span>Team Responses</span>
          <span className="text-sm font-normal text-slate-400">{attending} In • {notAttending} Out</span>
        </h3>

        <div className="space-y-3">
          {responses.map((resp, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700">
              <span className="font-medium">{resp.name || resp.playerId}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                resp.status === 'ATTENDING' ? 'bg-emerald-500/20 text-emerald-400' :
                resp.status === 'NOT_ATTENDING' ? 'bg-red-500/20 text-red-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {resp.status}
              </span>
            </div>
          ))}
          {responses.length === 0 && <p className="text-slate-400 italic">No responses yet.</p>}
        </div>
      </div>
    </div>
  );
}
