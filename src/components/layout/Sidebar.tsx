import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Video,
  Captions,
  MessageSquare,
  FileText,
  Star,
  History,
  Settings,
  Accessibility,
  Radio,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout, setIsAccessibilityPanelOpen, activeConsultation, t, language } = useApp();
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', label: t('navDashboard'), icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      to: '/consultation',
      label: t('navConsultation'),
      icon: <Video className="w-5 h-5" />,
      badge: activeConsultation.status === 'active' ? 'Live' : undefined,
    },
    { to: '/captions', label: t('navLiveCaptions'), icon: <Captions className="w-5 h-5" /> },
    { to: '/messages', label: t('navMessages'), icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/transcripts', label: t('navTranscripts'), icon: <FileText className="w-5 h-5" /> },
    { to: '/instructions', label: t('navKeyInstructions'), icon: <Star className="w-5 h-5" /> },
    { to: '/history', label: t('navHistory'), icon: <History className="w-5 h-5" /> },
    { to: '/settings', label: t('navSettings'), icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className="hidden lg:flex flex-col w-64 xl:w-72 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-r border-[#E2E8F0] dark:border-slate-800/80 h-screen sticky top-0 z-30 select-none"
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#E2E8F0]/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5A4] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-extrabold text-xl">
            S
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>SIGNBRIDGE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/80 text-[#2563EB] font-bold">
                AI
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Accessibility Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#2563EB] transition-colors'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Status Area */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        {/* Quick Accessibility Mode button */}
        <button
          onClick={() => setIsAccessibilityPanelOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-blue-300 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">♿</span>
            <span>{t('accessibilityMode')}</span>
          </div>
          <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </button>

        {/* Demo Mode / Connection Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{t('demoMode')}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900 px-1.5 py-0.5 rounded">
            Active
          </span>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Deaf Patient
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
