import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Badge, InstructionCategoryBadge, InstructionStatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import {
  Star,
  Search,
  Filter,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  Calendar,
  Pill,
  Activity,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { InstructionCategory, InstructionStatus } from '../types';

export const InstructionsPage: React.FC = () => {
  const {
    instructions,
    speakText,
    language,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Instructions', icon: <Star className="w-4 h-4" /> },
    { key: 'medication', label: 'Medications', icon: <Pill className="w-4 h-4" /> },
    { key: 'follow-up', label: 'Follow-ups', icon: <Calendar className="w-4 h-4" /> },
    { key: 'tests', label: 'Tests & Scans', icon: <Activity className="w-4 h-4" /> },
    { key: 'lifestyle', label: 'Lifestyle & Diet', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'warnings', label: 'Precautions', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const filteredInstructions = instructions.filter((ins) => {
    const matchesSearch =
      ins.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ins.tamilText && ins.tamilText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ins.doctorName && ins.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || ins.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || ins.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>{t('tabInstructions')} — Medical Action Plan</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified medications, follow-up dates, diagnostic tests, and health guidelines extracted from your consultations.
          </p>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4.5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 backdrop-blur-xl border border-amber-300/80 dark:border-amber-800/80 flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <span className="font-extrabold">{t('dosageWarning')}</span>
          <p className="mt-0.5 opacity-90 font-medium">
            SignBridge strictly extracts verbatim clinical recommendations. Always verify unconfirmed instructions directly with your prescribing physician.
          </p>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-[#E2E8F0] dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Status Dropdown */}
        <div className="p-4 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instructions (e.g., 'Paracetamol', 'diet', 'blood test')..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Verification Statuses</option>
              <option value="confirmed">Confirmed by Doctor</option>
              <option value="needs_confirmation">Needs Confirmation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Instructions Grid */}
      {filteredInstructions.length === 0 ? (
        <EmptyState
          icon={<Star className="w-8 h-8 text-amber-500" />}
          title="No Instructions Found"
          description="No medical instructions match the selected filters or search terms."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInstructions.map((ins) => (
            <div
              key={ins.id}
              className={`p-5 rounded-3xl backdrop-blur-xl border shadow-sm transition-all flex flex-col justify-between ${
                ins.status === 'confirmed'
                  ? 'bg-white/75 dark:bg-slate-900/75 border-[#E2E8F0] dark:border-slate-800/80 hover:border-slate-300'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/80'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <InstructionCategoryBadge category={ins.category} size="md" />
                  <InstructionStatusBadge status={ins.status} size="sm" />
                </div>

                {/* Instruction Text */}
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-relaxed">
                  {language === 'ta' && ins.tamilText ? ins.tamilText : ins.text}
                </h3>

                {/* Tamil Bilingual Translation */}
                {ins.tamilText && language === 'en' && (
                  <div className="p-3 bg-teal-50/80 dark:bg-teal-950/40 rounded-2xl border border-teal-200/80 dark:border-teal-800/60 text-xs text-teal-950 dark:text-teal-200 font-medium">
                    <span className="font-bold text-teal-800 dark:text-teal-300 mr-1">
                      [தமிழ்]:
                    </span>
                    {ins.tamilText}
                  </div>
                )}
              </div>

              {/* Footer with Doctor info and Speak Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    {ins.doctorName || 'Dr. Ananya Sharma'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {ins.timestamp}
                  </div>
                </div>

                <button
                  onClick={() => speakText(ins.text)}
                  className="p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                  title="Read aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
