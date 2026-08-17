import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import {
  Type,
  Eye,
  ZapOff,
  Maximize2,
  SlidersHorizontal,
  RotateCcw,
  Languages,
  Captions,
  Volume2,
} from 'lucide-react';

export const AccessibilityPanel: React.FC = () => {
  const {
    isAccessibilityPanelOpen,
    setIsAccessibilityPanelOpen,
    accessibility,
    updateAccessibility,
    resetAccessibility,
    language,
    setLanguage,
    t,
  } = useApp();

  return (
    <Modal
      isOpen={isAccessibilityPanelOpen}
      onClose={() => setIsAccessibilityPanelOpen(false)}
      title={t('accessibilityMode')}
      subtitle={t('quickAccessibility')}
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('resetDefaults')}
          </button>
          <Button variant="primary" onClick={() => setIsAccessibilityPanelOpen(false)}>
            {t('close')}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Quick Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Large Text */}
          <button
            onClick={() =>
              updateAccessibility({
                fontSize: accessibility.fontSize === 'xlarge' ? 'normal' : 'xlarge',
              })
            }
            className={`p-4 rounded-xl border-2 text-left flex items-start justify-between transition-all ${
              accessibility.fontSize !== 'normal'
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 text-[#2563EB]'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Type className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('largeText')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {accessibility.fontSize === 'normal' ? 'Standard 16px' : 'Enlarged 21px'}
                </div>
              </div>
            </div>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                accessibility.fontSize !== 'normal'
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-slate-300'
              }`}
            >
              {accessibility.fontSize !== 'normal' && '✓'}
            </span>
          </button>

          {/* High Contrast */}
          <button
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            className={`p-4 rounded-xl border-2 text-left flex items-start justify-between transition-all ${
              accessibility.highContrast
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 text-[#2563EB]'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('highContrast')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Maximum contrast dark mode
                </div>
              </div>
            </div>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                accessibility.highContrast
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-slate-300'
              }`}
            >
              {accessibility.highContrast && '✓'}
            </span>
          </button>

          {/* Extra Large Buttons */}
          <button
            onClick={() =>
              updateAccessibility({ extraLargeButtons: !accessibility.extraLargeButtons })
            }
            className={`p-4 rounded-xl border-2 text-left flex items-start justify-between transition-all ${
              accessibility.extraLargeButtons
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 text-[#2563EB]'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <Maximize2 className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('extraLargeButtons')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Bigger touch/click targets (52px+)
                </div>
              </div>
            </div>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                accessibility.extraLargeButtons
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-slate-300'
              }`}
            >
              {accessibility.extraLargeButtons && '✓'}
            </span>
          </button>

          {/* Reduced Motion */}
          <button
            onClick={() => updateAccessibility({ reducedMotion: !accessibility.reducedMotion })}
            className={`p-4 rounded-xl border-2 text-left flex items-start justify-between transition-all ${
              accessibility.reducedMotion
                ? 'border-[#2563EB] bg-blue-50/70 dark:bg-blue-950/40 text-[#2563EB]'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <ZapOff className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('reducedMotion')}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Disable transitions & animations
                </div>
              </div>
            </div>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                accessibility.reducedMotion
                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                  : 'border-slate-300'
              }`}
            >
              {accessibility.reducedMotion && '✓'}
            </span>
          </button>
        </div>

        {/* Language Selection */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3 font-bold text-sm text-slate-900 dark:text-white">
            <Languages className="w-4 h-4 text-[#2563EB]" />
            <span>{t('primaryLanguage')}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all text-center ${
                language === 'en'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all text-center ${
                language === 'ta'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>
        </div>

        {/* Caption Size Chooser */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-3 font-bold text-sm text-slate-900 dark:text-white">
            <Captions className="w-4 h-4 text-[#0EA5A4]" />
            <span>{t('captionSettings')}: {t('fontSize')}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateAccessibility({ captionSize: size })}
                className={`py-2 rounded-lg font-medium text-xs sm:text-sm capitalize transition-all ${
                  accessibility.captionSize === size
                    ? 'bg-[#0EA5A4] text-white font-bold'
                    : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {t(`size${size.charAt(0).toUpperCase() + size.slice(1)}` as any)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
