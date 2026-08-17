import { LanguageCode } from '../types';

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public speak(
    text: string,
    lang: LanguageCode = 'en',
    rate: number = 1.0,
    volume: number = 1.0,
    onEnd?: () => void
  ) {
    if (!this.synth || !text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop any previous speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.volume = Math.max(0, Math.min(1.0, volume));
      utterance.pitch = 1.0;

      if (lang === 'ta') {
        utterance.lang = 'ta-IN';
        const tamilVoice = this.voices.find(v => v.lang.includes('ta') || v.lang.includes('IN'));
        if (tamilVoice) utterance.voice = tamilVoice;
      } else {
        utterance.lang = 'en-US';
        const engVoice = this.voices.find(v => v.lang.startsWith('en') && !v.name.includes('Google'));
        if (engVoice) utterance.voice = engVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('TTS error:', e);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis invocation failed:', err);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const ttsService = new TextToSpeechService();
