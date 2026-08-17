import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge, InstructionCategoryBadge } from '../common/Badge';
import {
  Captions,
  AlertTriangle,
  Sparkles,
  Volume2,
  Languages,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';

export const CaptionPanel: React.FC = () => {
  const {
    activeConsultation,
    accessibility,
    updateAccessibility,
    language,
    setLanguage,
    speakText,
    t,
  } = useApp();

  const captionEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (accessibility.autoScroll) {
      captionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConsultation.captions, activeConsultation.currentLiveCaption, accessibility.autoScroll]);

  const captionSizeClass = {
    small: 'text-sm sm:text-base leading-relaxed',
    medium: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl font-medium leading-relaxed',
    xlarge: 'text-xl sm:text-2xl font-bold leading-relaxed',
  }[accessibility.captionSize || 'large'];

  const currentCaption = activeConsultation.currentLiveCaption;

  return (
    <div className="flex flex-col h-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
      {/* Panel Controls & Toolbar */}
      <div className="px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-[#E2E8F0] dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Captions className="w-4 h-4 text-[#2563EB]" />
          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            {t('tabCaptions')}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-[#2563EB] font-bold border border-blue-200/60 dark:border-blue-800/60">
            Live AI
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Large text toggle */}
          <button
            onClick={() =>
              updateAccessibility({
                captionSize: accessibility.captionSize === 'xlarge' ? 'medium' : 'xlarge',
              })
            }
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all ${
              accessibility.captionSize === 'xlarge'
                ? 'bg-blue-50/90 border-blue-300 text-[#2563EB] shadow-xs'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('largeText')}: {accessibility.captionSize === 'xlarge' ? 'ON' : 'OFF'}
          </button>

          {/* Auto scroll toggle */}
          <button
            onClick={() => updateAccessibility({ autoScroll: !accessibility.autoScroll })}
            className={`px-3 py-1 text-xs font-semibold rounded-xl border transition-all ${
              accessibility.autoScroll
                ? 'bg-teal-50/90 border-teal-300 text-[#0EA5A4] shadow-xs'
                : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {t('autoScroll')}
          </button>
        </div>
      </div>

      {/* Primary Live Caption Stream Banner */}
      {currentCaption && (
        <div
          className={`p-4 sm:p-5 border-b-2 transition-all ${
            currentCaption.isUnclear
              ? 'bg-amber-50/85 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-300/80 dark:border-blue-800/80'
          }`}
        >
          {/* Header info */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-[#2563EB]">
                {currentCaption.speaker === 'doctor'
                  ? activeConsultation.doctor.name
                  : 'Patient'}
              </span>
              {currentCaption.category && (
                <InstructionCategoryBadge category={currentCaption.category} size="sm" />
              )}
            </div>

            {/* AI Confidence badge */}
            <div className="flex items-center gap-2 text-xs">
              <Badge
                variant={currentCaption.isUnclear ? 'warning' : 'success'}
                size="sm"
                icon={<Sparkles className="w-3 h-3" />}
              >
                {t('captionConfidence')}: {Math.round(currentCaption.confidence * 100)}%
              </Badge>
              <button
                onClick={() => speakText(currentCaption.text)}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                title="Read aloud"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Spoken Text in Primary Font Size */}
          <div className={`${captionSizeClass} font-semibold text-slate-900 dark:text-white mb-2`}>
            "{language === 'ta' && currentCaption.tamilText ? currentCaption.tamilText : currentCaption.text}"
          </div>

          {/* Bilingual translation display */}
          {currentCaption.tamilText && language === 'en' && (
            <div className="text-xs sm:text-sm text-teal-800 dark:text-teal-300 bg-teal-50/90 dark:bg-teal-950/60 p-2.5 rounded-xl border border-teal-200 dark:border-teal-800/60 font-medium">
              <span className="font-bold text-teal-900 dark:text-teal-200 mr-1.5">
                [தமிழ்]:
              </span>
              {currentCaption.tamilText}
            </div>
          )}

          {currentCaption.text && language === 'ta' && (
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">
              <span className="font-bold mr-1.5">[English Original]:</span>
              {currentCaption.text}
            </div>
          )}

          {/* Unclear Speech Warning */}
          {currentCaption.isUnclear && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-amber-100/90 dark:bg-amber-900/40 text-amber-950 dark:text-amber-200 rounded-xl text-xs font-bold border border-amber-300 dark:border-amber-700">
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div>{t('unclearWarning')}</div>
                <div className="text-[11px] font-normal text-amber-800 dark:text-amber-300 mt-0.5">
                  Audio clarity was below 70%. Never assume medication dosage.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historical Captions List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[350px]">
        {activeConsultation.captions.length === 0 && !currentCaption ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-sm">
            <Captions className="w-8 h-8 mb-2 opacity-50 text-[#2563EB]" />
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Live captions will appear here in real-time.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Doctor statements are transcribed, translated to Tamil, and checked for key medical instructions.
            </p>
          </div>
        ) : (
          activeConsultation.captions.map((cap) => (
            <div
              key={cap.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                cap.isUnclear
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                  : 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cap.speaker === 'doctor' ? activeConsultation.doctor.name : 'Patient'}
                </span>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>{cap.timestamp}</span>
                  <span className="font-mono text-[11px] text-emerald-600 font-semibold">
                    {Math.round(cap.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {language === 'ta' && cap.tamilText ? cap.tamilText : cap.text}
              </div>

              {cap.isUnclear && (
                <div className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('unclearWarning')}</span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={captionEndRef} />
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-sm border-t border-[#E2E8F0] dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 text-center font-medium">
        🛡️ {t('safetyDisclaimer')}
      </div>
    </div>
  );
};
