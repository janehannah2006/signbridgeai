import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { ConsultationStatusBadge } from '../common/Badge';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Pause,
  Play,
  Settings,
  Clock,
} from 'lucide-react';

export const ConsultationHeader: React.FC = () => {
  const {
    activeConsultation,
    pauseConsultation,
    resumeConsultation,
    setIsEndModalOpen,
    toggleMute,
    toggleCamera,
    setIsAccessibilityPanelOpen,
    t,
  } = useApp();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-[#E2E8F0] dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Doctor Info & Status */}
      <div className="flex items-center gap-3.5">
        <div className="relative">
          <img
            src={activeConsultation.doctor.avatar}
            alt={activeConsultation.doctor.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-200/80 dark:border-blue-900/80 shadow-md"
          />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
              {activeConsultation.doctor.name}
            </h2>
            <ConsultationStatusBadge status={activeConsultation.status} />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {activeConsultation.doctor.specialization} • {activeConsultation.doctor.hospital}
          </p>
        </div>
      </div>

      {/* Timer & Call Controls */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
        {/* Timer */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl font-mono text-sm font-bold text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{formatTimer(activeConsultation.timer)}</span>
        </div>

        {/* Mic toggle */}
        <button
          onClick={toggleMute}
          className={`p-2.5 rounded-xl border transition-all ${
            activeConsultation.isMuted
              ? 'bg-rose-50/90 border-rose-300 text-rose-600 dark:bg-rose-950/50 shadow-sm'
              : 'bg-white/80 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
          }`}
          title={activeConsultation.isMuted ? t('unmuteMic') : t('muteMic')}
          aria-label={activeConsultation.isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {activeConsultation.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Camera toggle */}
        <button
          onClick={toggleCamera}
          className={`p-2.5 rounded-xl border transition-all ${
            activeConsultation.isCameraOff
              ? 'bg-rose-50/90 border-rose-300 text-rose-600 dark:bg-rose-950/50 shadow-sm'
              : 'bg-white/80 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
          }`}
          title={activeConsultation.isCameraOff ? t('turnOnCamera') : t('turnOffCamera')}
          aria-label={activeConsultation.isCameraOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {activeConsultation.isCameraOff ? <VideoOff className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
        </button>

        {/* Pause/Resume consultation */}
        {activeConsultation.status === 'active' ? (
          <button
            onClick={pauseConsultation}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            title="Pause consultation"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : activeConsultation.status === 'paused' ? (
          <button
            onClick={resumeConsultation}
            className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
            title="Resume consultation"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : null}

        {/* Quick Accessibility Settings */}
        <button
          onClick={() => setIsAccessibilityPanelOpen(true)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
          title={t('accessibilityMode')}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* End Consultation */}
        <Button
          variant="danger"
          size="sm"
          leftIcon={<PhoneOff className="w-4 h-4" />}
          onClick={() => setIsEndModalOpen(true)}
        >
          {t('endConsultation')}
        </Button>
      </div>
    </div>
  );
};
