import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCircle,
  HeartPulse,
  AlertOctagon,
  Pill,
  PhoneCall,
  Shield,
  Save,
  Plus,
  Trash2,
  Ear,
  FileCheck2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EmergencyContact } from '../types';

export const MedicalProfile: React.FC = () => {
  const {
    user,
    updateUserProfile,
    profileCompletionPercentage,
    language,
    t,
    addNotification,
    setIsEmergencyModalOpen,
  } = useApp();

  const [name, setName] = useState(user?.name || 'Meena Krishnan');
  const [email, setEmail] = useState(user?.email || 'meena.k@example.com');
  const [age, setAge] = useState(user?.age?.toString() || '32');
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [bloodGroup, setBloodGroup] = useState(user?.medicalProfile?.bloodGroup || 'O+');
  const [hearingLossLevel, setHearingLossLevel] = useState(
    user?.medicalProfile?.hearingLossLevel || 'Severe'
  );
  const [prefersTamil, setPrefersTamil] = useState(
    user?.medicalProfile?.prefersTamil ?? true
  );

  // Lists
  const [allergies, setAllergies] = useState<string[]>(
    user?.medicalProfile?.allergies || ['Penicillin', 'Peanuts']
  );
  const [newAllergy, setNewAllergy] = useState('');

  const [medications, setMedications] = useState<string[]>(
    user?.medicalProfile?.currentMedications || ['Amlodipine 5mg (Daily morning)', 'Paracetamol 500mg (As needed)']
  );
  const [newMedication, setNewMedication] = useState('');

  const [chronicConditions, setChronicConditions] = useState<string[]>(
    user?.medicalProfile?.chronicConditions || ['Hypertension (Stage 1)', 'Congenital Sensorineural Hearing Loss']
  );
  const [newCondition, setNewCondition] = useState('');

  // Emergency Contact
  const [contactName, setContactName] = useState(
    user?.medicalProfile?.emergencyContact?.name || 'Ramesh Krishnan'
  );
  const [contactRelation, setContactRelation] = useState(
    user?.medicalProfile?.emergencyContact?.relationship || 'Spouse / Brother'
  );
  const [contactPhone, setContactPhone] = useState(
    user?.medicalProfile?.emergencyContact?.phone || '+91 98401 23456'
  );

  const handleAddAllergy = () => {
    if (!newAllergy.trim()) return;
    setAllergies([...allergies, newAllergy.trim()]);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleAddMedication = () => {
    if (!newMedication.trim()) return;
    setMedications([...medications, newMedication.trim()]);
    setNewMedication('');
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    setChronicConditions([...chronicConditions, newCondition.trim()]);
    setNewCondition('');
  };

  const handleRemoveCondition = (index: number) => {
    setChronicConditions(chronicConditions.filter((_, i) => i !== index));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedEmergency: EmergencyContact = {
      name: contactName,
      relationship: contactRelation,
      phone: contactPhone,
    };

    updateUserProfile({
      name,
      email,
      age: parseInt(age, 10) || 32,
      gender,
      medicalProfile: {
        bloodGroup,
        hearingLossLevel,
        prefersTamil,
        allergies,
        currentMedications: medications,
        chronicConditions,
        emergencyContact: updatedEmergency,
      },
    });

    addNotification(
      language === 'ta' ? 'சுயவிவரம் புதுப்பிக்கப்பட்டது' : 'Medical Profile Saved',
      language === 'ta' ? 'உங்கள் மருத்துவ தகவல்கள் பாதுகாப்பாக சேமிக்கப்பட்டன.' : 'All clinical information synced to your session.',
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner & Profile Completion Progress */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#2563EB] text-xs font-bold">
                {hearingLossLevel} Hearing Loss
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {email} • {gender}, {age} years • Blood Group: <span className="font-bold text-rose-600">{bloodGroup}</span>
            </p>
          </div>
        </div>

        {/* Completion Gauge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 space-y-2 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">
              {language === 'ta' ? 'சுயவிவர நிறைவு:' : 'Profile Completion:'}
            </span>
            <span className="text-blue-600">{profileCompletionPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${profileCompletionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {profileCompletionPercentage === 100
              ? '✓ Fully prepared for emergency doctor consultations'
              : 'Complete all fields for optimal doctor assistance'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Basic & Hearing Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            <UserCircle className="w-5 h-5 text-blue-600" />
            <h2>{language === 'ta' ? '1. தனிப்பட்ட & செவித்திறன் விவரங்கள்' : '1. Personal & Hearing Characteristics'}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Age:</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Gender:</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Blood Group:</label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                <Ear className="w-3.5 h-3.5 text-purple-600" />
                <span>Hearing Impairment Degree:</span>
              </label>
              <select
                value={hearingLossLevel}
                onChange={e => setHearingLossLevel(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-semibold text-purple-600"
              >
                <option value="Mild">Mild Hearing Loss (26 - 40 dB)</option>
                <option value="Moderate">Moderate Hearing Loss (41 - 55 dB)</option>
                <option value="Severe">Severe Hearing Loss (71 - 90 dB)</option>
                <option value="Profound">Profound Deafness (91+ dB)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Data (Allergies, Medications, Chronic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Allergies */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-600">
              <AlertOctagon className="w-4 h-4" />
              <span>Known Drug & Food Allergies</span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {allergies.map((all, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-900 dark:text-rose-200"
                >
                  <span>⚠️ {all}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-2">
              <input
                type="text"
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                placeholder="e.g. Sulfa drugs"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="p-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-600">
              <Pill className="w-4 h-4" />
              <span>Active Medications</span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {medications.map((med, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs font-semibold text-blue-900 dark:text-blue-200"
                >
                  <span className="truncate pr-2">💊 {med}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(idx)}
                    className="text-blue-500 hover:text-blue-700 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-2">
              <input
                type="text"
                value={newMedication}
                onChange={e => setNewMedication(e.target.value)}
                placeholder="e.g. Metformin 500mg"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMedication}
                className="p-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-teal-600">
              <HeartPulse className="w-4 h-4" />
              <span>Chronic Conditions</span>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {chronicConditions.map((cond, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs font-semibold text-teal-900 dark:text-teal-200"
                >
                  <span className="truncate pr-2">🫀 {cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(idx)}
                    className="text-teal-500 hover:text-teal-700 p-1 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-2">
              <input
                type="text"
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                placeholder="e.g. Asthma, Tinnitus"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="p-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Emergency Contact & SOS Linking */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-base">
              <PhoneCall className="w-5 h-5 text-rose-600" />
              <h2>{language === 'ta' ? '3. அவசர தொடர்பு & பாதுகாப்பு' : '3. Emergency Contact (SOS Linked)'}</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>Test SOS Dispatch</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Contact Person Name:</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Relationship:</label>
              <input
                type="text"
                value={contactRelation}
                onChange={e => setContactRelation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-bold">Phone Number:</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#0EA5A4] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white font-black text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'ta' ? 'அனைத்து விவரங்களையும் சேமி' : 'Save Medical Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
