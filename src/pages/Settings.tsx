import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  Settings,
  User,
  Eye,
  Type,
  Maximize2,
  ZapOff,
  Languages,
  Captions,
  Volume2,
  ShieldCheck,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    setUser,
    accessibility,
    updateAccessibility,
    resetAccessibility,
    language,
    setLanguage,
    speakText,
    addNotification,
    t,
  } = useApp();

  const [nameInput, setNameInput] = useState(user?.name || 'Meena Krishnan');
  const [emailInput, setEmailInput] = useState(user?.email || 'meena.krishnan@example.com');
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name: nameInput, email: emailInput };
      setUser(updated);
      setIsSavedAlert(true);
      setTimeout(() => setIsSavedAlert(false), 3000);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your accessibility profile has been updated.',
      });
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    addNotification({
      type: 'info',
      title: 'Local Cache Cleared',
      message: 'Local session storage reset to initial demo defaults.',
    });
    window.location.reload();
  };

  const handleTestTTS = () => {
    speakText(
      language === 'ta'
        ? "வணக்கம்! சைன்பிரிட்ஜ் குரல் தொகுப்பு வெற்றிகரமாக செயல்படுகிறது."
        : "Hello! SignBridge text-to-speech voice synthesis is functioning properly.",
      language === 'ta' ? 'ta' : 'en'
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-7 h-7 text-[#2563EB]" />
          <span>{t('tabSettings')} & Accessibility Preferences</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize patient interface sizing, caption scales, speech rates, language, and clinical safety options.
        </p>
      </div>

      {/* 1. Patient Profile Card */}
      <div className="p-6 sm:p-8 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB]" />
            <span>Patient Profile & Disability Designation</span>
          </h2>
          {isSavedAlert && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Hearing Condition
              </label>
              <select
                defaultValue="deaf"
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="deaf">Deaf (Prefers Visual Captions & Chat)</option>
                <option value="hard_of_hearing">Hard of Hearing (Prefers Amplified + Captions)</option>
                <option value="speech_impaired">Speech Impaired (Prefers Text-to-Speech)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Default Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English (US/India)</option>
                <option value="ta">தமிழ் (Tamil - Chennai/Tamil Nadu)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Global Accessibility Preferences */}
      <div className="p-6 sm:p-8 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#0EA5A4]" />
            <span>{t('accessibilityMode')} & Display Settings</span>
          </h2>
          <button
            onClick={resetAccessibility}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetDefaults')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Large Text Switch */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-[#2563EB]" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('largeText')}
                </div>
                <div className="text-xs text-slate-500">
                  {accessibility.fontSize === 'normal' ? 'Standard 16px' : 'Enlarged 21px'}
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                updateAccessibility({
                  fontSize: accessibility.fontSize === 'xlarge' ? 'normal' : 'xlarge',
                })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                accessibility.fontSize !== 'normal' ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  accessibility.fontSize !== 'normal' ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* High Contrast Mode */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-amber-500" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('highContrast')}
                </div>
                <div className="text-xs text-slate-500">
                  Deep black canvas with bright neon accents
                </div>
              </div>
            </div>
            <button
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                accessibility.highContrast ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  accessibility.highContrast ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Extra Large Touch Buttons */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('extraLargeButtons')}
                </div>
                <div className="text-xs text-slate-500">
                  Minimum 52px height for all actions
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                updateAccessibility({ extraLargeButtons: !accessibility.extraLargeButtons })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                accessibility.extraLargeButtons ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  accessibility.extraLargeButtons ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ZapOff className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {t('reducedMotion')}
                </div>
                <div className="text-xs text-slate-500">
                  Disable spring animations & transitions
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                updateAccessibility({ reducedMotion: !accessibility.reducedMotion })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                accessibility.reducedMotion ? 'bg-[#2563EB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  accessibility.reducedMotion ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Text-to-Speech & Voice Settings */}
      <div className="p-6 sm:p-8 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#2563EB]" />
          <span>Speech Synthesis (TTS) & Voice Engine</span>
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Voice Playback Speed</span>
                <span>{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Voice Pitch</span>
                <span>{speechPitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={speechPitch}
                onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleTestTTS}
              variant="outline"
              size="sm"
              leftIcon={<Volume2 className="w-4 h-4 text-[#2563EB]" />}
            >
              Test Text-to-Speech Engine
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Safety & System Maintenance */}
      <div className="p-6 sm:p-8 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Clinical AI Safety & Local Data Management</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          SignBridge AI is built with strict deterministic safety boundaries. The AI models run on client/server pipelines that enforce verbatim extraction without medical hallucination.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <Button
            onClick={handleClearCache}
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Clear Local Data & Re-seed Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
