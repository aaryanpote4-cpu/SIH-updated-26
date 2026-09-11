import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Search, 
  Sparkles, 
  ShieldAlert, 
  Network, 
  UserCheck, 
  AlertTriangle, 
  Clock, 
  Users, 
  Radio, 
  X, 
  Layers, 
  Share2, 
  Lock 
} from 'lucide-react';

import { apiUrl } from '../services/api';

export default function BotDetectionView({ onRefresh }) {
  const [bots, setBots] = useState([]);
  const [botStats, setBotStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [clusterFilter, setClusterFilter] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  // Single scan form
  const [scanUsername, setScanUsername] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recentScanResult, setRecentScanResult] = useState(null);

  // Selected Account for Modal
  const [selectedBot, setSelectedBot] = useState(null);

  const fetchBotData = async () => {
    setLoading(true);
    try {
      const [botsRes, statsRes] = await Promise.allSettled([
        fetch(apiUrl('/api/bots?limit=100')).then(r => r.json()),
        fetch(apiUrl('/api/bots/stats')).then(r => r.json())
      ]);

      if (botsRes.status === 'fulfilled') setBots(botsRes.value);
      if (statsRes.status === 'fulfilled') setBotStats(statsRes.value);
    } catch (err) {
      console.error("Failed fetching bots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBotData();
  }, []);

  const handleScanAccount = async (e) => {
    e.preventDefault();
    if (!scanUsername) return;
    setScanning(true);
    try {
      const res = await fetch(apiUrl('/api/bots/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: scanUsername })
      });
      const data = await res.json();
      setRecentScanResult(data);
      setSelectedBot(data);
      fetchBotData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const filteredBots = bots.filter((b) => {
    const matchesSearch = searchQuery
      ? b.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.abnormal_patterns.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCluster = clusterFilter
      ? b.network_cluster && b.network_cluster.toLowerCase().includes(clusterFilter.toLowerCase())
      : true;
    const matchesFlagged = flaggedOnly ? b.is_flagged : true;

    return matchesSearch && matchesCluster && matchesFlagged;
  });

  const getScoreColor = (score) => {
    if (score >= 70) return { bar: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (score >= 40) return { bar: 'bg-amber-500', text: 'text-amber-800', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const getNetworkConnections = (account) => {
    return [
      { handle: '@fake_trend_node_01', type: 'Instant Re-poster', delay: '0.4s sync', status: 'Flagged' },
      { handle: '@spam_forward_bot_02', type: 'Copypasta Spam', delay: '1.1s sync', status: 'Flagged' },
      { handle: '@viral_echo_bot_09', type: 'Main Campaign Account', delay: 'Root Node', status: 'Active Bot' },
      { handle: '@free_rewards_promo_bot', type: 'Scam Link Spreader', delay: 'Cross-platform', status: 'Flagged' }
    ];
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Profile Scanner */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm shadow-blue-900/5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#12355B] tracking-wide font-sans">
                Fake Accounts & Bot Detection Scanner
              </h2>
            </div>
            <p className="text-xs text-[#4A607A] font-sans mt-1">
              Finds automated bot accounts, fake followers, and coordinated groups spreading rumors online.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 font-sans">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-[#4A607A]">Accounts Checked: </span>
              <span className="text-[#12355B] font-bold font-mono">{botStats?.total_analyzed || bots.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="text-amber-800">Fake Bots: </span>
              <span className="text-amber-700 font-bold font-mono">{botStats?.flagged_bots_count || 0}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <span className="text-[#1769AA]">Spam Groups: </span>
              <span className="text-[#1769AA] font-bold font-mono">{botStats?.active_clusters_count || 0}</span>
            </div>
          </div>
        </div>

        {/* Live Handle Scan Bar */}
        <form onSubmit={handleScanAccount} className="flex flex-col sm:flex-row gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter any handle e.g. @spam_bot_node_01, @fake_news_alert, or username"
              value={scanUsername}
              onChange={(e) => setScanUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#1769AA] outline-none text-sm text-[#12355B] font-mono placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={scanning}
            className="px-6 py-2.5 rounded-xl bg-[#1769AA] hover:bg-[#13558A] font-semibold text-xs font-sans transition disabled:opacity-50 text-white flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            {scanning ? 'Analyzing Account...' : 'Check Profile'}
          </button>
        </form>
      </div>

      {/* 2. Flagged Accounts Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm shadow-blue-900/5 space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-[#12355B] flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-[#1769AA]" />
            Flagged Suspicious Accounts ({filteredBots.length})
          </h3>

          <div className="flex flex-wrap items-center gap-3 font-sans">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search usernames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#12355B] outline-none focus:border-[#1769AA] font-sans placeholder:text-slate-400"
              />
            </div>

            <select
              value={clusterFilter}
              onChange={(e) => setClusterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-[#12355B] outline-none font-sans"
            >
              <option value="">All Spam Networks</option>
              <option value="Cluster-Astroturf-Alpha">Spam Group Alpha</option>
              <option value="Cluster-Phish-Syndicate">Phishing Link Group</option>
              <option value="Cluster-Disinfo-EchoNet">Fake News Echo Group</option>
            </select>

            <button
              onClick={() => setFlaggedOnly(!flaggedOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition ${
                flaggedOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                  : 'bg-slate-50 text-[#4A607A] border-slate-200 hover:text-[#12355B]'
              }`}
            >
              High Risk Only
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[#4A607A] text-[11px] font-sans">
                <th className="pb-3 font-semibold">Account Handle</th>
                <th className="pb-3 font-semibold">Bot Probability</th>
                <th className="pb-3 font-semibold">Account Age</th>
                <th className="pb-3 font-semibold">Spam Network</th>
                <th className="pb-3 font-semibold">Suspicious Activity</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredBots.map((account) => {
                const scoreStyle = getScoreColor(account.bot_probability);
                return (
                  <tr
                    key={account.id}
                    className="hover:bg-slate-50 transition group cursor-pointer"
                    onClick={() => setSelectedBot(account)}
                  >
                    {/* Username */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#12355B] group-hover:text-[#1769AA] transition font-mono">
                          {account.username}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-[#4A607A] border border-slate-200">
                          {account.platform}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#4A607A] mt-0.5 font-mono">
                        {account.followers_count} followers / {account.following_count} following
                      </div>
                    </td>

                    {/* Bot Score */}
                    <td className="py-3.5 pr-4 min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold font-mono ${scoreStyle.text}`}>
                          {account.bot_probability}% Fake
                        </span>
                        <span className="text-[10px] text-[#4A607A] font-mono">
                          {account.posts_frequency_per_hr} posts/hr
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${scoreStyle.bar}`}
                          style={{ width: `${account.bot_probability}%` }}
                        />
                      </div>
                    </td>

                    {/* Account Age */}
                    <td className="py-3.5 pr-4 text-[#4A607A] font-sans">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#1769AA]" />
                        <span className="text-[#12355B] font-medium">{account.account_age_days} days old</span>
                      </div>
                      <span className="text-[10px] text-[#4A607A]">
                        {account.account_age_days < 10 ? 'Brand New Account' : 'Old Account'}
                      </span>
                    </td>

                    {/* Spam Group */}
                    <td className="py-3.5 pr-4">
                      {account.network_cluster ? (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1769AA] border border-blue-200 text-[11px] font-semibold font-sans">
                          {account.network_cluster}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Single Account</span>
                      )}
                    </td>

                    {/* Detected Activity */}
                    <td className="py-3.5 pr-4 max-w-xs">
                      <p className="text-[#4A607A] text-xs truncate font-sans">
                        {account.abnormal_patterns || 'Normal activity'}
                      </p>
                    </td>

                    {/* View Button */}
                    <td className="py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBot(account);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#12355B] text-[11px] font-semibold transition flex items-center gap-1 ml-auto font-sans shadow-sm"
                      >
                        <Network className="w-3.5 h-3.5 text-[#1769AA]" />
                        View Network
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Connected Fake Network Modal */}
      {selectedBot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#12355B] font-sans">
                    Connected Fake Accounts & Network Map
                  </h3>
                  <p className="text-xs text-[#4A607A] font-sans">
                    Group: {selectedBot.network_cluster || 'Independent Account'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBot(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#12355B] hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-sans text-xs">
              {/* Profile Overview Card */}
              <div className="p-4 rounded-xl bg-[#F0F7FD] border border-[#D4E8F8] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-[#12355B] font-mono">{selectedBot.username}</span>
                    <span className="px-2 py-0.5 rounded bg-white text-[#1769AA] border border-blue-200 text-xs font-semibold">{selectedBot.platform}</span>
                  </div>
                  <div className="text-xs text-[#4A607A] mt-1 font-mono">
                    Followers: <span className="font-bold text-[#12355B]">{selectedBot.followers_count}</span> | Following: <span className="font-bold text-[#12355B]">{selectedBot.following_count}</span> | Speed: <span className="text-[#1769AA] font-bold">{selectedBot.posts_frequency_per_hr} posts/hr</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black font-mono ${getScoreColor(selectedBot.bot_probability).text}`}>
                    {selectedBot.bot_probability}% FAKE BOT
                  </div>
                  <span className="text-[10px] text-[#4A607A]">Confidence Rating</span>
                </div>
              </div>

              {/* Connected Nodes */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#12355B] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1769AA]" />
                  Connected Accounts in this Spam Network:
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="px-4 py-2 rounded-xl bg-white border border-[#1769AA] text-[#1769AA] font-bold text-xs shadow-sm">
                      🎯 Investigated Account: {selectedBot.username}
                    </div>
                  </div>

                  <div className="flex justify-center text-[#4A607A] text-[11px]">↓ Linked Accounts Posting Simultaneously ↓</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getNetworkConnections(selectedBot).map((conn, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm"
                      >
                        <div>
                          <div className="font-bold text-[#12355B] font-mono">{conn.handle}</div>
                          <div className="text-[10px] text-[#4A607A]">{conn.type}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[#4A607A] border border-slate-200 font-mono font-medium">
                            {conn.delay}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Behavior Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-semibold text-[#12355B]">Why was this account flagged?</span>
                <p className="text-[#4A607A] leading-relaxed">
                  {selectedBot.abnormal_patterns}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between font-sans text-xs">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(selectedBot, null, 2));
                  alert("Account data copied!");
                }}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#12355B] hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-[#1769AA]" /> Copy Account Data
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => alert(`Warning issued for ${selectedBot.username} and connected network accounts.`)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" /> Block & Flag Account
                </button>
                <button
                  onClick={() => setSelectedBot(null)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#4A607A] transition border border-slate-200 shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

