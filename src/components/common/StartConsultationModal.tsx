import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockDoctors, consultationReasons } from '../../data/mockData';
import { Doctor, LanguageCode } from '../../types';
import {
  Video,
  X,
  Stethoscope,
  Globe,
  MessageSquare,
  Mic,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const StartConsultationModal: React.FC = () => {
  const {
    isStartConsultationModalOpen,
    setIsStartConsultationModalOpen,
    startNewConsultationSession,
    language: appLanguage,
    t,
  } = useApp();

  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(mockDoctors[0]);
  const [selectedReason, setSelectedReason] = useState<string>(consultationReasons[0].labelEn);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(appLanguage);
  const [selectedCommPref, setSelectedCommPref] = useState<string>('Live Captions & Text Chat');

  if (!isStartConsultationModalOpen) return null;

  const commPreferences = [
    {
      id: 'captions_text',
      labelEn: 'Live Captions & Text Chat',
      labelTa: 'நேரடி வசனங்கள் & உரை அரட்டை',
      icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
      descEn: 'AI transcribes doctor speech while you type in English or Tamil.',
      descTa: 'மருத்துவர் பேச்சை AI வசனங்களாக காட்டும், நீங்கள் தட்டச்சு செய்யலாம்.',
    },
    {
      id: 'voice_text',
      labelEn: 'Voice-to-Text & Speech Synthesis (TTS)',
      labelTa: 'குரல்-வழி உரை & ஒலி தொகுப்பு (TTS)',
      icon: <Mic className="w-4 h-4 text-emerald-600" />,
      descEn: 'Speak in your language and AI speaks aloud to your doctor.',
      descTa: 'உங்கள் குரல் உரையாகி மருத்துவருக்கு வாசிக்கப்படும்.',
    },
    {
      id: 'sign_language',
      labelEn: 'Sign Language (ISL) Gesture Assistant',
      labelTa: 'சைகை மொழி (ISL) உதவி',
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      descEn: 'Assisted Indian Sign Language gestures recognized into text.',
      descTa: 'சைகை மொழி சைகைகள் உடனடியாக உரையாக மாற்றப்படும்.',
    },
  ];

  const handleStart = () => {
    startNewConsultationSession({
      doctor: selectedDoctor,
      reason: selectedReason,
      language: selectedLanguage,
      commPreference: selectedCommPref,
    });
    navigate('/consultation');
  };

  return (
    <div
      id="start-consultation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#0EA5A4] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {appLanguage === 'ta' ? 'புதிய மருத்துவ ஆலோசனையைத் தொடங்கு' : 'Start New Medical Consultation'}
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                {appLanguage === 'ta'
                  ? 'செவித்திறன் குறைபாடுள்ள நோயாளிகளுக்கான நிகழ்நேர AI அணுகல் அமர்வு'
                  : 'Real-time AI-assisted accessible session for Deaf Patients'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStartConsultationModalOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Step 1: Select Reason */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>1. {appLanguage === 'ta' ? 'ஆலோசனைக்கான காரணம்:' : 'Reason for Consultation:'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {consultationReasons.map(r => {
                const label = appLanguage === 'ta' ? r.labelTa : r.labelEn;
                const isSelected = selectedReason === r.labelEn;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.labelEn)}
                    className={`p-3 text-left rounded-2xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Language Preference */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>2. {appLanguage === 'ta' ? 'விருப்பமான மொழி:' : 'Consultation Language:'}</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedLanguage('en')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  selectedLanguage === 'en'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>🇬🇧 English</span>
                {selectedLanguage === 'en' && <ShieldCheck className="w-4 h-4 text-blue-600" />}
              </button>
              <button
                type="button"
                onClick={() => setSelectedLanguage('ta')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                  selectedLanguage === 'ta'
                    ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>🇮🇳 தமிழ் (Tamil)</span>
                {selectedLanguage === 'ta' && <ShieldCheck className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Step 3: Communication Preference */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>3. {appLanguage === 'ta' ? 'தொடர்பு விருப்பத்தேர்வு:' : 'Communication Mode:'}</span>
            </label>
            <div className="space-y-2">
              {commPreferences.map(pref => {
                const label = appLanguage === 'ta' ? pref.labelTa : pref.labelEn;
                const desc = appLanguage === 'ta' ? pref.descTa : pref.descEn;
                const isSelected = selectedCommPref === pref.labelEn;
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => setSelectedCommPref(pref.labelEn)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                      {pref.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold">{label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Select Doctor */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>4. {appLanguage === 'ta' ? 'மருத்துவரைத் தேர்ந்தெடுக்கவும்:' : 'Choose Consulting Physician:'}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockDoctors.map(doc => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                        {doc.specialization}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{doc.rating}</span>
                        <span>•</span>
                        <span>{doc.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsStartConsultationModalOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            {appLanguage === 'ta' ? 'ரத்து செய்' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0EA5A4] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <span>{appLanguage === 'ta' ? 'ஆலோசனையை உடனே தொடங்கு' : 'Launch Consultation Room'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
