import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Link2, 
  FileText, 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Sliders, 
  Radio, 
  Filter,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function SlidingDashboardDrawer({
  isOpen,
  setIsOpen,
  isPinned,
  setIsPinned,
  activeTab,
  setActiveTab,
  analytics,
  botStats,
  linkStats,
  reportsCount = 0,
  onOpenReportModal,
  onRefresh,
  loading,
  selectedTopic,
  setSelectedTopic,
  soundAlerts,
  setSoundAlerts,
  autoRefreshInterval,
  setAutoRefreshInterval
}) {
  const shouldShow = isOpen || isPinned;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Main Dashboard',
      desc: 'National threat radar & live geo hotspots',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-cyan-50 text-[#1769AA] border-cyan-200'
    },
    {
      id: 'bots',
      label: 'Bot & Cluster Scanner',
      desc: 'Detect coordinated disinformation rings',
      icon: Bot,
      badge: `${botStats?.flagged_bots_count || 8} Bots`,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'links',
      label: 'Phishing & Scam Links',
      desc: 'Malicious domain & APK neutralization',
      icon: Link2,
      badge: `${linkStats?.phishing_count || 6} Blocked`,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'reports',
      label: 'Safety Dossiers',
      desc: 'Synthesized SOC briefings & reports',
      icon: FileText,
      badge: `${reportsCount} Reports`,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const quickTopics = [
    { label: 'All Feeds', value: '' },
    { label: 'Banking Scam', value: '#BankingScamAlert' },
    { label: 'Deepfake Alert', value: '#DeepfakeVideoAlert' },
    { label: 'Exam Rumors', value: '#ExamPaperLeakRumor' },
    { label: 'Cyber Safety', value: '#CyberSafetyAwareness' }
  ];

  return (
    <>
      {/* Backdrop Overlay when open and NOT pinned */}
      {shouldShow && !isPinned && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] z-50 transition-opacity duration-300 cursor-pointer"
        />
      )}

      {/* The Sliding Dashboard Drawer (Opens cleanly from Left Corner) */}
      <aside
        className={`fixed top-0 left-0 h-full w-[330px] sm:w-[370px] bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-2xl z-50 flex flex-col drawer-slide ${
          shouldShow ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200/80 bg-gradient-to-r from-[#12355B] to-[#1769AA] text-white relative overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shadow-inner">
                <img 
                  src="/logo.png" 
                  alt="Tech Netra" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wider uppercase">Dashboard Menu</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-[11px] text-cyan-200 font-mono">Options & Navigation</div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                if (setIsPinned) setIsPinned(false);
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Threat Status */}
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
            <div className="flex items-center gap-1.5 text-cyan-100 font-mono text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>RADAR STATUS: ACTIVE</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
              DEFCON 3
            </span>
          </div>
        </div>

        {/* Scrollable Body with Options */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Navigation Section */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
              <span>Modules</span>
              <span className="text-[10px] text-slate-400 font-mono">4 Views</span>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (!isPinned) setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 flex items-start gap-2.5 border cursor-pointer ${
                      isActive
                        ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-sm shadow-[#1769AA]/20'
                        : 'bg-white hover:bg-slate-50 text-[#12355B] border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-[#1769AA]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">{item.label}</span>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded border ${
                          isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 truncate ${isActive ? 'text-cyan-100' : 'text-slate-500'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Threat Filter Section */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#12355B]">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#1769AA]" />
                Filter by Narrative
              </span>
              {selectedTopic && (
                <button 
                  onClick={() => setSelectedTopic('')} 
                  className="text-[10px] text-[#1769AA] hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => {
                    setSelectedTopic(topic.value);
                    if (!isPinned) setIsOpen(false);
                  }}
                  className={`text-[11px] font-sans px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedTopic === topic.value
                      ? 'bg-[#1769AA] text-white border-[#1769AA] font-bold shadow-2xs'
                      : 'bg-white text-[#4A607A] border-slate-200 hover:border-slate-300 hover:text-[#12355B]'
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry & Preferences */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 flex items-center justify-between">
              <span>Telemetry & Settings</span>
              <Sliders className="w-3 h-3 text-slate-400" />
            </div>

            {/* Sound Alert Toggle */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${soundAlerts ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#12355B]">Sound Chimes</div>
                  <div className="text-[10px] text-slate-500">Audio cue on critical alerts</div>
                </div>
              </div>

              <button
                onClick={() => setSoundAlerts(!soundAlerts)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  soundAlerts ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    soundAlerts ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto-Refresh Frequency Option */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#12355B]">
                  <RefreshCw className={`w-3.5 h-3.5 text-[#1769AA] ${loading ? 'animate-spin' : ''}`} />
                  <span>Auto-Refresh Rate</span>
                </div>
                <span className="text-[10px] font-mono text-[#1769AA] font-bold">
                  {autoRefreshInterval === 0 ? 'Manual' : `${autoRefreshInterval}s`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: 'Off', val: 0 },
                  { label: '30s', val: 30 },
                  { label: '15s', val: 15 }
                ].map((interval) => (
                  <button
                    key={interval.label}
                    onClick={() => setAutoRefreshInterval(interval.val)}
                    className={`py-1 text-[10px] font-mono font-semibold rounded-md border transition-all cursor-pointer ${
                      autoRefreshInterval === interval.val
                        ? 'bg-[#12355B] text-white border-[#12355B]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {interval.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Quick Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2 flex-shrink-0">
          <button
            onClick={() => {
              onOpenReportModal();
              if (!isPinned) setIsOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#1769AA] to-[#12355B] hover:from-[#13558A] hover:to-[#0F2D4E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#19B5E6]" />
            <span>Generate Safety Dossier</span>
          </button>
        </div>
      </aside>
    </>
  );
}

