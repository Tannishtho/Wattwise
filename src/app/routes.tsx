import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '../pages/DashboardPage';
import { AppliancesPage } from '../pages/AppliancesPage';
import { BudgetPage } from '../pages/BudgetPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { RecommendationsPage } from '../pages/RecommendationsPage';
import { EmergencyPage } from '../pages/EmergencyPage';
import { SettingsPage } from '../pages/SettingsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/appliances" element={<AppliancesPage />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
