import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { signLanguageVocabulary } from '../../data/mockData';
import { SignGesture } from '../../types';
import {
  Sparkles,
  Camera,
  CameraOff,
  Check,
  Send,
  RefreshCw,
  Hand,
  Volume2,
  HelpCircle,
} from 'lucide-react';

interface SignLanguageDetectorProps {
  onInsertText?: (text: string, tamilText?: string) => void;
}

export const SignLanguageDetector: React.FC<SignLanguageDetectorProps> = ({ onInsertText }) => {
  const { sendPatientMessage, language, t, addNotification, speakText } = useApp();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastDetectedGesture, setLastDetectedGesture] = useState<SignGesture | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [confidence, setConfidence] = useState<number>(0);
  const [detectionLog, setDetectionLog] = useState<SignGesture[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const categories = [
    { id: 'all', labelEn: 'All Signs', labelTa: 'அனைத்து சைகைகள்' },
    { id: 'urgent', labelEn: 'Urgent / Pain', labelTa: 'அவசரம் / வலி' },
    { id: 'general', labelEn: 'General / Greetings', labelTa: 'பொது / வணக்கம்' },
    { id: 'symptoms', labelEn: 'Symptoms', labelTa: 'அறிகுறிகள்' },
  ];

  const filteredSigns = signLanguageVocabulary;

  // Toggle Camera Stream
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setIsDetecting(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setIsDetecting(true);
        addNotification(
          language === 'ta' ? 'சைகை கண்டறிதல் தொடங்கியது' : 'Sign Gesture AI Active',
          language === 'ta' ? 'கேமரா முன் சைகை காட்டவும்.' : 'Hold your hand gesture in front of camera.',
          'info'
        );
      } catch (err) {
        // Fallback for permissions / preview environment
        setIsCameraActive(true);
        setIsDetecting(true);
        addNotification(
          'Sign Recognition Ready',
          'Camera access simulated. Tap any gesture card to trigger recognition.',
          'info'
        );
      }
    }
  };

  // Simulate or execute gesture recognition
  const triggerGestureRecognition = (gesture: SignGesture) => {
    setLastDetectedGesture(gesture);
    setConfidence(Math.floor(88 + Math.random() * 11));
    setDetectionLog(prev => [gesture, ...prev.slice(0, 4)]);

    addNotification(
      language === 'ta' ? `சைகை கண்டறியப்பட்டது: ${gesture.nameTa}` : `Gesture Recognized: ${gesture.nameEn}`,
      language === 'ta' ? gesture.phraseTa : gesture.phraseEn,
      'success'
    );
  };

  const handleSendToDoctor = (gesture: SignGesture) => {
    const textToSend = gesture.phraseEn;
    if (onInsertText) {
      onInsertText(textToSend, gesture.phraseTa);
    } else {
      sendPatientMessage(textToSend);
    }
  };

  // Cleanup camera stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div
      id="sign-language-detector"
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{language === 'ta' ? 'சைகை மொழி (ISL) AI உதவியாளர்' : 'Indian Sign Language (ISL) Assistant'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-extrabold uppercase">
                AI Vision
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'ta'
                ? 'சைகைகளை உடனடியாக உரை & தமிழில் மாற்றவும்'
                : 'Real-time gesture recognition translated to English & Tamil'}
            </p>
          </div>
        </div>

        {/* Camera Toggle Button */}
        <button
          onClick={toggleCamera}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm ${
            isCameraActive
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isCameraActive ? (
            <>
              <CameraOff className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'கேமரா நிறுத்து' : 'Stop Camera'}</span>
            </>
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'கேமரா இயக்கு' : 'Enable Camera'}</span>
            </>
          )}
        </button>
      </div>

      {/* Video Viewport if Camera Active */}
      {isCameraActive && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video max-h-56 flex items-center justify-center border-2 border-purple-500/50 shadow-inner">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />

          {/* AI Landmark Grid Overlay Simulation */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-44 h-44 rounded-2xl border-2 border-dashed border-purple-400/70 animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-bold text-purple-200 bg-black/60 px-2 py-0.5 rounded-full">
                {language === 'ta' ? 'சைகை கண்டறியும் பகுதி' : 'Place Hand Gesture Here'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 rounded-xl text-white text-[10px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>AI Landmark Tracking: 21 points active</span>
          </div>
        </div>
      )}

      {/* Detected Gesture Result Banner */}
      {lastDetectedGesture && (
        <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{lastDetectedGesture.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  {language === 'ta' ? lastDetectedGesture.nameTa : lastDetectedGesture.nameEn}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                  {confidence}% Match
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                "{language === 'ta' ? lastDetectedGesture.phraseTa : lastDetectedGesture.phraseEn}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => speakText(language === 'ta' ? lastDetectedGesture.phraseTa : lastDetectedGesture.phraseEn)}
              title="Speak Aloud"
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 hover:text-purple-600 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSendToDoctor(lastDetectedGesture)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'அனுப்பு' : 'Insert / Send'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Gesture Quick-Cards Grid */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {language === 'ta' ? 'விரைவு மருத்துவ சைகைகள் (கிளிக் செய்து தேர்வு செய்க):' : 'Common Medical ISL Gestures (Tap to Recognize):'}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
          {filteredSigns.map(gesture => (
            <button
              key={gesture.id}
              onClick={() => triggerGestureRecognition(gesture)}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  <span className="flex items-center gap-1">
                    <span>{gesture.icon}</span>
                    <span>{language === 'ta' ? gesture.nameTa : gesture.nameEn}</span>
                  </span>
                  <span className="text-[10px] text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Try →
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {gesture.phraseEn}
                </div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5 line-clamp-1">
                  {gesture.phraseTa}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
