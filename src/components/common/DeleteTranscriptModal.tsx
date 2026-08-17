import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteTranscriptModal: React.FC = () => {
  const {
    deleteTranscriptModal,
    setDeleteTranscriptModal,
    deleteTranscript,
    t,
  } = useApp();

  const handleConfirm = () => {
    if (deleteTranscriptModal.transcriptId) {
      deleteTranscript(deleteTranscriptModal.transcriptId);
    }
  };

  return (
    <Modal
      isOpen={deleteTranscriptModal.open}
      onClose={() => setDeleteTranscriptModal({ open: false })}
      title={t('confirmDeleteTitle')}
      maxWidth="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => setDeleteTranscriptModal({ open: false })}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleConfirm}
          >
            {t('deleteConfirm')}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-900 dark:text-rose-200 text-sm">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
        <p>{t('confirmDeleteDesc')}</p>
      </div>
    </Modal>
  );
};
