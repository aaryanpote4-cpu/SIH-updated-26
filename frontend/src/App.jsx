import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import KpiMetrics from './components/KpiMetrics';
import TrendNarrativeTracker from './components/TrendNarrativeTracker';
import GeospatialThreatMap from './components/GeospatialThreatMap';
import LiveIncidentStream from './components/LiveIncidentStream';
import AnalysisModal from './components/AnalysisModal';
import BotDetectionView from './components/BotDetectionView';
import LinkAnalyzerView from './components/LinkAnalyzerView';
import ReportDossierModal from './components/ReportDossierModal';
import SlidingDashboardDrawer from './components/SlidingDashboardDrawer';
import { apiUrl } from './services/api';
import { 
  Bot, 
  Link2, 
  FileText, 
  LayoutDashboard, 
  Sparkles, 
  Printer, 
  Filter
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'bots', 'links', 'reports'
  
  // Sliding Drawer States (Toggled via Top-Left 3-Dots Button)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerPinned, setIsDrawerPinned] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [posts, setPosts] = useState([]);
  const [heatmaps, setHeatmaps] = useState([]);
  const [botStats, setBotStats] = useState(null);
  const [linkStats, setLinkStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Selected Post for Detail Modal
  const [analyzingPost, setAnalyzingPost] = useState(null);

  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTopic, setReportTopic] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, postsRes, heatmapRes, botRes, linkRes, reportsRes] = await Promise.allSettled([
        fetch(apiUrl('/api/trends/analytics')).then(r => r.json()),
        fetch(apiUrl('/api/posts?limit=100')).then(r => r.json()),
        fetch(apiUrl('/api/trends/heatmap')).then(r => r.json()),
        fetch(apiUrl('/api/bots/stats')).then(r => r.json()),
        fetch(apiUrl('/api/links/stats')).then(r => r.json()),
        fetch(apiUrl('/api/reports')).then(r => r.json())
      ]);

      if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value);
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value);
      if (heatmapRes.status === 'fulfilled') setHeatmaps(heatmapRes.value);
      if (botRes.status === 'fulfilled') setBotStats(botRes.value);
      if (linkRes.status === 'fulfilled') setLinkStats(linkRes.value);
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const interval = setInterval(() => {
      fetchAllData();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  const handleFlagToggle = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, is_flagged: !p.is_flagged } : p));
    if (analyzingPost && analyzingPost.id === postId) {
      setAnalyzingPost(prev => ({ ...prev, is_flagged: !prev.is_flagged }));
    }
  };

  const handleOpenReportWithTopic = (topic) => {
    setReportTopic(topic || '');
    setIsReportModalOpen(true);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live', badgeColor: 'bg-cyan-100/70 text-[#1769AA]' },
    { id: 'bots', label: 'Bot Scanner', icon: Bot, badge: `${botStats?.flagged_bots_count || 8}`, badgeColor: 'bg-amber-100/70 text-amber-800' },
    { id: 'links', label: 'Phishing Links', icon: Link2, badge: `${linkStats?.phishing_count || 6}`, badgeColor: 'bg-rose-100/70 text-rose-700' },
    { id: 'reports', label: 'Safety Reports', icon: FileText, badge: `${reports.length}`, badgeColor: 'bg-purple-100/70 text-purple-700' },
  ];

  return (
    <div className={`min-h-screen bg-[#F7FAFC] text-[#12355B] flex flex-col font-sans transition-all duration-300 ${
      isDrawerPinned ? 'pl-0 lg:pl-[370px]' : ''
    }`}>
      {/* Sliding Dashboard Drawer (Opened cleanly via Top-Left 3 Dots) */}
      <SlidingDashboardDrawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        isPinned={isDrawerPinned}
        setIsPinned={setIsDrawerPinned}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        analytics={analytics}
        botStats={botStats}
        linkStats={linkStats}
        reportsCount={reports.length}
        onOpenReportModal={() => handleOpenReportWithTopic(selectedTopic)}
        onRefresh={fetchAllData}
        loading={loading}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        soundAlerts={soundAlerts}
        setSoundAlerts={setSoundAlerts}
        autoRefreshInterval={autoRefreshInterval}
        setAutoRefreshInterval={setAutoRefreshInterval}
      />

      {/* 1. Header with Top-Left 3 Dots */}
      <Header 
        onRefresh={fetchAllData} 
        loading={loading}
        onOpenReportModal={() => handleOpenReportWithTopic(selectedTopic)}
        onOpenDrawer={() => setIsDrawerOpen(prev => !prev)}
        isDrawerOpen={isDrawerOpen}
        isDrawerPinned={isDrawerPinned}
      />

      {/* 2. Streamlined, Crisp Hero Strip (No Clutter) */}
      <section className="bg-gradient-to-r from-[#EBF5FB] via-[#F3F8FC] to-[#F7FAFC] border-b border-slate-200/80 px-4 sm:px-8 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12355B] tracking-tight flex items-center gap-2">
              <span>National Threat & Safety Radar</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769AA]">
                AI-Secured
              </span>
            </h2>
            <p className="text-xs text-[#4A607A] mt-0.5 max-w-xl leading-relaxed">
              Real-time misinformation tracking, bot network deconstruction, and scam link neutralization across India.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-[#12355B] font-semibold">ALL RADARS ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12355B] text-white shadow-2xs">
              <span className="text-[10px] text-cyan-300 font-semibold">DEFCON 3</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clean Navigation Bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-2 sticky top-[57px] z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#1769AA] text-white shadow-xs font-bold'
                      : 'text-[#4A607A] hover:text-[#12355B] hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#1769AA]'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : tab.badgeColor
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Active Filter Pill */}
          {selectedTopic && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-xs font-mono text-[#1769AA] shrink-0">
              <Filter className="w-3 h-3" />
              <span className="truncate max-w-[150px]">Filter: <strong>{selectedTopic}</strong></span>
              <button 
                onClick={() => setSelectedTopic('')}
                className="ml-1 text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* VIEW 1: MAIN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards */}
            <KpiMetrics analytics={analytics} botStats={botStats} linkStats={linkStats} />

            {/* Grid Layout: Trend Tracker + Interactive India Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Trending Topics & Rumor Tracker */}
              <TrendNarrativeTracker 
                analytics={analytics} 
                onSelectTopic={(topic) => {
                  setSelectedTopic(topic);
                  handleOpenReportWithTopic(topic);
                }} 
              />

              {/* Right Column: Live India Safety Map */}
              <GeospatialThreatMap 
                heatmaps={heatmaps} 
                selectedRegion={selectedRegion}
                onSelectRegion={(region) => setSelectedRegion(region)} 
              />
            </div>

            {/* Live Incident Stream */}
            <LiveIncidentStream
              posts={posts}
              onAnalyze={(post) => setAnalyzingPost(post)}
              onFlagToggle={handleFlagToggle}
              selectedTopic={selectedTopic}
              selectedRegion={selectedRegion}
              onClearFilters={() => {
                setSelectedTopic('');
                setSelectedRegion('');
              }}
            />
          </>
        )}

        {/* VIEW 2: FAKE ACCOUNTS & BOT SCANNER */}
        {activeTab === 'bots' && (
          <BotDetectionView onRefresh={fetchAllData} />
        )}

        {/* VIEW 3: DANGEROUS LINKS & SCAM SCANNER */}
        {activeTab === 'links' && (
          <LinkAnalyzerView onRefresh={fetchAllData} />
        )}

        {/* VIEW 4: GENERATED SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-[#12355B] flex items-center gap-2 font-sans">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Official Safety Summary Reports
                </h3>
                <p className="text-xs text-[#4A607A] font-sans mt-1">
                  Download or print complete summaries with fake account findings, blocked links, and recommended safety steps.
                </p>
              </div>

              <button
                onClick={() => handleOpenReportWithTopic('')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-sans text-xs font-semibold transition flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Create New Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-[#12355B] text-base">{r.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
                        r.threat_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        r.threat_level === 'HIGH' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        Threat: {r.threat_level}
                      </span>
                      <button
                        onClick={() => handleOpenReportWithTopic(r.top_misinfo_narratives)}
                        className="px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-xs font-sans text-purple-700 border border-purple-200 flex items-center gap-1 transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Printable View
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-[#4A607A] leading-relaxed font-sans">{r.summary}</p>
                  
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                    <div className="font-bold text-purple-900 font-sans">Recommended Safety Steps:</div>
                    <pre className="font-sans text-purple-800 whitespace-pre-wrap leading-relaxed">{r.actionable_recommendations}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer with Deep Grounding Navy Background */}
      <footer className="bg-[#12355B] text-slate-300 border-t border-slate-700 mt-12 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Tech Netra Logo" 
              className="w-10 h-10 rounded-full object-cover bg-white p-0.5 border border-[#19B5E6]/40 shadow-sm" 
            />
            <div>
              <div className="font-bold text-white text-sm tracking-wide">TECH NETRA CYBER RADAR</div>
              <div className="text-xs text-slate-400">National Cyber Safety & Misinformation Threat Intelligence</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right space-y-1">
            <div>&copy; {new Date().getFullYear()} Tech Netra Platform. All rights reserved.</div>
            <div className="text-slate-500 font-mono">Version 2.4-Production // Encrypted Threat Feeds</div>
          </div>
        </div>
      </footer>

      {/* Detailed Post Inspection Modal */}
      <AnalysisModal
        post={analyzingPost}
        onClose={() => setAnalyzingPost(null)}
        onFlagToggle={handleFlagToggle}
      />

      {/* Printable Report Modal */}
      <ReportDossierModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialTopic={reportTopic}
      />
    </div>
  );
}
