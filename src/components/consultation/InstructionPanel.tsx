import React from 'react';
import { useApp } from '../../context/AppContext';
import { InstructionCategoryBadge, InstructionStatusBadge } from '../common/Badge';
import {
  Star,
  Pill,
  Calendar,
  AlertTriangle,
  Volume2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const InstructionPanel: React.FC = () => {
  const {
    activeConsultation,
    speakText,
    language,
    t,
  } = useApp();

  const instructions = activeConsultation.instructions;

  return (
    <div className="flex flex-col h-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-[#E2E8F0] dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            {t('tabInstructions')}
          </span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/60 dark:border-amber-800/60">
            {instructions.length} Active
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          Auto-extracted by AI
        </span>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/80 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="font-semibold leading-relaxed">
          {t('dosageWarning')}
        </p>
      </div>

      {/* Instructions Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px]">
        {instructions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-sm">
            <Star className="w-8 h-8 mb-2 opacity-40 text-amber-500" />
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {t('noInstructions')}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              As the doctor speaks prescriptions, follow-ups, and dietary advice, SignBridge extracts them here.
            </p>
          </div>
        ) : (
          instructions.map((ins) => (
            <div
              key={ins.id}
              className={`p-4 rounded-2xl border transition-all ${
                ins.status === 'confirmed'
                  ? 'bg-white/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}
            >
              {/* Category & Status header */}
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <InstructionCategoryBadge category={ins.category} size="sm" />
                <div className="flex items-center gap-2">
                  <InstructionStatusBadge status={ins.status} size="sm" />
                  <button
                    onClick={() => speakText(ins.text)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Instruction Text */}
              <p className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                {language === 'ta' && ins.tamilText ? ins.tamilText : ins.text}
              </p>

              {/* Tamil translation under English text */}
              {ins.tamilText && language === 'en' && (
                <p className="mt-2 text-xs text-teal-800 dark:text-teal-300 bg-teal-50/90 dark:bg-teal-950/40 p-2.5 rounded-xl border border-teal-200 dark:border-teal-800 font-medium">
                  [தமிழ்]: {ins.tamilText}
                </p>
              )}

              {/* Timestamp & Confidence footer */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Logged at {ins.timestamp}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  AI Accuracy: {Math.round(ins.confidence * 100)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
