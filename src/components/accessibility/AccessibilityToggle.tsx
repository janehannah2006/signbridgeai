import React from 'react';
import { useApp } from '../../context/AppContext';
import { Accessibility } from 'lucide-react';

export const AccessibilityToggle: React.FC = () => {
  const { setIsAccessibilityPanelOpen, t } = useApp();

  return (
    <button
      onClick={() => setIsAccessibilityPanelOpen(true)}
      aria-label="Open Accessibility Panel"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-3.5 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 active:scale-95 group"
      title={t('accessibilityMode')}
    >
      <span className="text-xl leading-none">♿</span>
      <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider pr-1">
        {t('accessibility')}
      </span>
    </button>
  );
};
