import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge, InstructionCategoryBadge, InstructionStatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import {
  FileText,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  Clock,
  User,
  Star,
  Eye,
  Languages,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { TranscriptRecord } from '../types';

export const TranscriptsPage: React.FC = () => {
  const {
    transcripts,
    setDeleteTranscriptModal,
    downloadTranscriptFile,
    language,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');
  const [selectedTranscript, setSelectedTranscript] = useState<TranscriptRecord | null>(
    transcripts[0] || null
  );

  const filteredTranscripts = transcripts.filter((item) => {
    const matchesSearch =
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorSpecialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.messages.some((c) => c.text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDoctor =
      selectedDoctorFilter === 'all' || item.doctorName.includes(selectedDoctorFilter);

    return matchesSearch && matchesDoctor;
  });

  const handleDownloadTranscript = (transcript: TranscriptRecord) => {
    downloadTranscriptFile(transcript);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#2563EB]" />
            <span>{t('tabTranscripts')} — Saved Medical Records</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete archives of your AI-transcribed consultations, verified prescription lists, and medical advice.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts by keywords, medicines, doctor name..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Doctors</option>
            <option value="Ananya">Dr. Ananya Sharma</option>
            <option value="Rajesh">Dr. Rajesh Kumar</option>
            <option value="Priya">Dr. Priya Sundaram</option>
          </select>
        </div>
      </div>

      {/* Main Split: Transcript List & Detail View */}
      {filteredTranscripts.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No Transcripts Found"
          description="No consultations matched your search query. Try clearing your filters or search terms."
          actionText="Clear Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedDoctorFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 Columns: Transcripts List */}
          <div className="lg:col-span-4 space-y-3">
            {filteredTranscripts.map((tItem) => {
              const isSelected = selectedTranscript?.id === tItem.id;
              return (
                <div
                  key={tItem.id}
                  onClick={() => setSelectedTranscript(tItem)}
                  className={`p-4 rounded-3xl backdrop-blur-xl border transition-all cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/60 border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-blue-500/10'
                      : 'bg-white/75 dark:bg-slate-900/75 border-[#E2E8F0] dark:border-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100/80 dark:bg-blue-950/80 text-[#2563EB] font-bold flex items-center justify-center text-sm border border-blue-200/60 dark:border-blue-900/60">
                        DR
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {tItem.doctorName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">{tItem.doctorSpecialization}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {tItem.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3 font-medium">
                    {tItem.messages[0]?.text || "Consultation dialogue recorded."}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{tItem.date}</span>
                    </div>
                    <span className="font-semibold text-[#2563EB]">
                      {tItem.instructions.length} Instructions
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 8 Columns: Detailed Transcript Drawer / Viewer */}
          {selectedTranscript ? (
            <div className="lg:col-span-8 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-md p-6 sm:p-8 space-y-6">
              {/* Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#0EA5A4] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                    DR
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedTranscript.doctorName}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {selectedTranscript.doctorSpecialization}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                      <span>Date: {selectedTranscript.date}</span>
                      <span>•</span>
                      <span>Duration: {selectedTranscript.duration}</span>
                      <span>•</span>
                      <span className="font-bold text-teal-600">
                        Language: {selectedTranscript.language}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDownloadTranscript(selectedTranscript)}
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4 text-[#2563EB]" />}
                  >
                    {t('downloadTranscript')}
                  </Button>
                  <button
                    onClick={() =>
                      setDeleteTranscriptModal({
                        open: true,
                        transcriptId: selectedTranscript.id,
                      })
                    }
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title={t('deleteTranscript')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Extracted Key Instructions Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Key Medical Instructions Extracted ({selectedTranscript.instructions.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedTranscript.instructions.map((ins) => (
                    <div
                      key={ins.id}
                      className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <InstructionCategoryBadge category={ins.category} size="sm" />
                        <InstructionStatusBadge status={ins.status} size="sm" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                        {language === 'ta' && ins.tamilText ? ins.tamilText : ins.text}
                      </p>
                      {ins.tamilText && language === 'en' && (
                        <p className="text-[11px] text-teal-800 dark:text-teal-300 font-medium">
                          [தமிழ்]: {ins.tamilText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verbatim Dialogue Captions Archive */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#2563EB]" />
                  <span>Full Dialogue Transcript ({selectedTranscript.messages.length} messages)</span>
                </h3>

                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-[300px] overflow-y-auto space-y-3">
                  {selectedTranscript.messages.map((msg) => (
                    <div key={msg.id} className="text-xs space-y-1">
                      <div className="flex items-center gap-2 text-slate-400 font-medium">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {msg.speaker === 'doctor' ? selectedTranscript.doctorName : 'Patient (Meena)'}:
                        </span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-slate-900 dark:text-white text-sm font-medium pl-2 border-l-2 border-blue-400 dark:border-blue-600">
                        {language === 'ta' && msg.tamilText ? msg.tamilText : msg.text}
                      </p>
                      {msg.tamilText && language === 'en' && (
                        <p className="text-[11px] text-teal-700 dark:text-teal-300 pl-2 font-medium">
                          [தமிழ்]: {msg.tamilText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
