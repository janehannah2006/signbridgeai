import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  Sparkles,
  Play,
  RotateCw,
  User,
} from 'lucide-react';

export const VideoPanel: React.FC = () => {
  const {
    activeConsultation,
    addDoctorCaption,
    user,
    language,
    t,
  } = useApp();

  const [customDoctorInput, setCustomDoctorInput] = useState('');
  const isDoctorSpeaking = activeConsultation.status === 'active' && activeConsultation.currentLiveCaption?.speaker === 'doctor';

  const handleManualDoctorUtterance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDoctorInput.trim()) return;
    addDoctorCaption(customDoctorInput.trim(), true);
    setCustomDoctorInput('');
  };

  const sampleDoctorPhrases = [
    "Please continue taking your medication twice a day after food.",
    "Do you feel any dizziness or lightheadedness when standing up?",
    "I recommend getting a routine blood sugar and hemogram test done.",
    "Take the tablet... [unclear audio] ... and rest in the afternoon.",
    "Schedule a follow-up visit after 7 days if the symptoms continue.",
  ];

  return (
    <div className="flex flex-col h-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
      {/* Video Screen Area */}
      <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Doctor Main Video Stream Background / Avatar */}
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
          {/* Ambient Glow behind avatar */}
          <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <img
              src={activeConsultation.doctor.avatar}
              alt={activeConsultation.doctor.name}
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 transition-all duration-300 relative z-10 ${
                isDoctorSpeaking
                  ? 'border-[#0EA5A4] shadow-[0_0_40px_rgba(14,165,164,0.6)] scale-105'
                  : 'border-slate-700/80 opacity-90'
              }`}
            />
            {/* Audio wave indicator badge */}
            {isDoctorSpeaking && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-[#0EA5A4] text-white text-xs font-bold rounded-full shadow-lg z-20">
                <span className="w-1.5 h-3 bg-white rounded animate-wave-1" />
                <span className="w-1.5 h-5 bg-white rounded animate-wave-2" />
                <span className="w-1.5 h-2 bg-white rounded animate-wave-3" />
                <span className="w-1.5 h-4 bg-white rounded animate-wave-4" />
                <span className="ml-1 text-[11px] whitespace-nowrap">{t('doctorSpeaking')}</span>
              </div>
            )}
          </div>

          <div className="mt-4 relative z-10">
            <h3 className="text-white font-bold text-base sm:text-lg">
              {activeConsultation.doctor.name}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              {activeConsultation.doctor.specialization} • Online
            </p>
          </div>
        </div>

        {/* Patient Picture-in-Picture (PiP) */}
        <div className="absolute bottom-4 right-4 w-28 sm:w-36 aspect-video bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl flex items-center justify-center z-20">
          {activeConsultation.isCameraOff ? (
            <div className="flex flex-col items-center justify-center text-slate-400 text-[10px]">
              <VideoOff className="w-4 h-4 mb-1" />
              <span>Camera Off</span>
            </div>
          ) : user?.avatar ? (
            <div className="relative w-full h-full">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] text-white font-medium">
                You (Meena)
              </div>
            </div>
          ) : (
            <User className="w-6 h-6 text-slate-500" />
          )}
        </div>

        {/* Top Badges overlay on Video */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-white text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>LIVE CONSULTATION</span>
          </div>
          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10 text-teal-300 text-xs font-semibold">
            ✨ AI Live Sync
          </div>
        </div>
      </div>

      {/* Interactive Speech Simulation / Tester Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-t border-[#E2E8F0] dark:border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Interactive Doctor Speech Simulation</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Simulate live utterances
          </span>
        </div>

        {/* Quick sample utterances */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {sampleDoctorPhrases.map((phrase, idx) => (
            <button
              key={idx}
              onClick={() => addDoctorCaption(phrase, true)}
              className="flex-shrink-0 text-left px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-all hover:text-[#2563EB] shadow-xs"
              title="Click to have doctor say this phrase"
            >
              "{phrase.slice(0, 32)}..."
            </button>
          ))}
        </div>

        {/* Custom phrase input form */}
        <form onSubmit={handleManualDoctorUtterance} className="flex gap-2">
          <input
            type="text"
            value={customDoctorInput}
            onChange={(e) => setCustomDoctorInput(e.target.value)}
            placeholder="Type custom doctor statement to test AI captions & NLP..."
            className="flex-1 px-3.5 py-2 text-xs bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" size="sm" variant="secondary">
            Speak
          </Button>
        </form>
      </div>
    </div>
  );
};
