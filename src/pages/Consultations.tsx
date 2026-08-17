import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { mockDoctors } from '../data/mockData';
import { Doctor } from '../types';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  Star,
  ChevronRight,
  ShieldCheck,
  Languages,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const Consultations: React.FC = () => {
  const {
    consultations,
    activeConsultation,
    startConsultation,
    setIsStartConsultationModalOpen,
    language,
    t,
  } = useApp();

  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'completed'>('all');

  const upcomingConsultations = [
    {
      id: 'up-1',
      doctor: mockDoctors[0],
      date: 'Tomorrow, 10:30 AM',
      specialty: 'ENT & Audiology Specialist',
      reason: 'Bilateral Audiogram Review & Tinnitus Follow-up',
      status: 'scheduled',
    },
    {
      id: 'up-2',
      doctor: mockDoctors[1],
      date: 'Thursday, 04:00 PM',
      specialty: 'General Medicine & Hypertension',
      reason: 'Blood Pressure Medication Refill',
      status: 'scheduled',
    },
  ];

  const handleJoinActive = () => {
    navigate('/consultation');
  };

  const handleStartWithDoctor = (doc: Doctor) => {
    startConsultation(doc, true);
    navigate('/consultation');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">
              <Stethoscope className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-blue-600">
              {language === 'ta' ? 'மருத்துவ ஆலோசனைகள்' : 'Medical Consultations Hub'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'ta' ? 'மருத்துவ ஆலோசனை தளம்' : 'Accessible Doctor Consultations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
            {language === 'ta'
              ? 'செவித்திறன் குறைபாடுள்ள நோயாளிகளுக்கான நிகழ்நேர வசனங்கள், AI சைகை மொழி மற்றும் இருமொழி மொழிபெயர்ப்பு கொண்ட மருத்துவ அமர்வுகள்.'
              : 'Join video appointments with live bilingual Tamil/English speech-to-text captions, automated medical instruction capture, and sign language recognition.'}
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => setIsStartConsultationModalOpen(true)}
          className="self-start md:self-center py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#0EA5A4] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'ta' ? 'புதிய ஆலோசனை தொடங்கு' : 'Start New Consultation'}</span>
        </button>
      </div>

      {/* Active Consultation Notification Card (if live) */}
      {activeConsultation.status === 'active' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25">
                  LIVE SESSION ACTIVE
                </span>
                <span className="text-xs font-mono font-bold">
                  {Math.floor(activeConsultation.timer / 60)}:
                  {(activeConsultation.timer % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-lg font-black mt-0.5">
                In Session with {activeConsultation.doctor.name} ({activeConsultation.doctor.specialization})
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Live captions, Tamil translation, and key medical instructions are actively running.
              </p>
            </div>
          </div>

          <button
            onClick={handleJoinActive}
            className="py-3 px-6 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs shadow-lg transition-all self-start sm:self-center"
          >
            Enter Consultation Room →
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterTab === 'all'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          {language === 'ta' ? 'அனைத்து ஆலோசனைகள்' : 'All Consultations'} ({consultations.length + upcomingConsultations.length})
        </button>
        <button
          onClick={() => setFilterTab('upcoming')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterTab === 'upcoming'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          {language === 'ta' ? 'வரவிருக்கும் ஆலோசனைகள்' : 'Upcoming Appointments'} ({upcomingConsultations.length})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-xl transition-all ${
            filterTab === 'completed'
              ? 'bg-[#2563EB] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          {language === 'ta' ? 'முடிவடைந்தவை' : 'Past Completed'} ({consultations.length})
        </button>
      </div>

      {/* Upcoming Consultations Grid */}
      {(filterTab === 'all' || filterTab === 'upcoming') && (
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'ta' ? 'வரவிருக்கும் திட்டமிடப்பட்ட சந்திப்புகள்' : 'Upcoming Scheduled Consultations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingConsultations.map(up => (
              <div
                key={up.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={up.doctor.avatar}
                      alt={up.doctor.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {up.doctor.name}
                      </h3>
                      <p className="text-xs text-blue-600 font-semibold">{up.specialty}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{up.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold uppercase">
                    Scheduled
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <span className="text-slate-500 font-semibold">Chief Concern: </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{up.reason}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Deaf Accessible Setup Ready</span>
                  </span>
                  <button
                    onClick={() => handleStartWithDoctor(up.doctor)}
                    className="py-2 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Start Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Specialist Physicians Roster */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {language === 'ta' ? 'மருத்துவர் பட்டியல் (உடனடி ஆலோசனை)' : 'Available On-Call Doctors'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockDoctors.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {doc.name}
                    </h3>
                    <p className="text-[11px] text-blue-600 font-semibold truncate">{doc.specialization}</p>
                    <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400">({doc.experienceYears} yrs)</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-slate-400" />
                    <span>{doc.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{doc.availability}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartWithDoctor(doc)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-bold text-xs transition-opacity flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Consult with {doc.name.split(' ')[1]}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Past Consultations History */}
      {(filterTab === 'all' || filterTab === 'completed') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'ta' ? 'கடந்த ஆலோசனைகள் & அறிக்கைகள்' : 'Past Completed Consultations'}
            </h2>
            <button
              onClick={() => navigate('/history')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View Full History Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {consultations.map(c => (
              <div
                key={c.id}
                className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {c.doctorName}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold">{c.doctorSpecialization}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {c.date} • Duration: {c.duration} • Mode: {c.patientCommMode || 'Live Captions & Text'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/history')}
                    className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    View Summary & Instructions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
