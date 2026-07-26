import { MessageCircle, Heart, Share2 } from 'lucide-react';
import { getLabelByCode } from '../../lib/constants';

export default function SocialPost({ post }) {
  return (
    <div className="bg-white text-slate-900 rounded-xl p-5 border border-slate-200 shadow-sm">
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
            {getLabelByCode('POST_TYPES', post.type)}
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
  );
}
