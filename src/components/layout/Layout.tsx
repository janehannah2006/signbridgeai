import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { AccessibilityPanel } from '../accessibility/AccessibilityPanel';
import { AccessibilityToggle } from '../accessibility/AccessibilityToggle';
import { ToastContainer } from '../common/ToastContainer';
import { EndConsultationModal } from '../common/EndConsultationModal';
import { DeleteTranscriptModal } from '../common/DeleteTranscriptModal';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-200 relative overflow-x-hidden">
      {/* Background Ambient Glows for Frosted Glass Depth */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Global Modals & Floating Tools */}
      <AccessibilityToggle />
      <AccessibilityPanel />
      <ToastContainer />
      <EndConsultationModal />
      <DeleteTranscriptModal />
    </div>
  );
};
