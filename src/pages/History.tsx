import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { ConsultationStatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import {
  History,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  Star,
  User,
  ArrowRight,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { consultations, t } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  const filteredHistory = consultations.filter((item) => {
    const matchesSearch =
      item.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDoctor =
      selectedDoctor === 'all' || item.doctor.name.includes(selectedDoctor);

    return matchesSearch && matchesDoctor;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="w-7 h-7 text-[#2563EB]" />
            <span>{t('tabHistory')} — Medical Consultation Log</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chronological audit of all past clinical consultations, recorded speech transcripts, and clinical summaries.
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
            placeholder="Search consultation history by doctor, hospital, date..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3.5 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Healthcare Providers</option>
            <option value="Ananya">Dr. Ananya Sharma</option>
            <option value="Rajesh">Dr. Rajesh Kumar</option>
            <option value="Priya">Dr. Priya Sundaram</option>
          </select>
        </div>
      </div>

      {/* Consultations Table / List */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="No Consultations Found"
          description="No consultation logs match your search filter."
          actionText="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setSelectedDoctor('all');
          }}
        />
      ) : (
        <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Doctor & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.doctor.avatar}
                    alt={item.doctor.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {item.doctor.name}
                      </h3>
                      <ConsultationStatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {item.doctor.specialization} • {item.doctor.hospital}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {item.duration}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-teal-600">
                        {item.language}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                  <Button
                    onClick={() => navigate('/transcripts')}
                    variant="outline"
                    size="sm"
                    leftIcon={<FileText className="w-4 h-4 text-[#2563EB]" />}
                  >
                    {t('viewTranscript')}
                  </Button>
                  <Button
                    onClick={() => navigate('/instructions')}
                    variant="outline"
                    size="sm"
                    leftIcon={<Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                  >
                    Instructions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
