import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  MessageSquare,
  Languages,
  FileText,
  CheckSquare,
  Volume2,
  Send,
  ArrowRight,
  Stethoscope,
  Copy,
  Check,
  HelpCircle,
  Clock,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import {
  explainSymptomsWithAi,
  simplifyMedicalText,
  generateConsultationChecklist,
  translateText,
} from '../services/aiService';

export const AiAssistant: React.FC = () => {
  const {
    language,
    t,
    user,
    sendPreparedMessageToConsultation,
    addNotification,
    speakText,
    setIsStartConsultationModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'symptoms' | 'simplify' | 'checklist' | 'translate'>('symptoms');

  // Tool 1: Symptom Explainer
  const [symptomInput, setSymptomInput] = useState('');
  const [symptomOutput, setSymptomOutput] = useState<{
    summaryEn: string;
    summaryTa: string;
    suggestedDoctorQuestions: string[];
    urgencyLevel: 'low' | 'medium' | 'high';
  } | null>(null);
  const [isSymptomLoading, setIsSymptomLoading] = useState(false);

  // Tool 2: Simplify Medical Text
  const [complexInput, setComplexInput] = useState('');
  const [simplifiedOutput, setSimplifiedOutput] = useState<{
    simplifiedEn: string;
    simplifiedTa: string;
    keyTakeaways: string[];
  } | null>(null);
  const [isSimplifyLoading, setIsSimplifyLoading] = useState(false);

  // Tool 3: Consultation Checklist
  const [checklistTopic, setChecklistTopic] = useState('');
  const [checklistOutput, setChecklistOutput] = useState<{
    questionsToAsk: string[];
    whatToBring: string[];
    communicationTips: string[];
  } | null>(null);
  const [isChecklistLoading, setIsChecklistLoading] = useState(false);

  // Tool 4: Instant Translation
  const [transInput, setTransInput] = useState('');
  const [transOutput, setTransOutput] = useState('');
  const [transDirection, setTransDirection] = useState<'en_to_ta' | 'ta_to_en'>('en_to_ta');
  const [isTransLoading, setIsTransLoading] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addNotification(language === 'ta' ? 'நகலெடுக்கப்பட்டது' : 'Copied to Clipboard', text.slice(0, 50), 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Symptom Explainer Runner
  const handleExplainSymptoms = async () => {
    if (!symptomInput.trim()) return;
    setIsSymptomLoading(true);
    try {
      const res = await explainSymptomsWithAi(symptomInput, language);
      setSymptomOutput(res);
      addNotification(
        language === 'ta' ? 'அறிகுறிகள் தொகுக்கப்பட்டன' : 'Symptoms Clarified',
        'Ready to share with your doctor or consult.',
        'success'
      );
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSymptomLoading(false);
    }
  };

  // Simplify Medical Text Runner
  const handleSimplifyMedical = async () => {
    if (!complexInput.trim()) return;
    setIsSimplifyLoading(true);
    try {
      const res = await simplifyMedicalText(complexInput, language);
      setSimplifiedOutput(res);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSimplifyLoading(false);
    }
  };

  // Checklist Generator Runner
  const handleGenerateChecklist = async () => {
    if (!checklistTopic.trim()) return;
    setIsChecklistLoading(true);
    try {
      const res = await generateConsultationChecklist(checklistTopic, language);
      setChecklistOutput(res);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsChecklistLoading(false);
    }
  };

  // Translator Runner
  const handleTranslate = async () => {
    if (!transInput.trim()) return;
    setIsTransLoading(true);
    try {
      const targetLang = transDirection === 'en_to_ta' ? 'ta' : 'en';
      const res = await translateText(transInput, targetLang);
      setTransOutput(res);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsTransLoading(false);
    }
  };

  const handleSendSummaryToConsultation = () => {
    if (!symptomOutput) return;
    sendPreparedMessageToConsultation(
      `Patient symptom note: ${symptomOutput.summaryEn}`,
      `நோயாளி அறிகுறி குறிப்பு: ${symptomOutput.summaryTa}`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2563EB] to-[#0EA5A4] p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-white" />
            </span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-blue-100">
              {language === 'ta' ? 'மருத்துவ தகவல் உதவியாளர்' : 'Healthcare Communication Assistant'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'ta' ? 'AI மருத்துவ தகவல் உதவியாளர்' : 'AI Communication Assistant'}
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed font-medium">
            {language === 'ta'
              ? 'உங்கள் அறிகுறிகளை மருத்துவருக்கு எளிதாக விளக்க, மருத்துவ குறிப்புகளை எளிய தமிழில் புரிந்துகொள்ள மற்றும் மொழிபெயர்க்க உதவும் தளம்.'
              : 'Prepare your thoughts before consultations, simplify complex doctor notes into clear terms, and bridge Tamil-English communication.'}
          </p>
        </div>

        <button
          onClick={() => setIsStartConsultationModalOpen(true)}
          className="self-start md:self-center px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-xs shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
        >
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>{language === 'ta' ? 'மருத்துவருடன் ஆலோசிக்கவும்' : 'Start Doctor Consultation'}</span>
        </button>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'symptoms'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{language === 'ta' ? 'அறிகுறிகளை விளக்கு' : 'Explain My Symptoms'}</span>
        </button>

        <button
          onClick={() => setActiveTab('simplify')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'simplify'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{language === 'ta' ? 'மருத்துவக் குறிப்பை எளிமையாக்கு' : "Simplify Doctor's Note"}</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'checklist'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>{language === 'ta' ? 'ஆலோசனை சரிபார்ப்பு பட்டியல்' : 'Consultation Checklist'}</span>
        </button>

        <button
          onClick={() => setActiveTab('translate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'translate'
              ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>{language === 'ta' ? 'இருமொழி மொழிபெயர்ப்பு' : 'Tamil ↔ English Translation'}</span>
        </button>
      </div>

      {/* TAB 1: Explain My Symptoms */}
      {activeTab === 'symptoms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'உங்கள் உடல் உபாதையை விளக்குங்கள்' : 'Describe What You Are Experiencing'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ta'
                    ? 'உங்கள் வார்த்தைகளில் தட்டச்சு செய்யுங்கள். AI மருத்துவரிடம் கேட்க வேண்டிய தெளிவான குறிப்பை உருவாக்கும்.'
                    : 'Type freely in English or Tamil. AI organizes your symptoms into concise clinical terms.'}
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={symptomInput}
              onChange={e => setSymptomInput(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'எ.கா. கடந்த 2 நாட்களாக கடுமையான தலைவலியும், லேசான மயக்கமும் உள்ளது. வெளிச்சத்தைப் பார்த்தால் கண் வலிக்கிறது...'
                  : 'e.g., Since 2 days I have throbbing headache on right side, feeling dizzy when standing up, sensitive to bright screen light...'
              }
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-slate-500 font-semibold self-center">Quick examples:</span>
              <button
                type="button"
                onClick={() => setSymptomInput('Sharp ear pain and dizziness since yesterday morning')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                👂 Ear pain & dizziness
              </button>
              <button
                type="button"
                onClick={() => setSymptomInput('Chest tightness after climbing stairs and dry cough')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                🫁 Chest tightness
              </button>
            </div>

            <button
              onClick={handleExplainSymptoms}
              disabled={isSymptomLoading || !symptomInput.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSymptomLoading ? 'Analyzing & Structuring...' : language === 'ta' ? 'அறிகுறிகளைத் தொகுக்கவும்' : 'Structure for Doctor'}</span>
            </button>
          </div>

          {/* Symptom Structured Result */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>{language === 'ta' ? 'மருத்துவ குறிப்பு சுருக்கம்' : 'Prepared Medical Summary'}</span>
              {symptomOutput && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Ready to Share
                </span>
              )}
            </h2>

            {symptomOutput ? (
              <div className="space-y-4 text-xs">
                {/* English Summary */}
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-blue-950 dark:text-blue-200">
                    <span>🇬🇧 English Summary for Doctor:</span>
                    <button
                      onClick={() => handleCopy(symptomOutput.summaryEn, 'symptom-en')}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {copiedId === 'symptom-en' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {symptomOutput.summaryEn}
                  </p>
                </div>

                {/* Tamil Translation */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-emerald-950 dark:text-emerald-200">
                    <span>🇮🇳 தமிழ் விளக்கம் (Tamil Summary):</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(symptomOutput.summaryTa)}
                        className="text-emerald-700 hover:text-emerald-900 p-1"
                        title="Speak in Tamil"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(symptomOutput.summaryTa, 'symptom-ta')}
                        className="text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        {copiedId === 'symptom-ta' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {symptomOutput.summaryTa}
                  </p>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {language === 'ta' ? 'மருத்துவரிடம் நீங்கள் கேட்க வேண்டிய கேள்விகள்:' : 'Key Questions to Ask Your Doctor:'}
                  </h3>
                  <div className="space-y-1.5">
                    {symptomOutput.suggestedDoctorQuestions.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                      >
                        • {q}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSendSummaryToConsultation}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'ஆலோசனைக்கு அனுப்பு' : 'Send to Consultation Room'}</span>
                  </button>
                  <button
                    onClick={() => setIsStartConsultationModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100"
                  >
                    {language === 'ta' ? 'மருத்துவரை அழைக்கவும்' : 'Connect with Doctor Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                <BookOpen className="w-10 h-10 mb-2 opacity-40 text-blue-500" />
                <p className="text-xs font-semibold">
                  {language === 'ta'
                    ? 'இடதுபுறத்தில் உங்கள் அறிகுறிகளை உள்ளிட்டு பொத்தானை அழுத்தவும்.'
                    : 'Enter your symptoms on the left to generate structured medical points.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Simplify Doctor's Note */}
      {activeTab === 'simplify' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'சிக்கலான மருத்துவ வாசகத்தை எளிமையாக்குங்கள்' : "Paste Doctor's Note or Prescription"}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ta'
                    ? 'மருத்துவ சொற்கள் நிறைந்த வாக்கியங்களை எளிய நடைமுறைப் பொருளாக மாற்றித்தரும்.'
                    : 'Translates complex medical jargon into easy-to-understand everyday language.'}
                </p>
              </div>
            </div>

            <textarea
              rows={4}
              value={complexInput}
              onChange={e => setComplexInput(e.target.value)}
              placeholder="e.g., Patient diagnosed with acute bilateral otitis media. Prescribed amoxicillin 500mg TID for 7 days. Advised audiogram follow-up in 2 weeks..."
              className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />

            <button
              onClick={handleSimplifyMedical}
              disabled={isSimplifyLoading || !complexInput.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-[#0EA5A4] hover:bg-[#0f766e] text-white font-bold text-xs shadow-md shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSimplifyLoading ? 'Simplifying Medical Terms...' : language === 'ta' ? 'எளிய விளக்கமாக மாற்று' : 'Simplify to Plain Language'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'எளிய விளக்கம்' : 'Plain Language Breakdown'}
            </h2>

            {simplifiedOutput ? (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 space-y-1.5">
                  <div className="font-bold text-teal-950 dark:text-teal-200">🇬🇧 Plain English:</div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {simplifiedOutput.simplifiedEn}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1.5">
                  <div className="font-bold text-blue-950 dark:text-blue-200">🇮🇳 எளிய தமிழ் விளக்கம்:</div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {simplifiedOutput.simplifiedTa}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Key Patient Action Points:</h3>
                  {simplifiedOutput.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      ✓ {point}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                <FileText className="w-10 h-10 mb-2 opacity-40 text-teal-500" />
                <p className="text-xs font-semibold">
                  {language === 'ta'
                    ? 'மருத்துவக் குறிப்பை ஒட்டவும்.'
                    : 'Paste a prescription or discharge note to view a plain explanation.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Consultation Checklist */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'ஆலோசனைக்கான தயாரிப்பு பட்டியல்' : 'Prepare for Your Doctor Visit'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ta'
                    ? 'நீங்கள் எதற்காக மருத்துவரை சந்திக்கிறீர்கள் என்பதை உள்ளிடவும்.'
                    : 'Enter the reason or specialty (e.g. ENT checkup, blood pressure review).'}
                </p>
              </div>
            </div>

            <input
              type="text"
              value={checklistTopic}
              onChange={e => setChecklistTopic(e.target.value)}
              placeholder="e.g., Annual ENT hearing checkup, Hypertension follow-up"
              className="w-full p-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              onClick={handleGenerateChecklist}
              disabled={isChecklistLoading || !checklistTopic.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isChecklistLoading ? 'Generating Checklist...' : 'Generate My Consultation Checklist'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'ta' ? 'தயாரிப்பு பட்டியல்' : 'Your Visit Checklist'}
            </h2>

            {checklistOutput ? (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-300">
                    ❓ Questions You Should Ask:
                  </h3>
                  {checklistOutput.questionsToAsk.map((q, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-200">
                      • {q}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300">
                    📋 Documents & Reports to Have Ready:
                  </h3>
                  {checklistOutput.whatToBring.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                <CheckSquare className="w-10 h-10 mb-2 opacity-40 text-indigo-500" />
                <p className="text-xs font-semibold">
                  {language === 'ta'
                    ? 'ஆலோசனை தலைப்பை உள்ளிட்டு பட்டியல் பெறவும்.'
                    : 'Generate customized questions and reminders for your appointment.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Instant Translation */}
      {activeTab === 'translate' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'மருத்துவ இருமொழி மொழிபெயர்ப்பு' : 'Medical Bilingual Translation'}
                </h2>
                <p className="text-xs text-slate-500">
                  {language === 'ta'
                    ? 'ஆங்கிலம் மற்றும் தமிழ் இடையே உடனடி மொழிபெயர்ப்பு'
                    : 'Accurate clinical terms translation powered by Gemini AI'}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setTransDirection('en_to_ta')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  transDirection === 'en_to_ta'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                English → தமிழ்
              </button>
              <button
                onClick={() => setTransDirection('ta_to_en')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  transDirection === 'ta_to_en'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                தமிழ் → English
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {transDirection === 'en_to_ta' ? 'English Text:' : 'தமிழ் உரை:'}
              </label>
              <textarea
                rows={5}
                value={transInput}
                onChange={e => setTransInput(e.target.value)}
                placeholder={
                  transDirection === 'en_to_ta'
                    ? 'Type medical notes, doctor instructions, or symptoms in English...'
                    : 'மருத்துவக் குறிப்புகள் அல்லது கேள்விகளை தமிழில் தட்டச்சு செய்யவும்...'
                }
                className="w-full p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={handleTranslate}
                disabled={isTransLoading || !transInput.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Languages className="w-4 h-4" />
                <span>{isTransLoading ? 'Translating...' : 'Translate Instantly'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{transDirection === 'en_to_ta' ? 'தமிழ் மொழிபெயர்ப்பு:' : 'English Translation:'}</span>
                {transOutput && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(transOutput)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Speak</span>
                    </button>
                    <button
                      onClick={() => handleCopy(transOutput, 'trans-res')}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="w-full h-40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-sm overflow-y-auto font-medium">
                {transOutput ? (
                  <p className="text-slate-900 dark:text-white leading-relaxed">{transOutput}</p>
                ) : (
                  <span className="text-slate-400 italic text-xs">Translation output will appear here...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
