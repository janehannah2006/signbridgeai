import React from 'react';
import { InstructionCategory, InstructionStatus, ConsultationStatus } from '../../types';
import { CheckCircle2, AlertTriangle, Pill, Calendar, Activity, ShieldAlert, Sparkles, FileText } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm font-semibold gap-1.5',
    lg: 'px-3 py-1.5 text-sm font-bold gap-2',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700',
    warning: 'bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700',
    danger: 'bg-rose-50 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-700',
    info: 'bg-blue-50 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700',
    teal: 'bg-teal-50 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-700',
    neutral: 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    primary: 'bg-blue-600 text-white shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export const InstructionCategoryBadge: React.FC<{ category: InstructionCategory; size?: 'sm' | 'md' }> = ({
  category,
  size = 'md',
}) => {
  switch (category) {
    case 'medication':
      return (
        <Badge variant="primary" size={size} icon={<Pill className="w-3.5 h-3.5" />}>
          Medication
        </Badge>
      );
    case 'follow-up':
      return (
        <Badge variant="teal" size={size} icon={<Calendar className="w-3.5 h-3.5" />}>
          Follow-up
        </Badge>
      );
    case 'tests':
      return (
        <Badge variant="info" size={size} icon={<Activity className="w-3.5 h-3.5" />}>
          Tests & Scans
        </Badge>
      );
    case 'lifestyle':
      return (
        <Badge variant="success" size={size} icon={<Sparkles className="w-3.5 h-3.5" />}>
          Lifestyle & Diet
        </Badge>
      );
    case 'warnings':
      return (
        <Badge variant="danger" size={size} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
          Precaution / Warning
        </Badge>
      );
    case 'appointments':
      return (
        <Badge variant="warning" size={size} icon={<Calendar className="w-3.5 h-3.5" />}>
          Appointment
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} icon={<FileText className="w-3.5 h-3.5" />}>
          General
        </Badge>
      );
  }
};

export const InstructionStatusBadge: React.FC<{ status: InstructionStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  if (status === 'confirmed') {
    return (
      <Badge variant="success" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}>
        Confirmed by Doctor
      </Badge>
    );
  }
  return (
    <Badge variant="warning" size={size} icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}>
      Needs Confirmation
    </Badge>
  );
};

export const ConsultationStatusBadge: React.FC<{ status: ConsultationStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="success" size={size} icon={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}>
          Active Consultation
        </Badge>
      );
    case 'connecting':
      return (
        <Badge variant="warning" size={size} icon={<span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}>
          Connecting...
        </Badge>
      );
    case 'paused':
      return (
        <Badge variant="neutral" size={size} icon={<span className="w-2 h-2 rounded-full bg-slate-400" />}>
          Paused
        </Badge>
      );
    case 'ended':
    case 'completed':
      return (
        <Badge variant="neutral" size={size} icon={<CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />}>
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size}>
          Idle
        </Badge>
      );
  }
};
