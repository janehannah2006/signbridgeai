import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { PhoneOff, Save, AlertCircle } from 'lucide-react';

export const EndConsultationModal: React.FC = () => {
  const {
    isEndModalOpen,
    setIsEndModalOpen,
    endConsultation,
    activeConsultation,
    t,
  } = useApp();

  const handleConfirmEnd = (save: boolean) => {
    endConsultation(save);
  };

  return (
    <Modal
      isOpen={isEndModalOpen}
      onClose={() => setIsEndModalOpen(false)}
      title={t('confirmEndTitle')}
      subtitle={`Doctor: ${activeConsultation.doctor.name}`}
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => setIsEndModalOpen(false)}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            leftIcon={<Save className="w-4 h-4" />}
            onClick={() => handleConfirmEnd(true)}
          >
            {t('confirmEnd')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <p>{t('confirmEndDesc')}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Live Captions Captured:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {activeConsultation.captions.length} statements
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Detected Medical Instructions:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {activeConsultation.instructions.length} items
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Messages Exchanged:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {activeConsultation.messages.length} messages
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
