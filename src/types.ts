export type LanguageCode = 'en' | 'ta';

export type SpeakerType = 'doctor' | 'patient' | 'system';

export type ConsultationStatus = 'idle' | 'connecting' | 'active' | 'paused' | 'ended' | 'completed';

export type InstructionCategory = 'medication' | 'follow-up' | 'tests' | 'lifestyle' | 'appointments' | 'warnings' | 'general';

export type InstructionStatus = 'confirmed' | 'needs_confirmation';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface MedicalProfile {
  bloodGroup: string;
  hearingLossLevel?: 'Mild' | 'Moderate' | 'Severe' | 'Profound';
  prefersTamil?: boolean;
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  emergencyContact: EmergencyContact;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender?: string;
  language: LanguageCode;
  isDeafOrHardOfHearing: boolean;
  hearingLossType?: 'profound_deaf' | 'hard_of_hearing' | 'speech_impaired';
  preferredCommunication?: 'captions_and_text' | 'sign_interpreter' | 'large_captions';
  avatar?: string;
  medicalProfile?: MedicalProfile;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  experienceYears: number;
  avatar: string;
  rating: number;
  languages?: string[];
  availability?: string;
}

export interface CaptionItem {
  id: string;
  speaker: SpeakerType;
  text: string;
  tamilText?: string;
  timestamp: string;
  confidence: number;
  isUnclear?: boolean;
  warning?: string;
  category?: InstructionCategory;
}

export interface ChatMessage {
  id: string;
  sender: SpeakerType;
  text: string;
  tamilText?: string;
  timestamp: string;
  isRead: boolean;
  isVoiceInput?: boolean;
}

export interface MedicalInstruction {
  id: string;
  consultationId: string;
  doctorName: string;
  category: InstructionCategory;
  text: string;
  tamilText?: string;
  status: InstructionStatus;
  confidence: number;
  timestamp: string;
  date: string;
}

export interface Consultation {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  duration: string;
  language: string;
  status: ConsultationStatus;
  transcriptCount: number;
  instructionCount: number;
  notes?: string;
}

export interface TranscriptRecord {
  id: string;
  consultationId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  duration: string;
  language: string;
  messages: {
    id: string;
    speaker: SpeakerType;
    text: string;
    tamilText?: string;
    time: string;
  }[];
  instructions: MedicalInstruction[];
}

export interface DoctorConversation {
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
  messages: ChatMessage[];
}

export interface ConsultationReason {
  id: string;
  labelEn: string;
  labelTa: string;
  category: 'general' | 'followup' | 'medication' | 'emergency' | 'other';
}

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  symptom: string;
  location: string;
  status: 'sent' | 'received' | 'doctor_dispatched';
  emergencyContactNotified: boolean;
}

export interface SignGesture {
  id: string;
  nameEn: string;
  nameTa: string;
  phraseEn: string;
  phraseTa: string;
  icon: string;
  description: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  extraLargeButtons: boolean;
  simplifiedInterface: boolean;
  captionSize: 'small' | 'medium' | 'large' | 'xlarge';
  captionPosition: 'bottom' | 'center';
  autoScroll: boolean;
  autoTranslate: boolean;
  speakerId: boolean;
  confidenceDisplay: boolean;
  ttsEnabled: boolean;
  ttsSpeed: number; // 0.5 to 2
  ttsVolume: number; // 0 to 1
  notificationsEnabled: boolean;
  saveTranscripts: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}
