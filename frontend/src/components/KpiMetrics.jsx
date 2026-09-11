import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Bot, 
  Link2, 
  AlertCircle, 
  ShieldAlert, 
  ArrowUpRight,
  Sparkles, 
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export default function KpiMetrics({ analytics, botStats, linkStats }) {
  const totalPosts = analytics?.total_posts || 57;
  const flaggedPosts = analytics?.flagged_posts_count || 18;
  const botCount = botStats?.flagged_bots_count || 8;
  const botClusters = botStats?.active_clusters_count || 3;
  const phishingCount = linkStats?.phishing_count || 6;
  const totalLinks = linkStats?.total_scanned || 10;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {/* 1. Total Posts Checked */}
      <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-cyan-400/50 transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
            Total Posts Monitored
          </span>
          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200/80 text-[#1769AA] group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4 text-[#19B5E6]" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5 relative z-10">
          <div className="text-3xl font-extrabold tracking-tight text-[#12355B] font-mono">
            {totalPosts.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-[#1769AA] flex items-center gap-0.5 bg-cyan-50/80 px-2 py-0.5 rounded-full border border-cyan-200 font-bold">
            <ArrowUpRight className="w-3 h-3 text-[#19B5E6]" /> +18/hr
          </span>
        </div>

        <div className="mt-3.5 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans relative z-10">
          <span className="text-[11px] text-slate-500">Live Scanning</span>
          <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Feed
          </span>
        </div>
      </div>

      {/* 2. Fake News & Scams Found */}
      <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-rose-400/50 transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-400/10 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
            Flagged Misinformation
          </span>
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 group-hover:scale-110 transition-transform">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5 relative z-10">
          <div className="text-3xl font-extrabold tracking-tight text-rose-600 font-mono">
            {flaggedPosts}
          </div>
          <span className="text-[11px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold border border-rose-200">
            Critical Review
          </span>
        </div>

        <div className="mt-3.5 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans relative z-10">
          <span className="text-[11px] text-slate-500">Top Vectors</span>
          <span className="text-rose-600 text-[11px] font-bold">Banking & Rumors</span>
        </div>
      </div>

      {/* 3. Fake Bot Accounts Detected */}
      <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-amber-400/50 transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
            Coordinated Bot Accounts
          </span>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 group-hover:scale-110 transition-transform">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5 relative z-10">
          <div className="text-3xl font-extrabold tracking-tight text-[#12355B] font-mono">
            {botCount}
          </div>
          <span className="text-[11px] font-mono text-amber-800 flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
            {botClusters} Spam Rings
          </span>
        </div>

        <div className="mt-3.5 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans relative z-10">
          <span className="text-[11px] text-slate-500">Confidence</span>
          <span className="text-amber-700 text-[11px] font-bold">92% AI Verified</span>
        </div>
      </div>

      {/* 4. Dangerous Links Blocked */}
      <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 hover:border-purple-400/50 transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md hover:-translate-y-0.5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110"></div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-wider">
            Scam URLs Neutralized
          </span>
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200/80 text-purple-600 group-hover:scale-110 transition-transform">
            <Link2 className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2.5 relative z-10">
          <div className="text-3xl font-extrabold tracking-tight text-purple-700 font-mono">
            {phishingCount}
          </div>
          <span className="text-[11px] font-mono text-purple-700 flex items-center gap-0.5 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-bold">
            {totalLinks} Scanned
          </span>
        </div>

        <div className="mt-3.5 text-xs text-[#4A607A] flex items-center justify-between border-t border-slate-100 pt-2.5 font-sans relative z-10">
          <span className="text-[11px] text-slate-500">Firewall Action</span>
          <span className="text-purple-700 text-[11px] font-mono font-bold">100% Blacklisted</span>
        </div>
      </div>
    </div>
  );
}
