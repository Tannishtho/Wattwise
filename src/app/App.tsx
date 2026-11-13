import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileNavigation } from '../components/layout/MobileNavigation';
import { BabaToast } from '../components/bijli-baba/BabaToast';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background text-primaryText antialiased">
      {/* Desktop Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navigation */}
        <MobileNavigation />

        {/* Global Header */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col">
          <AppRoutes />
        </main>
      </div>

      {/* Floating Contextual Assistant Toast */}
      <BabaToast />
    </div>
  );
};
