import { useState } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { MessageCircle, Tag } from 'lucide-react';
import SocialPost from '../components/SocialFeed/SocialPost';

export default function SocialFeed() {
  const { data: posts, loading } = useFirestoreCollection('social');
  const [newPost, setNewPost] = useState('');

  if (loading) return <div className="text-slate-400">Loading feed...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          placeholder="Share an update, news, or ask a question..."
          rows="3"
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-emerald-400 p-2"><MessageCircle size={18} /></button>
            <button className="text-slate-400 hover:text-blue-400 p-2"><Tag size={18} /></button>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
            Post
          </button>
        </div>
      </div>

      {!posts ? (
        <div className="space-y-4">
          <DataMissingIndicator
            collectionPath="/social"
            expectedDocId="<Any Document ID>"
            schemaInterface={`{ "author": "John", "content": "Text", "timestamp": "ISO-8601" }`}
          />
          <p className="text-slate-400 italic">No posts found in the social feed. (Mock collection seeding not fully implemented for collections yet).</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <SocialPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
