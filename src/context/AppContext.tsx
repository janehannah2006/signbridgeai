import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  User,
  Doctor,
  Consultation,
  TranscriptRecord,
  MedicalInstruction,
  CaptionItem,
  ChatMessage,
  AccessibilitySettings,
  LanguageCode,
  ConsultationStatus,
  NotificationItem,
  InstructionStatus,
  DoctorConversation,
  EmergencyAlert,
} from '../types';
import {
  mockUser,
  mockDoctors,
  initialConsultations,
  initialTranscripts,
  initialInstructions,
  initialDoctorConversations,
  demoConsultationSequence,
} from '../data/mockData';
import { translations, getTranslation } from '../i18n/translations';
import { processTranscript, translateText, chatWithAiDoctor } from '../services/aiService';
import { ttsService } from '../services/ttsService';

interface ActiveConsultationState {
  id: string;
  status: ConsultationStatus;
  doctor: Doctor;
  reason?: string;
  language?: string;
  commPreference?: string;
  timer: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isListening: boolean;
  captions: CaptionItem[];
  currentLiveCaption: CaptionItem | null;
  messages: ChatMessage[];
  instructions: MedicalInstruction[];
  isDemoSimulation: boolean;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  language: LanguageCode;
  t: (key: keyof typeof translations['en']) => string;
  setLanguage: (lang: LanguageCode) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  resetAccessibility: () => void;
  consultations: Consultation[];
  transcripts: TranscriptRecord[];
  instructions: MedicalInstruction[];
  activeConsultation: ActiveConsultationState;
  notifications: NotificationItem[];
  doctorConversations: DoctorConversation[];
  activeConversationDoctorId: string;
  setActiveConversationDoctorId: (id: string) => void;
  emergencyAlerts: EmergencyAlert[];
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isStartConsultationModalOpen: boolean;
  setIsStartConsultationModalOpen: (open: boolean) => void;
  isAccessibilityPanelOpen: boolean;
  setIsAccessibilityPanelOpen: (open: boolean) => void;
  isEndModalOpen: boolean;
  setIsEndModalOpen: (open: boolean) => void;
  deleteTranscriptModal: { open: boolean; transcriptId?: string };
  setDeleteTranscriptModal: (state: { open: boolean; transcriptId?: string }) => void;
  profileCompletionPercentage: number;
  unreadMessagesCount: number;

  // Actions
  login: (asDemo?: boolean) => void;
  logout: () => void;
  updateUserProfile: (partial: Partial<User>) => void;
  startConsultation: (doctor?: Doctor, asDemo?: boolean) => void;
  startNewConsultationSession: (options: {
    doctor: Doctor;
    reason: string;
    language: LanguageCode;
    commPreference: string;
  }) => void;
  pauseConsultation: () => void;
  resumeConsultation: () => void;
  endConsultation: (saveRecord?: boolean) => void;
  sendPatientMessage: (text: string, isVoice?: boolean) => Promise<void>;
  sendDoctorMessage: (doctorId: string, text: string, isVoice?: boolean) => Promise<void>;
  sendPreparedMessageToConsultation: (text: string, tamilText?: string) => Promise<void>;
  markConversationAsRead: (doctorId: string) => void;
  triggerEmergencyAlert: (symptom: string, location?: string) => void;
  addDoctorCaption: (text: string, isFinal?: boolean) => Promise<void>;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleListening: () => void;
  clearActiveCaptions: () => void;
  clearActiveMessages: () => void;
  deleteTranscript: (id: string) => void;
  deleteInstruction: (id: string) => void;
  addCustomInstruction: (instruction: Omit<MedicalInstruction, 'id' | 'timestamp' | 'date'>) => void;
  updateInstructionStatus: (id: string, status: InstructionStatus) => void;
  downloadTranscriptFile: (transcript: TranscriptRecord) => void;
  clearAllLocalData: () => void;
  reseedSampleData: () => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;
  speakText: (text: string) => void;
}

const defaultAccessibility: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false,
  extraLargeButtons: false,
  simplifiedInterface: false,
  captionSize: 'large',
  captionPosition: 'bottom',
  autoScroll: true,
  autoTranslate: true,
  speakerId: true,
  confidenceDisplay: true,
  ttsEnabled: true,
  ttsSpeed: 1.0,
  ttsVolume: 1.0,
  notificationsEnabled: true,
  saveTranscripts: true,
};

const initialActiveConsultation: ActiveConsultationState = {
  id: 'cons-current',
  status: 'idle',
  doctor: mockDoctors[0],
  timer: 0,
  isMuted: false,
  isCameraOff: false,
  isListening: false,
  captions: [],
  currentLiveCaption: null,
  messages: [],
  instructions: [],
  isDemoSimulation: false,
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'signbridge_user_v1',
  LANG: 'signbridge_lang_v1',
  A11Y: 'signbridge_a11y_v1',
  CONSULTATIONS: 'signbridge_consultations_v1',
  TRANSCRIPTS: 'signbridge_transcripts_v1',
  INSTRUCTIONS: 'signbridge_instructions_v1',
  ACTIVE_CONSULTATION: 'signbridge_active_consultation_v1',
  CONVERSATIONS: 'signbridge_conversations_v1',
  EMERGENCY: 'signbridge_emergency_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : mockUser;
    } catch {
      return mockUser;
    }
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG) as LanguageCode;
    return saved === 'ta' ? 'ta' : 'en';
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.A11Y);
      return saved ? { ...defaultAccessibility, ...JSON.parse(saved) } : defaultAccessibility;
    } catch {
      return defaultAccessibility;
    }
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      return saved ? JSON.parse(saved) : initialConsultations;
    } catch {
      return initialConsultations;
    }
  });

  const [transcripts, setTranscripts] = useState<TranscriptRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS);
      return saved ? JSON.parse(saved) : initialTranscripts;
    } catch {
      return initialTranscripts;
    }
  });

  const [instructions, setInstructions] = useState<MedicalInstruction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTRUCTIONS);
      return saved ? JSON.parse(saved) : initialInstructions;
    } catch {
      return initialInstructions;
    }
  });

  const [doctorConversations, setDoctorConversations] = useState<DoctorConversation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return saved ? JSON.parse(saved) : initialDoctorConversations;
    } catch {
      return initialDoctorConversations;
    }
  });

  const [activeConversationDoctorId, setActiveConversationDoctorId] = useState<string>('doc-kumar');

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMERGENCY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isStartConsultationModalOpen, setIsStartConsultationModalOpen] = useState(false);

  const [activeConsultation, setActiveConsultation] = useState<ActiveConsultationState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CONSULTATION);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialActiveConsultation,
          ...parsed,
          status: parsed.status === 'connecting' ? 'active' : parsed.status,
        };
      }
    } catch {
      // ignore
    }
    return initialActiveConsultation;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [deleteTranscriptModal, setDeleteTranscriptModal] = useState<{ open: boolean; transcriptId?: string }>({
    open: false,
  });

  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const simulationStepRef = useRef(0);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.A11Y, JSON.stringify(accessibility));
  }, [accessibility]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(transcripts));
  }, [transcripts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTIONS, JSON.stringify(instructions));
  }, [instructions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(doctorConversations));
  }, [doctorConversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(emergencyAlerts));
  }, [emergencyAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONSULTATION, JSON.stringify(activeConsultation));
  }, [activeConsultation]);

  // Profile completion score calculator
  const profileCompletionPercentage = React.useMemo(() => {
    if (!user) return 0;
    let score = 0;
    if (user.name) score += 15;
    if (user.age && user.gender) score += 15;
    if (user.medicalProfile?.bloodGroup) score += 15;
    if (user.medicalProfile?.allergies && user.medicalProfile.allergies.length > 0) score += 15;
    if (user.medicalProfile?.currentMedications && user.medicalProfile.currentMedications.length > 0) score += 15;
    if (user.medicalProfile?.chronicConditions && user.medicalProfile.chronicConditions.length > 0) score += 10;
    if (user.medicalProfile?.emergencyContact?.name && user.medicalProfile?.emergencyContact?.phone) score += 15;
    return Math.min(100, score);
  }, [user]);

  // Unread messages count across threads
  const unreadMessagesCount = React.useMemo(() => {
    return doctorConversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
  }, [doctorConversations]);

  // Accessibility class applicator on document element
  useEffect(() => {
    const root = document.documentElement;

    // High Contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    // Font size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
    root.classList.add(`text-size-${accessibility.fontSize}`);

    // Extra large buttons
    if (accessibility.extraLargeButtons) {
      root.classList.add('extra-large-buttons');
    } else {
      root.classList.remove('extra-large-buttons');
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [accessibility]);

  // Active consultation timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeConsultation.status === 'active') {
      interval = setInterval(() => {
        setActiveConsultation(prev => ({
          ...prev,
          timer: prev.timer + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeConsultation.status]);

  // Translation helper
  const t = useCallback(
    (key: keyof typeof translations['en']) => {
      return getTranslation(language, key);
    },
    [language]
  );

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  const updateAccessibility = (partial: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...partial }));
  };

  const resetAccessibility = () => {
    setAccessibility(defaultAccessibility);
  };

  const updateUserProfile = (partial: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...partial } : null));
    addNotification(
      language === 'ta' ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது' : 'Profile Updated',
      language === 'ta' ? 'மருத்துவ விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன.' : 'Patient medical profile updated successfully.',
      'success'
    );
  };

  const addNotification = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    if (!accessibility.notificationsEnabled) return;
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 4)]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4000);
  }, [accessibility.notificationsEnabled]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const speakText = useCallback((text: string) => {
    if (accessibility.ttsEnabled) {
      ttsService.speak(text, language, accessibility.ttsSpeed, accessibility.ttsVolume);
    }
  }, [accessibility.ttsEnabled, accessibility.ttsSpeed, accessibility.ttsVolume, language]);

  // Process and add Doctor Caption
  const addDoctorCaption = useCallback(async (text: string, isFinal = true) => {
    const analysis = await processTranscript(text);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCaption: CaptionItem = {
      id: `cap-${Date.now()}`,
      speaker: 'doctor',
      text,
      tamilText: analysis.tamilText,
      timestamp: timeStr,
      confidence: analysis.confidence,
      isUnclear: analysis.isUnclear,
      warning: analysis.warning,
      category: analysis.category,
    };

    if (isFinal) {
      setActiveConsultation(prev => {
        const nextCaptions = [...prev.captions, newCaption];
        let nextInstructions = [...prev.instructions];

        if (analysis.extractedInstruction) {
          const newInstruction: MedicalInstruction = {
            id: `ins-live-${Date.now()}`,
            consultationId: prev.id,
            doctorName: prev.doctor.name,
            category: analysis.extractedInstruction.category,
            text: analysis.extractedInstruction.text,
            tamilText: analysis.extractedInstruction.tamilText,
            status: analysis.extractedInstruction.status,
            confidence: analysis.extractedInstruction.confidence,
            timestamp: timeStr,
            date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          };
          nextInstructions = [newInstruction, ...nextInstructions];
          setInstructions(all => [newInstruction, ...all]);

          addNotification(
            language === 'ta' ? 'புதிய மருத்துவ அறிவுரை' : 'New Medical Instruction',
            analysis.extractedInstruction.text,
            'success'
          );
        }

        if (analysis.isUnclear) {
          addNotification(
            language === 'ta' ? 'தெளிவற்ற பேச்சு எச்சரிக்கை' : 'Speech Warning',
            analysis.warning || 'Some speech was unclear. Please confirm with your doctor.',
            'warning'
          );
        }

        return {
          ...prev,
          captions: nextCaptions,
          currentLiveCaption: newCaption,
          instructions: nextInstructions,
        };
      });
    } else {
      setActiveConsultation(prev => ({
        ...prev,
        currentLiveCaption: newCaption,
      }));
    }
  }, [addNotification, language]);

  // Demo Simulation runner
  const startNextDemoStep = useCallback(() => {
    if (simulationStepRef.current >= demoConsultationSequence.length) {
      return;
    }

    const step = demoConsultationSequence[simulationStepRef.current];
    simulationStepRef.current += 1;

    simulationTimeoutRef.current = setTimeout(async () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newCap: CaptionItem = {
        id: `demo-cap-${Date.now()}`,
        speaker: step.speaker,
        text: step.text,
        tamilText: step.tamilText,
        timestamp: timeStr,
        confidence: step.confidence,
        isUnclear: step.isUnclear,
        warning: step.isUnclear ? 'Some of this statement was unclear. Please confirm with your doctor.' : undefined,
        category: step.instruction?.category,
      };

      setActiveConsultation(prev => {
        let updatedInstructions = [...prev.instructions];
        if (step.instruction) {
          const newIns: MedicalInstruction = {
            id: `demo-ins-${Date.now()}`,
            consultationId: prev.id,
            doctorName: prev.doctor.name,
            category: step.instruction.category,
            text: step.instruction.text,
            tamilText: step.instruction.tamilText,
            status: step.instruction.status,
            confidence: step.instruction.confidence,
            timestamp: timeStr,
            date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          };
          updatedInstructions = [newIns, ...updatedInstructions];
          setInstructions(all => [newIns, ...all]);

          addNotification(
            language === 'ta' ? 'புதிய மருத்துவ அறிவுரை கண்டறியப்பட்டது' : 'New Instruction Logged',
            step.instruction.text,
            'success'
          );
        }

        if (step.isUnclear) {
          addNotification(
            language === 'ta' ? 'தெளிவற்ற பேச்சு கண்டறியப்பட்டது' : 'Unclear Speech Warning',
            'Some of this statement was unclear. Please confirm with your doctor.',
            'warning'
          );
        }

        return {
          ...prev,
          captions: [...prev.captions, newCap],
          currentLiveCaption: newCap,
          instructions: updatedInstructions,
        };
      });

      // Continue to next utterance
      startNextDemoStep();
    }, step.delayMs);
  }, [addNotification, language]);

  // Start Consultation
  const startConsultation = useCallback((doctor = mockDoctors[0], asDemo = true) => {
    // Clear any previous simulation timers
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    simulationStepRef.current = 0;

    const consultationId = `cons-${Date.now()}`;

    // Initial connecting state
    setActiveConsultation({
      id: consultationId,
      status: 'connecting',
      doctor,
      timer: 0,
      isMuted: false,
      isCameraOff: false,
      isListening: true,
      captions: [],
      currentLiveCaption: null,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'system',
          text: `Secure consultation session initiated with ${doctor.name}. SignBridge AI real-time captions and instructions logger is active.`,
          tamilText: `${doctor.name} அவர்களுடனான பாதுகாப்பான மருத்துவ அமர்வு தொடங்கியது. நேரடி வசனங்கள் செயலில் உள்ளன.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        },
      ],
      instructions: [],
      isDemoSimulation: asDemo,
    });

    addNotification(
      language === 'ta' ? 'இணைப்பு தொடங்குகிறது' : 'Connecting',
      language === 'ta' ? `${doctor.name} அவர்களுடன் இணைகிறது...` : `Connecting with ${doctor.name}...`,
      'info'
    );

    // Transition to Active after 1.2 seconds
    setTimeout(() => {
      setActiveConsultation(prev => ({
        ...prev,
        status: 'active',
      }));

      addNotification(
        language === 'ta' ? 'ஆலோசனை தொடங்கியது' : 'Consultation Active',
        language === 'ta' ? 'நேரடி வசனங்கள் செயலில் உள்ளன.' : 'Live captions and AI instruction logging active.',
        'success'
      );

      if (asDemo) {
        startNextDemoStep();
      }
    }, 1200);
  }, [addNotification, language, startNextDemoStep]);

  const pauseConsultation = () => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    setActiveConsultation(prev => ({ ...prev, status: 'paused' }));
    addNotification(
      language === 'ta' ? 'இடைநிறுத்தப்பட்டது' : 'Paused',
      language === 'ta' ? 'ஆலோசனை இடைநிறுத்தப்பட்டது.' : 'Consultation paused.',
      'info'
    );
  };

  const resumeConsultation = () => {
    setActiveConsultation(prev => ({ ...prev, status: 'active' }));
    if (activeConsultation.isDemoSimulation) {
      startNextDemoStep();
    }
    addNotification(
      language === 'ta' ? 'தொடர்கிறது' : 'Resumed',
      language === 'ta' ? 'ஆலோசனை மீண்டும் தொடர்கிறது.' : 'Consultation resumed.',
      'success'
    );
  };

  const endConsultation = (saveRecord = true) => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }

    const { id, doctor, timer, captions, messages, instructions: currentInstructions } = activeConsultation;

    if (saveRecord && (captions.length > 0 || messages.length > 0)) {
      const durationMins = Math.max(1, Math.ceil(timer / 60));
      const durationStr = `${durationMins} minute${durationMins > 1 ? 's' : ''}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      // Save consultation summary
      const newConsultation: Consultation = {
        id,
        doctor,
        date: dateStr,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: durationStr,
        language: language === 'ta' ? 'Tamil' : 'English',
        status: 'completed',
        transcriptCount: captions.length + messages.length,
        instructionCount: currentInstructions.length,
        notes: `Automated summary: ${currentInstructions.length} instruction(s) detected.`,
      };

      // Save full transcript
      const newTranscript: TranscriptRecord = {
        id: `tr-${Date.now()}`,
        consultationId: id,
        doctorName: doctor.name,
        doctorSpecialization: doctor.specialization,
        date: dateStr,
        duration: durationStr,
        language: language === 'ta' ? 'Tamil' : 'English',
        messages: [
          ...captions.map((c, idx) => ({
            id: `msg-cap-${idx}`,
            speaker: c.speaker,
            text: c.text,
            tamilText: c.tamilText,
            time: c.timestamp,
          })),
          ...messages.filter(m => m.sender !== 'system').map(m => ({
            id: m.id,
            speaker: m.sender,
            text: m.text,
            tamilText: m.tamilText,
            time: m.timestamp,
          })),
        ],
        instructions: currentInstructions,
      };

      setConsultations(prev => [newConsultation, ...prev]);
      setTranscripts(prev => [newTranscript, ...prev]);
      setInstructions(prev => [...currentInstructions, ...prev]);

      addNotification(
        language === 'ta' ? 'பதிவு சேமிக்கப்பட்டது' : 'Transcript Saved',
        language === 'ta' ? 'ஆலோசனை பதிவும் அறிவுரைகளும் வெற்றிகரமாக சேமிக்கப்பட்டன.' : 'Consultation transcript and key instructions saved.',
        'success'
      );
    }

    setActiveConsultation({
      ...initialActiveConsultation,
      status: 'ended',
    });
    setIsEndModalOpen(false);
  };

  // Patient sending a message
  const sendPatientMessage = async (text: string, isVoice = false) => {
    if (!text.trim()) return;

    const tamilText = await translateText(text, 'ta');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text: text.trim(),
      tamilText,
      timestamp: timeStr,
      isRead: true,
      isVoiceInput: isVoice,
    };

    // Optimistically update message state
    setActiveConsultation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    addNotification(
      language === 'ta' ? 'செய்தி அனுப்பப்பட்டது' : 'Message Sent',
      language === 'ta' ? 'மருத்துவருக்கு செய்தி சென்றடைந்தது.' : 'Delivered to doctor.',
      'info'
    );

    // Speak patient message if TTS is active
    if (accessibility.ttsEnabled) {
      speakText(text);
    }

    // Call AI Doctor for clinical reply
    try {
      const historyContext = activeConsultation.messages.map(m => ({
        sender: m.sender,
        text: m.text,
      }));

      const aiResponse = await chatWithAiDoctor(
        text,
        language,
        historyContext,
        user?.medicalProfile || null
      );

      setTimeout(() => {
        const doctorReplyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const doctorMsg: ChatMessage = {
          id: `msg-doc-${Date.now()}`,
          sender: 'doctor',
          text: aiResponse.replyEn,
          tamilText: aiResponse.replyTa,
          timestamp: doctorReplyTime,
          isRead: true,
        };

        setActiveConsultation(prev => {
          let updatedInstructions = [...prev.instructions];

          if (aiResponse.extractedInstruction) {
            const newIns: MedicalInstruction = {
              id: `ins-chat-${Date.now()}`,
              consultationId: prev.id,
              doctorName: prev.doctor.name,
              category: aiResponse.extractedInstruction.category,
              text: aiResponse.extractedInstruction.text,
              tamilText: aiResponse.extractedInstruction.tamilText,
              status: aiResponse.extractedInstruction.status,
              confidence: aiResponse.extractedInstruction.confidence,
              timestamp: doctorReplyTime,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            };
            updatedInstructions = [newIns, ...updatedInstructions];
            setInstructions(all => [newIns, ...all]);

            addNotification(
              language === 'ta' ? 'புதிய மருத்துவ அறிவுரை' : 'Medical Instruction',
              aiResponse.extractedInstruction.text,
              'success'
            );
          }

          if (aiResponse.isEmergency) {
            addNotification(
              language === 'ta' ? 'அவசர எச்சரிக்கை' : 'Emergency Alert',
              language === 'ta' ? 'அவசர மருத்துவ உதவியை நாடவும் (108 / அவசர சிகிச்சை).' : 'Please seek emergency care immediately (Call 108 / ER).',
              'error'
            );
          }

          return {
            ...prev,
            messages: [...prev.messages, doctorMsg],
            instructions: updatedInstructions,
          };
        });

        // Optionally speak out the doctor reply
        if (accessibility.ttsEnabled) {
          const speakContent = language === 'ta' ? aiResponse.replyTa : aiResponse.replyEn;
          speakText(speakContent);
        }
      }, 1000);
    } catch (err) {
      console.warn("Doctor chat reply error:", err);
    }
  };

  const toggleMute = () => {
    setActiveConsultation(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
    addNotification(
      activeConsultation.isMuted ? 'Unmuted' : 'Muted',
      activeConsultation.isMuted ? 'Microphone is on.' : 'Microphone is muted.',
      'info'
    );
  };

  const toggleCamera = () => {
    setActiveConsultation(prev => ({
      ...prev,
      isCameraOff: !prev.isCameraOff,
    }));
  };

  const toggleListening = () => {
    setActiveConsultation(prev => ({
      ...prev,
      isListening: !prev.isListening,
    }));
  };

  const clearActiveCaptions = () => {
    setActiveConsultation(prev => ({
      ...prev,
      captions: [],
      currentLiveCaption: null,
    }));
    addNotification('Captions Cleared', 'Active captions display was reset.', 'info');
  };

  const clearActiveMessages = () => {
    setActiveConsultation(prev => ({
      ...prev,
      messages: [],
    }));
  };

  const deleteTranscript = (id: string) => {
    setTranscripts(prev => prev.filter(t => t.id !== id));
    setConsultations(prev => prev.filter(c => c.id !== id));
    setDeleteTranscriptModal({ open: false });
    addNotification(
      language === 'ta' ? 'பதிவு நீக்கப்பட்டது' : 'Transcript Deleted',
      language === 'ta' ? 'பதிவு நிரந்தரமாக நீக்கப்பட்டது.' : 'Transcript permanently deleted.',
      'info'
    );
  };

  const deleteInstruction = (id: string) => {
    setInstructions(prev => prev.filter(i => i.id !== id));
    addNotification(
      language === 'ta' ? 'அறிவுரை நீக்கப்பட்டது' : 'Instruction Removed',
      language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட அறிவுரை நீக்கப்பட்டது.' : 'Instruction removed from records.',
      'info'
    );
  };

  const addCustomInstruction = (insData: Omit<MedicalInstruction, 'id' | 'timestamp' | 'date'>) => {
    const now = new Date();
    const newIns: MedicalInstruction = {
      ...insData,
      id: `ins-manual-${Date.now()}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setInstructions(prev => [newIns, ...prev]);
    setActiveConsultation(prev => ({
      ...prev,
      instructions: [newIns, ...prev.instructions],
    }));

    addNotification(
      language === 'ta' ? 'அறிவுரை சேர்க்கப்பட்டது' : 'Instruction Added',
      insData.text,
      'success'
    );
  };

  const updateInstructionStatus = (id: string, status: InstructionStatus) => {
    setInstructions(prev =>
      prev.map(ins => (ins.id === id ? { ...ins, status } : ins))
    );
    setActiveConsultation(prev => ({
      ...prev,
      instructions: prev.instructions.map(ins => (ins.id === id ? { ...ins, status } : ins)),
    }));
    addNotification(
      language === 'ta' ? 'நிலை மாற்றப்பட்டது' : 'Status Updated',
      status === 'confirmed' ? 'Instruction marked as confirmed' : 'Instruction marked as needs confirmation',
      'info'
    );
  };

  const downloadTranscriptFile = (transcript: TranscriptRecord) => {
    const lines = [
      `========================================================================`,
      `SIGNBRIDGE AI — ACCESSIBLE MEDICAL CONSULTATION TRANSCRIPT`,
      `========================================================================`,
      `Patient Name   : ${user?.name || 'Meena Krishnan'}`,
      `Doctor Name    : ${transcript.doctorName} (${transcript.doctorSpecialization})`,
      `Date & Time    : ${transcript.date} | Duration: ${transcript.duration}`,
      `Language       : ${transcript.language}`,
      `========================================================================`,
      ``,
      `[1] KEY EXTRACTED MEDICAL INSTRUCTIONS:`,
      `------------------------------------------------------------------------`,
    ];

    if (transcript.instructions.length === 0) {
      lines.push(`(No medical instructions logged for this session)`);
    } else {
      transcript.instructions.forEach((ins, idx) => {
        lines.push(`${idx + 1}. [${ins.category.toUpperCase()}] ${ins.text}`);
        if (ins.tamilText) {
          lines.push(`   Tamil Translation: ${ins.tamilText}`);
        }
        lines.push(`   Status: ${ins.status} | Confidence: ${Math.round(ins.confidence * 100)}%`);
        lines.push(``);
      });
    }

    lines.push(``);
    lines.push(`[2] FULL CONVERSATION RECORD:`);
    lines.push(`------------------------------------------------------------------------`);
    transcript.messages.forEach(msg => {
      const speakerLabel = msg.speaker === 'doctor' ? `Doctor (${transcript.doctorName})` : msg.speaker === 'patient' ? `Patient (${user?.name || 'Meena'})` : `System`;
      lines.push(`[${msg.time}] ${speakerLabel}:`);
      lines.push(`  EN: ${msg.text}`);
      if (msg.tamilText) {
        lines.push(`  TA: ${msg.tamilText}`);
      }
      lines.push(``);
    });

    lines.push(`========================================================================`);
    lines.push(`Notice: Automated record generated by SignBridge AI for Deaf Patient Accessibility.`);
    lines.push(`========================================================================`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SignBridge_Consultation_${transcript.date.replace(/\s+/g, '_')}_${transcript.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification(
      language === 'ta' ? 'பதிவிறக்கம் தொடங்கியது' : 'Download Started',
      `Transcript saved as text file.`,
      'success'
    );
  };

  const clearAllLocalData = () => {
    localStorage.clear();
    setConsultations([]);
    setTranscripts([]);
    setInstructions([]);
    setActiveConsultation(initialActiveConsultation);
    setAccessibility(defaultAccessibility);
    addNotification(
      language === 'ta' ? 'அனைத்து தரவும் அழிக்கப்பட்டது' : 'Data Reset',
      language === 'ta' ? 'அனைத்து உள்ளூர் தரவுகளும் அழிக்கப்பட்டன.' : 'All local transcripts and records cleared.',
      'warning'
    );
  };

  const reseedSampleData = () => {
    setUser(mockUser);
    setConsultations(initialConsultations);
    setTranscripts(initialTranscripts);
    setInstructions(initialInstructions);
    setAccessibility(defaultAccessibility);
    addNotification(
      language === 'ta' ? 'மாதிரி தரவு மீட்டமைக்கப்பட்டது' : 'Sample Data Restored',
      language === 'ta' ? 'அனைத்து மாதிரி ஆலோசனைகளும் மீட்டமைக்கப்பட்டன.' : 'Default consultations, medical profile, and transcripts restored.',
      'success'
    );
  };

  const startNewConsultationSession = ({
    doctor,
    reason,
    language: prefLang,
    commPreference,
  }: {
    doctor: Doctor;
    reason: string;
    language: LanguageCode;
    commPreference: string;
  }) => {
    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }
    simulationStepRef.current = 0;

    const consultationId = `cons-${Date.now()}`;

    setActiveConsultation({
      id: consultationId,
      status: 'connecting',
      doctor,
      reason,
      language: prefLang === 'ta' ? 'Tamil' : 'English',
      commPreference,
      timer: 0,
      isMuted: false,
      isCameraOff: false,
      isListening: true,
      captions: [],
      currentLiveCaption: null,
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'system',
          text: `Consultation session connected with ${doctor.name} (${doctor.specialization}). Communication mode: ${commPreference}. Reason: ${reason}.`,
          tamilText: `${doctor.name} (${doctor.specialization}) அவர்களுடனான மருத்துவ அமர்வு தொடங்கியது. தொடர்பு முறை: ${commPreference}. காரணம்: ${reason}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        },
      ],
      instructions: [],
      isDemoSimulation: true,
    });

    setIsStartConsultationModalOpen(false);

    addNotification(
      language === 'ta' ? 'இணைப்பு தொடங்குகிறது' : 'Connecting Consultation',
      language === 'ta' ? `${doctor.name} அவர்களுடன் இணைகிறது...` : `Connecting with ${doctor.name}...`,
      'info'
    );

    setTimeout(() => {
      setActiveConsultation(prev => ({
        ...prev,
        status: 'active',
      }));

      addNotification(
        language === 'ta' ? 'ஆலோசனை தொடங்கியது' : 'Consultation Active',
        language === 'ta' ? 'நேரடி வசனங்கள் மற்றும் AI மொழிபெயர்ப்பு செயலில் உள்ளன.' : 'Live captions and AI translation active.',
        'success'
      );

      startNextDemoStep();
    }, 1200);
  };

  const sendPreparedMessageToConsultation = async (text: string, tamilText?: string) => {
    if (!text.trim()) return;
    const finalTa = tamilText || (await translateText(text, 'ta'));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-prep-${Date.now()}`,
      sender: 'patient',
      text: text.trim(),
      tamilText: finalTa,
      timestamp: timeStr,
      isRead: true,
      isVoiceInput: false,
    };

    setActiveConsultation(prev => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    addNotification(
      language === 'ta' ? 'ஆலோசனைக்கு அனுப்பப்பட்டது' : 'Added to Consultation',
      language === 'ta' ? 'AI தயாரித்த குறிப்பு மருத்துவரிடம் பகிரப்பட்டது.' : 'Prepared note sent to active doctor consultation.',
      'success'
    );
  };

  const markConversationAsRead = (doctorId: string) => {
    setDoctorConversations(prev =>
      prev.map(c => (c.doctorId === doctorId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const sendDoctorMessage = async (doctorId: string, text: string, isVoice = false) => {
    if (!text.trim()) return;

    const tamilText = await translateText(text, 'ta');
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const patientMsg: ChatMessage = {
      id: `msg-doc-chat-${Date.now()}`,
      sender: 'patient',
      text: text.trim(),
      tamilText,
      timestamp: timeStr,
      isRead: true,
      isVoiceInput: isVoice,
    };

    // Optimistically update conversation
    setDoctorConversations(prev =>
      prev.map(c => {
        if (c.doctorId === doctorId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, patientMsg],
          };
        }
        return c;
      })
    );

    addNotification(
      language === 'ta' ? 'செய்தி அனுப்பப்பட்டது' : 'Message Sent',
      language === 'ta' ? 'மருத்துவருக்கு செய்தி வெற்றிகரமாக அனுப்பப்பட்டது.' : 'Message delivered.',
      'info'
    );

    if (accessibility.ttsEnabled) {
      speakText(text);
    }

    // Call AI Doctor for clinical reply
    try {
      const activeConv = doctorConversations.find(c => c.doctorId === doctorId);
      const historyContext = (activeConv?.messages || []).map(m => ({
        sender: m.sender,
        text: m.text,
      }));

      const aiResponse = await chatWithAiDoctor(
        text,
        language,
        historyContext,
        user?.medicalProfile || null
      );

      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const doctorReplyMsg: ChatMessage = {
          id: `msg-doc-reply-${Date.now()}`,
          sender: 'doctor',
          text: aiResponse.replyEn,
          tamilText: aiResponse.replyTa,
          timestamp: replyTime,
          isRead: activeConversationDoctorId === doctorId,
        };

        setDoctorConversations(prev =>
          prev.map(c => {
            if (c.doctorId === doctorId) {
              const isCurrentlyActive = activeConversationDoctorId === doctorId;
              return {
                ...c,
                lastMessage: aiResponse.replyEn,
                lastMessageTime: 'Just now',
                unreadCount: isCurrentlyActive ? 0 : c.unreadCount + 1,
                messages: [...c.messages, doctorReplyMsg],
              };
            }
            return c;
          })
        );

        addNotification(
          language === 'ta' ? 'மருத்துவரிடமிருந்து பதில்' : 'Doctor Replied',
          aiResponse.replyEn.slice(0, 75) + '...',
          'info'
        );

        if (accessibility.ttsEnabled) {
          const speakContent = language === 'ta' ? aiResponse.replyTa : aiResponse.replyEn;
          speakText(speakContent);
        }
      }, 1200);
    } catch (err) {
      console.warn("Doctor chat reply error:", err);
    }
  };

  const triggerEmergencyAlert = (symptom: string, location = "Chennai, Tamil Nadu (GPS Detected)") => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      timestamp: timeStr,
      symptom: symptom || "Urgent acute distress",
      location,
      status: 'doctor_dispatched',
      emergencyContactNotified: true,
    };

    setEmergencyAlerts(prev => [newAlert, ...prev]);
    setIsEmergencyModalOpen(true);

    addNotification(
      language === 'ta' ? '🚨 அவசர எச்சரிக்கை அனுப்பப்பட்டது!' : '🚨 SOS EMERGENCY ALERT DISPATCHED',
      language === 'ta' ? 'அவசர சிகிச்சை மையத்திற்கும் உங்கள் தொடர்புக்கும் எச்சரிக்கை அனுப்பப்பட்டது.' : 'Emergency alert sent to Doctor On-Call and Emergency Contact.',
      'error'
    );

    // Speak emergency warning
    if (accessibility.ttsEnabled) {
      speakText(language === 'ta' ? 'அவசர உதவி எச்சரிக்கை அனுப்பப்பட்டது. அமைதியாக இருங்கள்.' : 'Emergency SOS alert dispatched. Help is being notified.');
    }
  };

  const login = (asDemo = true) => {
    if (asDemo) {
      setUser(mockUser);
      addNotification(
        language === 'ta' ? 'வரவேற்கிறோம்!' : 'Welcome!',
        language === 'ta' ? 'டெமோ பயனராக உள்நுழைந்துள்ளீர்கள்.' : 'Logged in as Meena Krishnan (Demo User)',
        'success'
      );
    }
  };

  const logout = () => {
    setUser(null);
    setActiveConsultation(initialActiveConsultation);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        language,
        t,
        setLanguage,
        accessibility,
        updateAccessibility,
        resetAccessibility,
        consultations,
        transcripts,
        instructions,
        activeConsultation,
        notifications,
        doctorConversations,
        activeConversationDoctorId,
        setActiveConversationDoctorId,
        emergencyAlerts,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isStartConsultationModalOpen,
        setIsStartConsultationModalOpen,
        isAccessibilityPanelOpen,
        setIsAccessibilityPanelOpen,
        isEndModalOpen,
        setIsEndModalOpen,
        deleteTranscriptModal,
        setDeleteTranscriptModal,
        profileCompletionPercentage,
        unreadMessagesCount,

        login,
        logout,
        updateUserProfile,
        startConsultation,
        startNewConsultationSession,
        pauseConsultation,
        resumeConsultation,
        endConsultation,
        sendPatientMessage,
        sendDoctorMessage,
        sendPreparedMessageToConsultation,
        markConversationAsRead,
        triggerEmergencyAlert,
        addDoctorCaption,
        toggleMute,
        toggleCamera,
        toggleListening,
        clearActiveCaptions,
        clearActiveMessages,
        deleteTranscript,
        deleteInstruction,
        addCustomInstruction,
        updateInstructionStatus,
        downloadTranscriptFile,
        clearAllLocalData,
        reseedSampleData,
        addNotification,
        removeNotification,
        speakText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
