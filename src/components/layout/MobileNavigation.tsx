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
  Settings,
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { activeConsultation, t } = useApp();
  const location = useLocation();

  const mobileNavItems = [
    { to: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    {
      to: '/consultation',
      label: 'Consult',
      icon: <Video className="w-5 h-5" />,
      badge: activeConsultation.status === 'active',
    },
    { to: '/captions', label: 'Captions', icon: <Captions className="w-5 h-5" /> },
    { to: '/messages', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { to: '/instructions', label: 'Notes', icon: <Star className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around select-none shadow-lg">
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
              isActive
                ? 'text-[#2563EB] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
