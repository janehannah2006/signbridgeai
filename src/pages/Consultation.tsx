import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ConsultationHeader } from '../components/consultation/ConsultationHeader';
import { VideoPanel } from '../components/consultation/VideoPanel';
import { CaptionPanel } from '../components/consultation/CaptionPanel';
import { MessagePanel } from '../components/consultation/MessagePanel';
import { InstructionPanel } from '../components/consultation/InstructionPanel';
import {
  Captions,
  MessageSquare,
  Star,
} from 'lucide-react';

export const Consultation: React.FC = () => {
  const { activeConsultation, t } = useApp();
  const [activeTab, setActiveTab] = useState<'captions' | 'messages' | 'instructions'>('captions');

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col min-h-[600px]">
      {/* Consultation Header */}
      <ConsultationHeader />

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Column: Video & Doctor Speaking Stream (7 cols) */}
        <div className="lg:col-span-7 h-full flex flex-col min-h-0">
          <VideoPanel />
        </div>

        {/* Right Column: Interactive Tabs Panel (5 cols) */}
        <div className="lg:col-span-5 h-full flex flex-col min-h-0 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl border border-[#E2E8F0] dark:border-slate-800/80 overflow-hidden shadow-sm">
          {/* Tab Navigation Strip */}
          <div className="flex items-center border-b border-[#E2E8F0] dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-800/40 backdrop-blur-sm p-1.5 gap-1.5">
            <button
              onClick={() => setActiveTab('captions')}
              className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'captions'
                  ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Captions className="w-4 h-4" />
              <span>{t('tabCaptions')}</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'messages'
                  ? 'bg-white dark:bg-slate-900 text-[#2563EB] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('tabMessages')}</span>
            </button>

            <button
              onClick={() => setActiveTab('instructions')}
              className={`flex-1 py-2 px-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'instructions'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{t('tabInstructions')}</span>
              {activeConsultation.instructions.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Active Tab Body */}
          <div className="flex-1 min-h-0">
            {activeTab === 'captions' && <CaptionPanel />}
            {activeTab === 'messages' && <MessagePanel />}
            {activeTab === 'instructions' && <InstructionPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};
