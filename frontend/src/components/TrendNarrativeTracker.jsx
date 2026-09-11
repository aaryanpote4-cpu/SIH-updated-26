import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { TrendingUp, Activity, BarChart2, PieChart as PieIcon, HelpCircle, Info } from 'lucide-react';

export default function TrendNarrativeTracker({ analytics, onSelectTopic }) {
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' or 'sentiment'
  const [showHelp, setShowHelp] = useState(false);

  // Time-series mock data based on recent ingestion
  const timelineData = [
    { time: '4:00 PM', totalPosts: 120, fakeNews: 14, safePosts: 106 },
    { time: '5:00 PM', totalPosts: 240, fakeNews: 38, safePosts: 202 },
    { time: '6:00 PM', totalPosts: 390, fakeNews: 92, safePosts: 298 },
    { time: '7:00 PM', totalPosts: 510, fakeNews: 164, safePosts: 346 },
    { time: '8:00 PM', totalPosts: 680, fakeNews: 215, safePosts: 465 },
    { time: '9:00 PM', totalPosts: 840, fakeNews: 290, safePosts: 550 },
    { time: '10:00 PM', totalPosts: 960, fakeNews: 345, safePosts: 615 },
  ];

  // Sentiment Breakdown Data with Light Semantic Colors
  const sentimentOverview = analytics?.sentiment_overview || {
    positive: 15,
    neutral: 24,
    negative: 18,
    positive_pct: 26.3,
    neutral_pct: 42.1,
    negative_pct: 31.6
  };

  const sentimentData = [
    { name: 'Happy / Supportive', value: sentimentOverview.positive || 1, color: '#10B981', pct: sentimentOverview.positive_pct },
    { name: 'Neutral / Informative', value: sentimentOverview.neutral || 1, color: '#19B5E6', pct: sentimentOverview.neutral_pct },
    { name: 'Angry / Panic / Hostile', value: sentimentOverview.negative || 1, color: '#EF4444', pct: sentimentOverview.negative_pct },
  ];

  const topTopics = analytics?.top_topics || [
    { topic: '#BankingScam', count: 18, isRisky: true },
    { topic: '#DeepfakeAlert', count: 12, isRisky: true },
    { topic: '#UPSCProtest', count: 7, isRisky: false },
    { topic: '#BoycottOnlineRetailers', count: 8, isRisky: true },
    { topic: '#DigitalIndia2026', count: 6, isRisky: false },
    { topic: '#CitySafetyUpdate', count: 6, isRisky: false }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs font-mono">
          <p className="font-bold text-[#12355B] mb-1.5">{label} Activity</p>
          <div className="space-y-1">
            <p className="text-[#1769AA] font-bold">Total Posts: {payload[0]?.value}</p>
            <p className="text-rose-600 font-bold">Fake News / Rumors: {payload[1]?.value}</p>
            <p className="text-[#4A607A]">Safe Posts: {payload[2]?.value}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col justify-between shadow-sm shadow-blue-900/5 space-y-4">
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#12355B] flex items-center gap-2 font-sans">
              <TrendingUp className="w-5 h-5 text-[#1769AA]" />
              Trending Topics & Rumor Tracker
            </h3>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1 rounded-lg text-slate-400 hover:text-[#12355B] transition"
              title="How does this work?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#4A607A] font-sans mt-0.5">
            Tracks viral topics and reveals how much fake news is spreading.
          </p>
        </div>

        {/* View Switcher Tabs - Segmented Control Style */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-mono">
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeView === 'timeline'
                ? 'bg-white text-[#1769AA] font-semibold border border-slate-200 shadow-sm'
                : 'text-[#4A607A] hover:text-[#12355B]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Post Volume vs Rumors
          </button>
          <button
            onClick={() => setActiveView('sentiment')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeView === 'sentiment'
                ? 'bg-white text-[#1769AA] font-semibold border border-slate-200 shadow-sm'
                : 'text-[#4A607A] hover:text-[#12355B]'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            Public Mood
          </button>
        </div>
      </div>

      {/* Helpful Explanation Guide */}
      {showHelp ? (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 font-sans animate-fadeIn">
          <div className="font-bold text-[#12355B] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1769AA]" /> How to read this tracker:
          </div>
          <p className="text-[#4A607A] leading-relaxed">
            This module continuously scans social media. The <strong className="text-[#1769AA]">Primary Blue gradient line</strong> shows total post volume. When scammers or bot accounts spread rumors, the <strong className="text-rose-600">Crimson red line</strong> spikes upward to flag the threat in real-time.
          </p>
        </div>
      ) : (
        /* Quick Guide Strip */
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-[#4A607A]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1769AA]"></span>
              <span><strong className="text-[#12355B]">Blue Line:</strong> Total Posts</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
              <span><strong className="text-rose-600">Red Line:</strong> Fake News / Rumors</span>
            </span>
          </div>
          <button 
            onClick={() => setShowHelp(true)}
            className="text-[#1769AA] hover:underline text-[11px] font-semibold"
          >
            Learn more
          </button>
        </div>
      )}

      {/* Main Chart Area */}
      <div className="h-64 w-full pt-2">
        {activeView === 'timeline' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="totalVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1769AA" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#19B5E6" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="misinfoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.8} />
              <XAxis dataKey="time" stroke="#4A607A" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#4A607A" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="totalPosts"
                stroke="#1769AA"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#totalVolumeGrad)"
                name="Total Posts"
              />
              <Area
                type="monotone"
                dataKey="fakeNews"
                stroke="#EF4444"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#misinfoGrad)"
                name="Fake News / Rumors"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-around h-full gap-4">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name, item) => [`${val} posts (${item.payload.pct}%)`, name]}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', fontSize: '12px', fontFamily: 'monospace', color: '#12355B' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sentiment Legend & Stats */}
            <div className="space-y-2.5 font-sans text-xs w-full max-w-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-900 font-semibold">Positive / Safe</span>
                </div>
                <span className="text-emerald-700 font-bold font-mono">{sentimentOverview.positive_pct}% ({sentimentOverview.positive})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#19B5E6]"></span>
                  <span className="text-[#12355B] font-medium">Neutral / Info</span>
                </div>
                <span className="text-[#1769AA] font-bold font-mono">{sentimentOverview.neutral_pct}% ({sentimentOverview.neutral})</span>
              </div>

              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-rose-900 font-semibold">Angry / Panic</span>
                </div>
                <span className="text-rose-700 font-bold font-mono">{sentimentOverview.negative_pct}% ({sentimentOverview.negative})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trending Topics Clickable Tags */}
      <div className="border-t border-slate-100 pt-3">
        <div className="text-xs font-sans text-[#4A607A] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#1769AA]" />
            <strong>Hot Topics Right Now (Click any to filter posts):</strong>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTopics.map((item) => (
            <button
              key={item.topic}
              onClick={() => onSelectTopic && onSelectTopic(item.topic)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs font-mono text-[#12355B] flex items-center gap-1.5 transition hover:scale-105 shadow-sm"
            >
              <span>{item.topic}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                item.isRisky 
                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                  : 'bg-slate-100 text-[#4A607A] border-slate-200'
              }`}>
                {item.count} posts
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

