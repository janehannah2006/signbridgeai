import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  Captions,
  Languages,
  FileText,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, language, setLanguage, t } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('meena.krishnan@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(true);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  const handleDemoAccess = () => {
    login(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Language Toggle */}
      <div className="absolute top-6 right-6 flex items-center bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl p-1 rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm z-10">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            language === 'en'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ta')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            language === 'ta'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          தமிழ்
        </button>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Section: Product Value & Accessibility Vision */}
        <div className="lg:col-span-7 space-y-6 sm:pr-6">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5A4] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/25">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>SIGNBRIDGE</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100/90 dark:bg-blue-900 text-[#2563EB] font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60">
                  AI Assistant
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Healthcare Accessibility Platform
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              "Making medical conversations more accessible."
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Real-time AI-powered communication support for deaf and hard-of-hearing patients during virtual consultations.
            </p>
          </div>

          {/* Key Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-start gap-3 p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
              <Captions className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Live Speech Captions
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  High-accuracy real-time transcription with speaker recognition.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
              <Languages className="w-5 h-5 text-[#0EA5A4] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Tamil & English Support
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Instant bilingual translation of clinical terminology.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
              <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Prescription Logger
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Extracts dosages, follow-ups, and tests without guessing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm">
              <MessageSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Accessible Messaging
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Two-way text communication with speech synthesis (TTS).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Safety Protocol: Never invents medicines or dosages.</span>
          </div>
        </div>

        {/* Right Section: Sign In & Instant Demo Access Card */}
        <div className="lg:col-span-5">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-slate-800/80 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {t('loginTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t('loginSubtitle')}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t('signIn')}
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white/80 dark:bg-slate-900 px-3 text-xs uppercase text-slate-400 font-bold tracking-wider">
                Or Instant Preview
              </span>
            </div>

            {/* Instant Demo Access Button */}
            <div className="space-y-3">
              <Button
                onClick={handleDemoAccess}
                variant="secondary"
                size="lg"
                className="w-full font-bold"
                leftIcon={<Sparkles className="w-4 h-4" />}
              >
                {t('continueAsDemo')}
              </Button>

              <div className="p-3.5 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-2xl text-center text-xs text-teal-900 dark:text-teal-200 font-medium">
                <span className="font-bold">No credentials required.</span> Complete consultation simulation with Dr. Ananya Sharma preloaded.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
