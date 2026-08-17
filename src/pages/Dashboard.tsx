import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  Video,
  Captions,
  FileText,
  MessageSquare,
  Accessibility,
  Languages,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Stethoscope,
  Volume2,
  HeartPulse,
  Plus,
  AlertTriangle,
  Send,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    consultations,
    transcripts,
    instructions,
    doctorConversations,
    activeConsultation,
    profileCompletionPercentage,
    unreadMessagesCount,
    setLanguage,
    language,
    setIsAccessibilityPanelOpen,
    setIsStartConsultationModalOpen,
    setIsEmergencyModalOpen,
    speakText,
    t,
  } = useApp();

  const navigate = useNavigate();

  const greetingKey = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'goodMorning';
    if (hour < 17) return 'goodAfternoon';
    return 'goodEvening';
  };

  const lastConsultation = consultations[0];
  const recentInstructions = instructions.slice(0, 3);
  const activeDoctorConvs = doctorConversations.slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Greeting & Fast Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB]">
              {language === 'ta' ? 'நோயாளி கட்டுப்பாட்டு மையம்' : 'Patient Healthcare Dashboard'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#2563EB] font-bold">
              Deaf Accessible
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {t(greetingKey())}, {user?.name || 'Meena Krishnan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta'
              ? 'உங்கள் மருத்துவ ஆலோசனைகள், மருத்துவர் உரையாடல்கள் மற்றும் குறிப்புகளை எளிதாக நிர்வகியுங்கள்.'
              : 'Monitor active consultations, chat with your doctors, view AI-extracted instructions, and access SOS medical help.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Emergency SOS Shortcut */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-500/25 transition-all transform active:scale-95 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{language === 'ta' ? 'அவசர உதவி (SOS)' : 'Emergency SOS'}</span>
          </button>

          {/* Start Consultation Button */}
          <button
            onClick={() => setIsStartConsultationModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய ஆலோசனை' : 'Start Consultation'}</span>
          </button>

          {/* Bilingual Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Languages className="w-4 h-4 text-blue-600" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Accessibility Drawer Toggle */}
          <button
            onClick={() => setIsAccessibilityPanelOpen(true)}
            className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#2563EB] border border-blue-200 dark:border-blue-800 transition-colors"
            title="Accessibility Controls"
          >
            <span className="text-base">♿</span>
          </button>
        </div>
      </div>

      {/* Active Consultation Banner (if currently in session) */}
      {activeConsultation.status === 'active' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/25">
                  LIVE CALL ACTIVE
                </span>
                <span className="text-xs font-mono font-bold">
                  {Math.floor(activeConsultation.timer / 60)}:
                  {(activeConsultation.timer % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black mt-0.5">
                In Consultation with {activeConsultation.doctor.name} ({activeConsultation.doctor.specialization})
              </h2>
              <p className="text-xs text-emerald-100">
                Live speech captions, AI Tamil translation, and key instructions are actively processing.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/consultation')}
            className="py-2.5 px-5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs shadow-md transition-all self-start sm:self-center shrink-0"
          >
            Return to Video Room →
          </button>
        </div>
      )}

      {/* Top 4 Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Consultations */}
        <div
          onClick={() => navigate('/consultations')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-0.5 rounded-full">
              {consultations.length} Completed
            </span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ta' ? 'மருத்துவ ஆலோசனைகள்' : 'Total Consultations'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {consultations.length + (activeConsultation.status === 'active' ? 1 : 0)} Sessions
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Last: {lastConsultation?.date || 'Today'}</span>
          </div>
        </div>

        {/* Metric 2: Doctor Messages */}
        <div
          onClick={() => navigate('/messages')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600">
              <MessageSquare className="w-5 h-5" />
            </span>
            {unreadMessagesCount > 0 ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-0.5 rounded-full animate-bounce">
                {unreadMessagesCount} Unread
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                All Read
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ta' ? 'மருத்துவர் செய்திகள்' : 'Doctor Messages'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {doctorConversations.length} Threads
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
            {doctorConversations[0]?.doctorName}: {doctorConversations[0]?.lastMessageTime}
          </div>
        </div>

        {/* Metric 3: Medical Instructions */}
        <div
          onClick={() => navigate('/instructions')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <FileText className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-0.5 rounded-full">
              AI Captured
            </span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ta' ? 'மருத்துவ அறிவுரைகள்' : 'Logged Instructions'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {instructions.length} Notes
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Medications, tests & follow-ups
          </div>
        </div>

        {/* Metric 4: Profile Completion */}
        <div
          onClick={() => navigate('/medical-profile')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <UserCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              {profileCompletionPercentage}% Complete
            </span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'ta' ? 'மருத்துவ சுயவிவரம்' : 'Medical Profile'}
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user?.medicalProfile?.bloodGroup || 'O+'} • {user?.medicalProfile?.hearingLossLevel || 'Severe'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Emergency contact synced
          </div>
        </div>
      </div>

      {/* Main 4 Action Launchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: Video Consultation */}
        <div
          onClick={() => setIsStartConsultationModalOpen(true)}
          className="p-5 rounded-3xl bg-gradient-to-tr from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="p-3 bg-white/20 rounded-2xl w-fit">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-bold">
              {language === 'ta' ? 'மருத்துவரை அழைக்கவும்' : 'Consult with Doctor'}
            </h3>
            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Start an accessible live video session with speech-to-text captions & Tamil translations.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-100">
            <span>Connect Doctor</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action 2: Doctor Messages */}
        <div
          onClick={() => navigate('/messages')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 rounded-2xl w-fit">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'மருத்துவருக்கு செய்தி அனுப்பவும்' : 'Message Physician'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Send questions to Dr. Rajesh Kumar or Dr. Priya. Includes speech voice-in & audio readouts.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-teal-600">
            <span>Open Chat Threads</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action 3: AI Symptoms Explainer */}
        <div
          onClick={() => navigate('/ai-assistant')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 rounded-2xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'AI தகவல் உதவியாளர்' : 'AI Communication Tools'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Structure your symptoms, simplify prescription notes into plain language, or translate notes.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Explore AI Tools</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Action 4: Medical Profile */}
        <div
          onClick={() => navigate('/medical-profile')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-2xl w-fit">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'மருத்துவ சுயவிவரம்' : 'Medical Profile & SOS'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Manage hearing loss specifications, allergy history, active medications, and SOS contacts.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Update Profile</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Doctor Messages & Extracted Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Columns: Recent Doctor Messages */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>{language === 'ta' ? 'சமீபத்திய மருத்துவர் உரையாடல்கள்' : 'Recent Doctor Conversations'}</span>
            </h2>
            <button
              onClick={() => navigate('/messages')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeDoctorConvs.map(conv => (
              <div
                key={conv.doctorId}
                onClick={() => navigate('/messages')}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={conv.doctorAvatar}
                    alt={conv.doctorName}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.doctorName}
                      </h4>
                      {conv.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-blue-600 font-semibold truncate">
                      {conv.doctorSpecialization}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-semibold">{conv.lastMessageTime}</span>
                  <div className="text-teal-600 text-xs font-bold mt-1">Reply →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Columns: Key Extracted Instructions */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>{language === 'ta' ? 'சமீபத்திய மருத்துவ அறிவுரைகள்' : 'Key Extracted Instructions'}</span>
            </h2>
            <button
              onClick={() => navigate('/instructions')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentInstructions.map(ins => (
              <div
                key={ins.id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-600 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950">
                    {ins.category}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span>{ins.doctorName}</span>
                    <span>•</span>
                    <span>{ins.date}</span>
                    <button
                      onClick={() => speakText(language === 'ta' && ins.tamilText ? ins.tamilText : ins.text)}
                      title="Speak Instruction"
                      className="text-slate-500 hover:text-indigo-600 p-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                  {ins.text}
                </p>

                {ins.tamilText && (
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    🇮🇳 {ins.tamilText}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
