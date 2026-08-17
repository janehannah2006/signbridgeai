import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  PhoneCall,
  MapPin,
  ShieldAlert,
  Send,
  X,
  CheckCircle2,
  HeartPulse,
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const {
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    triggerEmergencyAlert,
    emergencyAlerts,
    user,
    language,
    t,
  } = useApp();

  const [selectedSymptom, setSelectedSymptom] = useState('Severe shortness of breath or chest pain');
  const [customNote, setCustomNote] = useState('');
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isEmergencyModalOpen) return null;

  const urgentSymptoms = [
    { en: 'Severe chest tightness or pain', ta: 'கடுமையான மார்பு வலி அல்லது இறுக்கம்' },
    { en: 'Severe shortness of breath', ta: 'கடுமையான மூச்சுத் திணறல்' },
    { en: 'Sudden dizziness / fainting', ta: 'திடீர் தலைசுற்றல் அல்லது மயக்கம்' },
    { en: 'Acute allergic reaction / swelling', ta: 'தீவிர ஒவ்வாமை அல்லது வீக்கம்' },
    { en: 'High fever with severe headache', ta: 'கடும் தலைவலியுடன் கூடிய அதிக காய்ச்சல்' },
  ];

  const handleSendSOS = () => {
    const symptomDesc = customNote ? `${selectedSymptom} - ${customNote}` : selectedSymptom;
    triggerEmergencyAlert(symptomDesc);
    setIsDispatched(true);
  };

  const handleClose = () => {
    setIsEmergencyModalOpen(false);
    setIsDispatched(false);
  };

  return (
    <div
      id="emergency-sos-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-rose-500 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide flex items-center gap-2">
                <span>{language === 'ta' ? 'அவசர மருத்துவ உதவி (SOS)' : 'EMERGENCY MEDICAL SOS'}</span>
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                {language === 'ta'
                  ? 'உடனடி மருத்துவக் குழு மற்றும் அவசர தொடர்புகளுக்கு எச்சரிக்கை அனுப்பப்படும்'
                  : 'Fast-dispatch alert to Doctor On-Call & Emergency Contacts'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Important Medical Disclaimer Notice */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700/60 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
              {language === 'ta'
                ? 'கவனத்திற்கு: உயிருக்கு ஆபத்தான நிலையில் உடனடியாக ஆம்புலன்ஸ் (108) அல்லது அவசர சிகிச்சை பிரிவை அணுகவும். இந்த அமைப்பு உங்கள் மருத்துவருக்கு நேரடி எச்சரிக்கையை அனுப்புகிறது.'
                : 'Notice: If this is an immediate life-threatening emergency, call local ambulance (108 / ER). This system notifies your registered on-call doctor & emergency contact.'}
            </p>
          </div>

          {isDispatched ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {language === 'ta' ? 'அவசர எச்சரிக்கை அனுப்பப்பட்டது!' : 'Emergency SOS Alert Dispatched!'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  {language === 'ta'
                    ? 'மருத்துவர் ராஜேஷ் குமார் மற்றும் அவசர தொடர்பு (ரமேஷ் கிருஷ்ணன் - +91 98401 23456) ஆகியோருக்கு உங்கள் இருப்பிடம் மற்றும் அறிகுறிகள் பகிரப்பட்டன.'
                    : 'Dr. Rajesh Kumar & Emergency Contact (Ramesh Krishnan - +91 98401 23456) have received your alert and GPS coordinates.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600">On-Call Response Active</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Location:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Chennai, TN (13.0827° N, 80.2707° E)</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Patient Communication:</span>
                  <span className="font-semibold text-blue-600">Deaf Patient - Text & Visual Ready</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl hover:opacity-90 transition-opacity"
              >
                {language === 'ta' ? 'மூடுக' : 'Dismiss / Back to Platform'}
              </button>
            </div>
          ) : (
            <>
              {/* Emergency Contact Summary */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <div>
                    <span className="text-slate-500 font-medium">
                      {language === 'ta' ? 'அவசர தொடர்பு:' : 'Emergency Contact:'}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 ml-1.5">
                      {user?.medicalProfile?.emergencyContact?.name || 'Ramesh Krishnan'} (
                      {user?.medicalProfile?.emergencyContact?.phone || '+91 98401 23456'})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>GPS Active</span>
                </div>
              </div>

              {/* Symptom Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ta' ? 'முதன்மை அவசர அறிகுறியைத் தேர்ந்தெடுக்கவும்:' : 'Select Primary Emergency Symptom:'}
                </label>
                <div className="space-y-1.5">
                  {urgentSymptoms.map(item => {
                    const label = language === 'ta' ? item.ta : item.en;
                    const isSelected = selectedSymptom === item.en;
                    return (
                      <button
                        key={item.en}
                        type="button"
                        onClick={() => setSelectedSymptom(item.en)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-rose-300 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Details */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ta' ? 'கூடுதல் விவரங்கள் (விருப்பத்தேர்வு):' : 'Additional Message / Details (Optional):'}
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  placeholder={
                    language === 'ta'
                      ? 'எ.கா. மயக்கம் வருகிறது, உடனே அழைக்கவும்'
                      : 'e.g. Feeling lightheaded, please text or call family member'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSendSOS}
                  className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'ta' ? 'அவசர எச்சரிக்கை அனுப்பு (SOS)' : 'DISPATCH SOS ALERT NOW'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
