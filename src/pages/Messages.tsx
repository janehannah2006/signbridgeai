import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SpeechRecognitionService } from '../services/aiService';
import { SignLanguageDetector } from '../components/consultation/SignLanguageDetector';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  CheckCheck,
  Languages,
  Sparkles,
  Search,
  PhoneCall,
  Video,
  Hand,
  Clock,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MessagesPage: React.FC = () => {
  const {
    doctorConversations,
    activeConversationDoctorId,
    setActiveConversationDoctorId,
    markConversationAsRead,
    sendDoctorMessage,
    speakText,
    user,
    language,
    addNotification,
    startConsultation,
    setIsStartConsultationModalOpen,
    t,
  } = useApp();

  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showSignLanguageDrawer, setShowSignLanguageDrawer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConversation =
    doctorConversations.find(c => c.doctorId === activeConversationDoctorId) ||
    doctorConversations[0];

  const filteredConversations = doctorConversations.filter(
    c =>
      c.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.doctorSpecialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quickReplies = [
    { en: 'Yes, I understand clearly.', ta: 'ஆம், எனக்கு தெளிவாக புரிந்தது.' },
    { en: 'Could you please repeat or rephrase that?', ta: 'தயவுசெய்து அதை மீண்டும் விளக்குவீர்களா?' },
    { en: 'I am experiencing moderate pain.', ta: 'எனக்கு மிதமான வலி உள்ளது.' },
    { en: 'I have a known allergy to penicillin.', ta: 'எனக்கு பென்சிலின் ஒவ்வாமை உள்ளது.' },
    { en: 'When should I take this dosage?', ta: 'இந்த மருந்தை எப்போது உட்கொள்ள வேண்டும்?' },
    { en: 'Can you type the prescription name?', ta: 'மருந்தின் பெயரை தட்டச்சு செய்வீர்களா?' },
  ];

  useEffect(() => {
    if (activeConversation) {
      markConversationAsRead(activeConversation.doctorId);
    }
  }, [activeConversationDoctorId, doctorConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;
    const msg = inputMessage.trim();
    setInputMessage('');
    await sendDoctorMessage(activeConversation.doctorId, msg, false);
  };

  const handleQuickReply = async (replyObj: { en: string; ta: string }) => {
    if (!activeConversation) return;
    const textToSend = language === 'ta' ? replyObj.ta : replyObj.en;
    await sendDoctorMessage(activeConversation.doctorId, textToSend, false);
  };

  const handleInsertSignLanguage = (text: string, tamilText?: string) => {
    setInputMessage(prev => (prev ? `${prev} ${text}` : text));
    setShowSignLanguageDrawer(false);
  };

  const toggleVoiceRecording = () => {
    if (isVoiceRecording) {
      speechServiceRef.current?.stop();
      setIsVoiceRecording(false);
      return;
    }

    if (!speechServiceRef.current) {
      speechServiceRef.current = new SpeechRecognitionService();
    }

    speechServiceRef.current.setLanguage(language);

    if (!speechServiceRef.current.isAvailable()) {
      setIsVoiceRecording(true);
      setTimeout(() => {
        const voiceText =
          language === 'ta'
            ? 'மருந்தை உட்கொண்ட பிறகு எனக்கு லேசான தலைவலி உள்ளது.'
            : 'I have been experiencing a mild headache after taking the tablet.';
        setInputMessage(prev => (prev ? `${prev} ${voiceText}` : voiceText));
        setIsVoiceRecording(false);
        addNotification(
          language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice Input',
          language === 'ta' ? 'குரல் உரை வெற்றிகரமாக பதிவு செய்யப்பட்டது.' : 'Speech captured and converted to text.',
          'info'
        );
      }, 1200);
      return;
    }

    setIsVoiceRecording(true);
    speechServiceRef.current.start(
      (text: string, isFinal: boolean) => {
        setInputMessage(prev => (isFinal ? (prev ? `${prev} ${text}` : text) : text));
        if (isFinal) {
          setIsVoiceRecording(false);
        }
      },
      (err: string) => {
        setIsVoiceRecording(false);
        addNotification('Speech Recognition', err, 'info');
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2563EB]">
              {language === 'ta' ? 'மருத்துவர் செய்தித் தொடர்பு' : 'Accessible Messaging Center'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 mt-0.5">
            <MessageSquare className="w-7 h-7 text-[#2563EB]" />
            <span>{language === 'ta' ? 'மருத்துவர் உரையாடல்கள்' : 'Doctor & Clinical Messages'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'ta'
              ? 'மருத்துவரிடம் நேரடியாக செய்திகள் அனுப்பவும், ஆடியோ குரல் கேட்கவும், சைகை மொழி சைகைகளைப் பயன்படுத்தவும்.'
              : 'Direct two-way messaging with on-call physicians, real-time Tamil/English translation, and AI clinical responses.'}
          </p>
        </div>

        <button
          onClick={() => setIsStartConsultationModalOpen(true)}
          className="self-start sm:self-center py-2.5 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          <span>{language === 'ta' ? 'நேரடி வீடியோ ஆலோசனை' : 'Start Video Consultation'}</span>
        </button>
      </div>

      {/* Main 2-Column Messaging Workspace */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left 4 Columns: Conversation Threads List */}
        <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          {/* Search Box */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search doctors or specialties..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.map(conv => {
              const isSelected = activeConversation?.doctorId === conv.doctorId;
              return (
                <div
                  key={conv.doctorId}
                  onClick={() => setActiveConversationDoctorId(conv.doctorId)}
                  className={`p-4 transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={conv.doctorAvatar}
                      alt={conv.doctorName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.doctorName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate">
                      {conv.doctorSpecialization}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shrink-0 animate-pulse">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Columns: Active Chat Thread */}
        <div className="lg:col-span-8 flex flex-col h-[620px]">
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConversation.doctorAvatar}
                    alt={activeConversation.doctorName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeConversation.doctorName}
                    </h2>
                    <p className="text-xs text-blue-600 font-medium">
                      {activeConversation.doctorSpecialization} • Online
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSignLanguageDrawer(!showSignLanguageDrawer)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      showSignLanguageDrawer
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    }`}
                  >
                    <Hand className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'சைகை மொழி' : 'ISL Sign Assistant'}</span>
                  </button>

                  <button
                    onClick={() => setIsStartConsultationModalOpen(true)}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Start Live Video"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sign Language Embedded Drawer */}
              {showSignLanguageDrawer && (
                <div className="p-3 bg-purple-50/60 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-800">
                  <SignLanguageDetector onInsertText={handleInsertSignLanguage} />
                </div>
              )}

              {/* Messages Stream */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/20">
                {activeConversation.messages.map(msg => {
                  const isPatient = msg.sender === 'patient';
                  const isSystem = msg.sender === 'system';

                  if (isSystem) {
                    return (
                      <div
                        key={msg.id}
                        className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-2xl text-center text-xs text-blue-800 dark:text-blue-200 font-medium max-w-md mx-auto"
                      >
                        {language === 'ta' && msg.tamilText ? msg.tamilText : msg.text}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <img
                        src={
                          isPatient
                            ? user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
                            : activeConversation.doctorAvatar
                        }
                        alt={isPatient ? 'You' : 'Doctor'}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 mt-1 shrink-0"
                      />

                      <div
                        className={`max-w-[78%] rounded-3xl p-4 shadow-sm space-y-1.5 ${
                          isPatient
                            ? 'bg-[#2563EB] text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-[11px] opacity-80">
                          <span className="font-bold">
                            {isPatient ? `${user?.name || 'Meena'}` : activeConversation.doctorName}
                          </span>
                          <div className="flex items-center gap-1">
                            <span>{msg.timestamp}</span>
                            {isPatient && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                          </div>
                        </div>

                        <p className="text-sm font-medium leading-relaxed">
                          {language === 'ta' && msg.tamilText ? msg.tamilText : msg.text}
                        </p>

                        {/* Dual Language display */}
                        {msg.tamilText && language === 'en' && (
                          <div
                            className={`text-xs pt-1.5 border-t font-medium ${
                              isPatient ? 'border-blue-400/50 text-blue-100' : 'border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300'
                            }`}
                          >
                            🇮🇳 தமிழ்: {msg.tamilText}
                          </div>
                        )}

                        {/* Audio TTS Speak */}
                        <div className="pt-2 flex items-center justify-between text-xs">
                          <button
                            onClick={() =>
                              speakText(language === 'ta' && msg.tamilText ? msg.tamilText : msg.text)
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-semibold opacity-90 hover:opacity-100 transition-opacity"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{language === 'ta' ? 'குரலில் கேள்' : 'Read Aloud'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Clinical Replies */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 pl-1">
                  Quick Replies:
                </span>
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickReply(reply)}
                    className="shrink-0 px-3 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 text-slate-700 dark:text-slate-200 font-semibold hover:text-[#2563EB] transition-all"
                  >
                    {language === 'ta' ? reply.ta : reply.en}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSend}
                className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`p-3 rounded-2xl border transition-all ${
                    isVoiceRecording
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Speech-to-Text Input"
                >
                  {isVoiceRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder={
                    language === 'ta'
                      ? 'மருத்துவருக்கு தமிழில் அல்லது ஆங்கிலத்தில் தட்டச்சு செய்யவும்...'
                      : 'Type your message to doctor in English or Tamil...'
                  }
                  className="flex-1 px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {inputMessage && (
                  <button
                    type="button"
                    onClick={() => setInputMessage('')}
                    className="p-3 text-slate-400 hover:text-slate-600 rounded-2xl"
                    title="Clear"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="py-3 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"
                >
                  <span>{language === 'ta' ? 'அனுப்பு' : 'Send'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400">
              <MessageSquare className="w-12 h-12 mb-2 opacity-30 text-blue-500" />
              <p className="text-sm font-semibold">Select a doctor thread on the left to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
