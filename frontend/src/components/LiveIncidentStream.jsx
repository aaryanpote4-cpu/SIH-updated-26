import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  Flag, 
  Download, 
  CheckCircle,
  AlertTriangle,
  Radio,
  Copy
} from 'lucide-react';

export default function LiveIncidentStream({ 
  posts = [], 
  onAnalyze, 
  onFlagToggle,
  selectedTopic,
  selectedRegion,
  onClearFilters
}) {
  const [platformFilter, setPlatformFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((p) => {
    const matchesPlatform = platformFilter ? p.platform.toLowerCase() === platformFilter.toLowerCase() : true;
    const matchesRisk = riskFilter ? p.risk_level.toLowerCase() === riskFilter.toLowerCase() : true;
    const matchesTopic = selectedTopic ? p.topic.toLowerCase().includes(selectedTopic.toLowerCase()) : true;
    const matchesRegion = selectedRegion ? p.region.toLowerCase().includes(selectedRegion.toLowerCase()) : true;
    const matchesSearch = searchQuery
      ? (p.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.topic.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    return matchesPlatform && matchesRisk && matchesTopic && matchesRegion && matchesSearch;
  });

  const exportFilteredIncidents = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredPosts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `technetra_alerts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getPlatformBadge = (platform) => {
    return 'bg-slate-100 text-[#12355B] border border-slate-200';
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm shadow-blue-900/5 space-y-4">
      {/* Stream Header & Active Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#12355B] flex items-center gap-2 font-sans">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Live Safety Feed & Flagged Posts
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold">
              <Radio className="w-3 h-3 animate-ping text-rose-600" /> {filteredPosts.length} ALERTS
            </span>
          </div>
          <p className="text-xs text-[#4A607A] font-sans mt-0.5">
            Real-time messages flagged as fake news, bank scams, or misleading rumors.
          </p>
        </div>

        {/* Global Filter Tags & Download Button */}
        <div className="flex items-center gap-2">
          {(selectedTopic || selectedRegion) && (
            <div className="flex items-center gap-1.5 text-xs font-mono bg-blue-50 text-[#1769AA] border border-blue-200 font-semibold px-3 py-1.5 rounded-xl shadow-sm">
              <span>Filter: <strong>{selectedTopic || selectedRegion}</strong></span>
              <button 
                onClick={onClearFilters}
                className="ml-1 text-[#1769AA] hover:text-[#12355B] font-bold"
              >
                ×
              </button>
            </div>
          )}

          <button
            onClick={exportFilteredIncidents}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[#12355B] text-xs font-sans font-medium transition flex items-center gap-1.5 shadow-sm"
            title="Download list of alerts"
          >
            <Download className="w-3.5 h-3.5 text-[#1769AA]" /> Download Feed
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords, usernames, or states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#12355B] outline-none focus:border-[#1769AA] font-sans placeholder:text-slate-400"
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#12355B] outline-none font-sans"
        >
          <option value="">All Social Platforms</option>
          <option value="X">X (Twitter)</option>
          <option value="Telegram">Telegram</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
        </select>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#12355B] outline-none font-sans"
        >
          <option value="">All Threat Levels</option>
          <option value="High">High Risk / Scam</option>
          <option value="Medium">Medium Risk</option>
          <option value="Low">Low Risk / Safe</option>
        </select>
      </div>

      {/* Incident Stream List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-xl border transition-all duration-200 shadow-sm ${
                post.is_flagged
                  ? 'border-rose-300 bg-rose-50/40'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                {/* User & Location */}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-bold text-xs text-[#12355B] font-mono">
                    {post.username}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${getPlatformBadge(post.platform)}`}>
                    {post.platform}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-[#4A607A] border border-slate-200 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#1769AA]" /> {post.region}
                  </span>
                  <span className="text-[10px] font-mono text-[#1769AA] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {post.topic}
                  </span>
                </div>

                {/* Threat Badge */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    post.risk_level === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    post.risk_level === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    Threat: {post.risk_level}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <p className="text-sm text-[#12355B] leading-relaxed font-sans pt-1">
                "{post.text}"
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs font-sans">
                <div className="flex items-center gap-4 text-[#4A607A] font-mono text-xs">
                  <span>❤️ {post.likes}</span>
                  <span>🔁 {post.retweets}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => onAnalyze(post)}
                    className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#12355B] transition flex items-center gap-1 text-[11px] font-semibold shadow-sm"
                  >
                    <Eye className="w-3 h-3 text-[#1769AA]" />
                    Check Details
                  </button>

                  <button
                    onClick={() => onFlagToggle(post.id)}
                    className={`px-3 py-1 rounded-lg border transition flex items-center gap-1 text-[11px] font-semibold ${
                      post.is_flagged
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-slate-50 text-[#4A607A] border-slate-200 hover:bg-slate-100 hover:text-[#12355B]'
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    {post.is_flagged ? 'Flagged as Scam' : 'Flag Post'}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`[TECH NETRA ALERT] ${post.username} on ${post.platform}: "${post.text}" (Risk: ${post.risk_level})`);
                      alert("Alert copied to clipboard!");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#4A607A] hover:text-[#12355B] transition text-[11px]"
                    title="Copy Alert Message"
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-[#4A607A] font-sans text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No posts found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

