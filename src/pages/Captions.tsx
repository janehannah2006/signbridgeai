import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge, InstructionCategoryBadge } from '../components/common/Badge';
import {
  Captions,
  Type,
  Languages,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  AlertTriangle,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const CaptionsPage: React.FC = () => {
  const {
    activeConsultation,
    addDoctorCaption,
    accessibility,
    updateAccessibility,
    language,
    setLanguage,
    speakText,
    t,
  } = useApp();

  const [selectedSpeaker, setSelectedSpeaker] = useState<'doctor' | 'patient'>('doctor');
  const [testSpeechInput, setTestSpeechInput] = useState('');
  const [isSimulatingMic, setIsSimulatingMic] = useState(false);

  const currentCaption = activeConsultation.currentLiveCaption;

  const fontSizes = [
    { label: t('sizeSmall'), value: 'small', class: 'text-lg sm:text-xl' },
    { label: t('sizeMedium'), value: 'medium', class: 'text-xl sm:text-2xl' },
    { label: t('sizeLarge'), value: 'large', class: 'text-2xl sm:text-3xl font-semibold' },
    { label: t('sizeXLarge'), value: 'xlarge', class: 'text-3xl sm:text-4xl font-extrabold' },
  ] as const;

  const handleTestSpeechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testSpeechInput.trim()) return;
    addDoctorCaption(testSpeechInput.trim(), true);
    setTestSpeechInput('');
  };

  const sampleStatements = [
    "Take 500mg Paracetamol after meals if you develop a fever.",
    "Do not stop your blood pressure medicine suddenly.",
    "Your blood tests are normal, but please reduce salty foods.",
    "Please apply the ointment... [unclear speech] ... twice a day.",
    "Come back for a follow-up consultation in ten days.",
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Captions className="w-7 h-7 text-[#2563EB]" />
            <span>{t('tabCaptions')} — Dedicated Accessibility View</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Optimized high-contrast, large-format live captions with automated Tamil translation and medical NLP extraction.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Switch */}
          <div className="flex items-center bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl p-1 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                language === 'ta'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              தமிழ் (Tamil)
            </button>
          </div>

          {/* High Contrast Toggle */}
          <Button
            onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
            variant="outline"
            size="sm"
          >
            {accessibility.highContrast ? 'Standard Mode' : 'High Contrast'}
          </Button>
        </div>
      </div>

      {/* Caption Font Size Selector Bar */}
      <div className="p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Type className="w-4 h-4 text-[#2563EB]" />
          <span>{t('captionSettings')}: {t('fontSize')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateAccessibility({ captionSize: size.value })}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                accessibility.captionSize === size.value
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Large Featured Live Caption Display Area */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-2 border-blue-300/80 dark:border-blue-700/80 shadow-xl space-y-6">
        {/* Caption Header / Speaker / Confidence */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100/80 dark:bg-blue-950/80 text-[#2563EB] flex items-center justify-center font-bold text-sm border border-blue-200/60 dark:border-blue-900/60">
              DR
            </div>
            <div>
              <div className="font-extrabold text-base text-slate-900 dark:text-white">
                {activeConsultation.doctor.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {activeConsultation.doctor.specialization}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" size="md" icon={<Sparkles className="w-3.5 h-3.5" />}>
              {t('captionConfidence')}: {Math.round((currentCaption?.confidence || 0.96) * 100)}%
            </Badge>

            {currentCaption?.category && (
              <InstructionCategoryBadge category={currentCaption.category} size="md" />
            )}

            <button
              onClick={() =>
                speakText(
                  currentCaption?.text ||
                    "Please continue taking your medication twice a day after meals."
                )
              }
              className="p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80"
              title="Speak caption aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Big Caption Text */}
        <div
          className={`${
            fontSizes.find((s) => s.value === accessibility.captionSize)?.class ||
            'text-2xl sm:text-3xl font-semibold'
          } text-slate-900 dark:text-white leading-relaxed tracking-normal`}
        >
          {currentCaption ? (
            language === 'ta' && currentCaption.tamilText ? (
              currentCaption.tamilText
            ) : (
              currentCaption.text
            )
          ) : (
            `"Please continue taking your medication twice a day after meals and avoid strenuous activity."`
          )}
        </div>

        {/* Bilingual Tamil / English Translation Container */}
        <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1.5">
            <Languages className="w-4 h-4 text-[#0EA5A4]" />
            <span>
              {language === 'ta' ? 'English Translation' : 'தமிழ் மொழிபெயர்ப்பு (Tamil Translation)'}
            </span>
          </div>
          <div className="text-base sm:text-lg font-medium text-teal-950 dark:text-teal-100 leading-relaxed">
            {language === 'ta'
              ? currentCaption?.text || "Please continue taking your medication twice a day after meals and avoid strenuous activity."
              : currentCaption?.tamilText || "தயவுசெய்து உங்கள் மருந்தை உணவுக்குப் பிறகு தினமும் இரண்டு முறை தொடர்ந்து எடுத்துக் கொள்ளுங்கள்."}
          </div>
        </div>

        {/* Unclear Speech Warning */}
        {currentCaption?.isUnclear && (
          <div className="p-4 bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                {t('unclearWarning')}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                The doctor's statement had audio gaps or low confidence. Please verify with your doctor before taking medication.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Utterance Simulator & Speech Recognition Controls */}
      <div className="p-6 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          <span>Simulate Speech & Test AI Recognition Engine</span>
        </h3>

        {/* Sample Statements */}
        <div className="flex flex-wrap gap-2">
          {sampleStatements.map((stmt, idx) => (
            <button
              key={idx}
              onClick={() => addDoctorCaption(stmt, true)}
              className="px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700 hover:border-blue-400 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all hover:text-[#2563EB] shadow-xs"
            >
              {stmt}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <form onSubmit={handleTestSpeechSubmit} className="flex gap-3">
          <input
            type="text"
            value={testSpeechInput}
            onChange={(e) => setTestSpeechInput(e.target.value)}
            placeholder="Type any medical statement (e.g., 'Take Amoxicillin 500mg for 5 days') to test real-time NLP..."
            className="flex-1 px-4 py-3 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" variant="primary">
            Process Speech
          </Button>
        </form>
      </div>
    </div>
  );
};
