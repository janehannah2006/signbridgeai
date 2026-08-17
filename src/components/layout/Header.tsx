import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import {
  Languages,
  Accessibility,
  Radio,
  Video,
  Volume2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    setIsAccessibilityPanelOpen,
    activeConsultation,
    t,
  } = useApp();

  return (
    <header className="sticky top-0 z-20 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Logo Brand */}
      <div className="flex lg:hidden items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#0EA5A4] flex items-center justify-center text-white font-extrabold text-base">
          S
        </div>
        <span className="font-bold text-base text-slate-900 dark:text-white">
          SignBridge AI
        </span>
      </div>

      {/* Active Consultation Status Pill on Desktop */}
      <div className="hidden lg:flex items-center gap-3">
        {activeConsultation.status === 'active' ? (
          <NavLink
            to="/consultation"
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Consultation Active: {activeConsultation.doctor.name}</span>
            <span className="text-emerald-600 font-mono">
              ({Math.floor(activeConsultation.timer / 60)}:
              {(activeConsultation.timer % 60).toString().padStart(2, '0')})
            </span>
          </NavLink>
        ) : (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('tagline')}</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              language === 'ta'
                ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Quick Accessibility Button */}
        <button
          onClick={() => setIsAccessibilityPanelOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-300 rounded-xl text-xs font-bold transition-colors"
          title={t('accessibilityMode')}
        >
          <span className="text-sm">♿</span>
          <span className="hidden sm:inline">{t('accessibility')}</span>
        </button>

        {/* Start / Go to Consultation quick action */}
        {activeConsultation.status !== 'active' ? (
          <NavLink
            to="/consultation"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('startConsultation')}</span>
            <span className="sm:hidden">Consult</span>
          </NavLink>
        ) : (
          <NavLink
            to="/consultation"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Video className="w-3.5 h-3.5 animate-pulse" />
            <span>Return to Call</span>
          </NavLink>
        )}
      </div>
    </header>
  );
};
