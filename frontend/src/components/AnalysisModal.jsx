import React from 'react';
import { 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Share2, 
  Lock,
  Copy
} from 'lucide-react';

export default function AnalysisModal({ post, onClose, onFlagToggle }) {
  if (!post) return null;

  const copyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(post, null, 2));
    alert("Post details copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#12355B] font-sans">
                Post Safety & Scam Analysis
              </h3>
              <p className="text-xs text-[#4A607A] font-mono">
                Post ID: #{post.id.toString().padStart(4, '0')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#12355B] hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans text-xs">
          {/* Post Summary & Source */}
          <div className="p-4 rounded-xl bg-[#F0F7FD] border border-[#D4E8F8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12355B] font-mono">{post.username}</span>
                <span className="px-2 py-0.5 rounded bg-white border border-blue-200 text-[#1769AA] font-semibold">{post.platform}</span>
                <span className="text-[#4A607A] flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-[#1769AA]" /> {post.region}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded font-bold font-mono border ${
                post.risk_level === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                post.risk_level === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                Threat Level: {post.risk_level}
              </span>
            </div>
            <p className="text-sm text-[#12355B] leading-relaxed font-sans pt-1">
              "{post.text}"
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[#4A607A]">Tone of Message:</span>
              <div className="text-sm font-bold text-[#12355B] flex items-center gap-1.5">
                <span className={post.sentiment === 'Negative' ? 'text-rose-600' : 'text-emerald-600'}>
                  {post.sentiment === 'Negative' ? 'Angry / Panic' : post.sentiment === 'Positive' ? 'Positive' : 'Neutral'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[#4A607A]">Topic Tag:</span>
              <div className="text-sm font-bold text-[#1769AA] font-mono">
                {post.topic}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[#4A607A]">Location Origin:</span>
              <div className="text-sm font-semibold text-[#12355B]">
                {post.region}, India
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[#4A607A]">Engagement Count:</span>
              <div className="text-sm font-bold text-[#12355B] font-mono">
                🤍 {post.likes} Likes | 🔁 {post.retweets} Shares
              </div>
            </div>
          </div>

          {/* Recommended Safety Steps */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
            <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Recommended Safety Actions:
            </div>
            <ul className="list-disc list-inside text-emerald-800 space-y-1 leading-relaxed pl-1">
              <li>Issue an official fact-check notice regarding <strong>{post.topic}</strong> for citizens in <strong>{post.region}</strong>.</li>
              <li>Monitor account <strong>{post.username}</strong> for repeated automated rumor posts.</li>
              <li>Report any attached fraudulent bank links or APKs to cybersecurity helplines.</li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between font-sans text-xs">
          <button
            onClick={copyPayload}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-[#12355B] text-xs flex items-center gap-1.5 transition font-medium shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-[#1769AA]" /> Copy Post Info
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => onFlagToggle && onFlagToggle(post.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                post.is_flagged
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {post.is_flagged ? 'Remove Flag' : 'Flag as Scam'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#4A607A] text-xs transition shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

