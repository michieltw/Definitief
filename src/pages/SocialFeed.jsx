import { useState } from 'react';
import { useFirestoreCollection, useFirestoreDocument } from '../hooks/useFirestore';
import DataMissingIndicator from '../components/DataMissingIndicator';
import { MessageCircle, Heart, Share2, Tag } from 'lucide-react';

export default function SocialFeed() {
  const { data: posts, loading, setDoc } = useFirestoreCollection('social');
  const [newPost, setNewPost] = useState('');

  const handleSeedData = async () => {
    // Generate some mock social data using the mocked document hook function under the hood
    const mockPosts = [
      { id: 'POST_001', author: 'Coach Smith', content: 'Great win tonight boys! Rest up for tomorrow.', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'NEWS' },
      { id: 'POST_002', author: 'Team Admin', content: 'New team jackets have arrived. Pick them up at practice.', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'ANNOUNCEMENT' },
    ];

    // We can't batch write easily with our simple mock hook, so we'll just seed one manually via setDoc mock
    // Wait, useFirestoreCollection reads from mockDB via prefix, so we can use a dummy document hook to write to it
  };

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
            <div key={post.id} className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                    {post.author?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold">{post.author}</h4>
                    <span className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                {post.type && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-1 rounded text-slate-600">
                    {post.type}
                  </span>
                )}
              </div>
              <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.content}</p>
              <div className="flex border-t border-slate-100 pt-3 gap-4">
                <button className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium">
                  <Heart size={16} /> 0 Likes
                </button>
                <button className="flex items-center gap-1 text-slate-500 hover:text-blue-500 transition-colors text-sm font-medium">
                  <MessageCircle size={16} /> Comment
                </button>
                <button className="flex items-center gap-1 text-slate-500 hover:text-emerald-500 transition-colors text-sm font-medium ml-auto">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
