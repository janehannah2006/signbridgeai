import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { SpeechRecognitionService } from '../../services/aiService';
import { SignLanguageDetector } from './SignLanguageDetector';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  CheckCheck,
  User,
  MessageSquare,
  Sparkles,
  Hand,
} from 'lucide-react';

export const MessagePanel: React.FC = () => {
  const {
    activeConsultation,
    sendPatientMessage,
    speakText,
    user,
    language,
    addNotification,
    t,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [showSignLanguageDrawer, setShowSignLanguageDrawer] = useState(false);
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

  const quickReplies = [
    t('quickYes'),
    t('quickRepeat'),
    t('quickPain'),
    t('quickAllergy'),
    t('quickDosage'),
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    await sendPatientMessage(inputMessage.trim(), false);
    setInputMessage('');
  };

  const handleQuickReply = async (reply: string) => {
    await sendPatientMessage(reply, false);
  };

  const handleInsertSignLanguage = (text: string) => {
    setInputMessage(prev => (prev ? `${prev} ${text}` : text));
    setShowSignLanguageDrawer(false);
  };

  const handleVoiceInput = () => {
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
        const sampleVoice = language === 'ta'
          ? "எனக்கு காலை உணவுக்குப் பிறகு லேசான தலைசுற்றல் ஏற்படுகிறது."
          : "I have been experiencing mild dizziness after breakfast.";
        setInputMessage((prev) => (prev ? `${prev} ${sampleVoice}` : sampleVoice));
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
        setInputMessage((prev) => (isFinal ? (prev ? `${prev} ${text}` : text) : text));
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
    <div className="flex flex-col h-full bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-b border-[#E2E8F0] dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#2563EB]" />
          <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            {t('tabMessages')}
          </span>
        </div>
        
        <button
          onClick={() => setShowSignLanguageDrawer(!showSignLanguageDrawer)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            showSignLanguageDrawer
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>ISL Sign</span>
        </button>
      </div>

      {/* Sign Language Embedded Drawer */}
      {showSignLanguageDrawer && (
        <div className="p-3 bg-purple-50/70 dark:bg-purple-950/40 border-b border-purple-200 dark:border-purple-800">
          <SignLanguageDetector onInsertText={handleInsertSignLanguage} />
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[360px]">
        {activeConsultation.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-sm">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50 text-[#2563EB]" />
            <p className="font-medium text-slate-700 dark:text-slate-300">
              No chat messages sent yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Type, speak, or use sign gestures to communicate with your doctor.
            </p>
          </div>
        ) : (
          activeConsultation.messages.map((msg) => {
            const isPatient = msg.sender === 'patient';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div
                  key={msg.id}
                  className="p-2.5 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl text-center text-xs text-blue-800 dark:text-blue-200 font-medium"
                >
                  {language === 'ta' && msg.tamilText ? msg.tamilText : msg.text}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isPatient ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden mt-1 shadow-xs">
                  <img
                    src={
                      isPatient
                        ? user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100'
                        : activeConsultation.doctor.avatar
                    }
                    alt={isPatient ? 'You' : 'Doctor'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm ${
                    isPatient
                      ? 'bg-[#2563EB] text-white rounded-tr-none shadow-md shadow-blue-500/10'
                      : 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-tl-none border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[11px] mb-1 opacity-80">
                    <span className="font-bold">{isPatient ? 'You (Meena)' : activeConsultation.doctor.name}</span>
                    <div className="flex items-center gap-1">
                      <span>{msg.timestamp}</span>
                      {isPatient && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>

                  <p className="leading-relaxed font-medium">
                    {language === 'ta' && msg.tamilText ? msg.tamilText : msg.text}
                  </p>

                  {/* Bilingual translation under doctor message */}
                  {msg.tamilText && language === 'en' && !isPatient && (
                    <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700 text-xs text-teal-700 dark:text-teal-300 font-medium">
                      [தமிழ்]: {msg.tamilText}
                    </div>
                  )}

                  {/* Text-to-speech button */}
                  <button
                    onClick={() => speakText(language === 'ta' && msg.tamilText ? msg.tamilText : msg.text)}
                    className="mt-2 flex items-center gap-1 text-[11px] opacity-80 hover:opacity-100 transition-opacity"
                    title={t('textToSpeech')}
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{t('textToSpeech')}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Replies Tray */}
      <div className="p-2.5 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm border-t border-[#E2E8F0] dark:border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex-shrink-0 pl-1">
          Quick:
        </span>
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickReply(reply)}
            className="flex-shrink-0 px-3 py-1.5 text-xs bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700 rounded-xl hover:border-blue-400 text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB] transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-[#E2E8F0] dark:border-slate-800/80 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-xl border transition-all ${
            isVoiceRecording
              ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
          title={t('voiceInput')}
        >
          {isVoiceRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t('typeMessage')}
          className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!inputMessage.trim()}
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          {t('send')}
        </Button>
      </form>
    </div>
  );
};
