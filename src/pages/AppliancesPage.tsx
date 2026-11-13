import React, { useState } from 'react';
import {
  Plus,
  Power,
  Edit2,
  Trash2,
  Wind,
  Refrigerator,
  Fan,
  Tv,
  Shirt,
  Lightbulb,
  Cpu,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { ApplianceModal } from '../components/appliances/ApplianceModal';
import { Appliance } from '../types/appliance';
import { formatINR } from '../utils/currency';
import { formatPower, formatHours } from '../utils/formatting';
import { calculateDailyKWh, calculateMonthlyKWh, calculateMonthlyCostINR } from '../engines/calculationEngine';

export const AppliancesPage: React.FC = () => {
  const {
    appliances,
    settings,
    toggleAppliance,
    updateAppliance,
    addAppliance,
    removeAppliance,
  } = useApp();

  const [selectedApplianceForEdit, setSelectedApplianceForEdit] = useState<Appliance | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applianceToDelete, setApplianceToDelete] = useState<Appliance | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Helper to map icon names to Lucide icons
  const getApplianceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'wind':
        return Wind;
      case 'refrigerator':
        return Refrigerator;
      case 'fan':
        return Fan;
      case 'tv':
        return Tv;
      case 'shirt':
        return Shirt;
      case 'lightbulb':
        return Lightbulb;
      default:
        return Cpu;
    }
  };

  const handleEditClick = (appliance: Appliance) => {
    setSelectedApplianceForEdit(appliance);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedApplianceForEdit(null);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data: Omit<Appliance, 'id' | 'isCustom'> | Partial<Appliance>) => {
    if (selectedApplianceForEdit) {
      updateAppliance(selectedApplianceForEdit.id, data);
    } else {
      addAppliance(data as Omit<Appliance, 'id' | 'isCustom'>);
    }
  };

  const handleConfirmDelete = () => {
    if (applianceToDelete) {
      removeAppliance(applianceToDelete.id);
      setApplianceToDelete(null);
    }
  };

  // Filter appliances
  const filteredAppliances = appliances.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.location && a.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalCapacityWatts = appliances.reduce((sum, a) => sum + a.ratedPowerWatts, 0);
  const activeLoadWatts = appliances
    .filter((a) => a.isOn)
    .reduce((sum, a) => sum + a.ratedPowerWatts, 0);

  return (
    <PageContainer
      title="Appliance Management"
      subtitle="Configure electrical ratings, daily duty cycle hours, and operational classifications across all household equipment."
      action={
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald hover:bg-emerald/90 text-black font-bold text-xs shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Appliance</span>
        </button>
      }
    >
      {/* Telemetry Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Installed Capacity
            </span>
            <span className="text-xl font-heading font-bold text-primaryText">
              {formatPower(totalCapacityWatts)}
            </span>
          </div>
          <span className="text-xs text-secondaryText">{appliances.length} appliances</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-emerald/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Active Power Draw
            </span>
            <span className="text-xl font-heading font-bold text-emerald">
              {formatPower(activeLoadWatts)}
            </span>
          </div>
          <span className="text-xs font-semibold text-emerald">
            {appliances.filter((a) => a.isOn).length} currently active
          </span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-secondaryText block uppercase tracking-wider">
              Demonstration Tariff
            </span>
            <span className="text-xl font-heading font-bold text-primaryText">
              ₹{settings.electricityTariffINR}/kWh
            </span>
          </div>
          <span className="text-xs text-secondaryText">{settings.billingCycleDays} billing days</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-secondaryText absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search appliance or room..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/40 border border-white/10 text-xs text-primaryText focus:outline-none focus:border-emerald"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-secondaryText" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-secondary/40 border border-white/10 text-xs text-primaryText focus:outline-none focus:border-emerald"
          >
            <option value="ALL">All Categories</option>
            <option value="CLIMATE">Climate</option>
            <option value="PRESERVATION">Food Preservation</option>
            <option value="LIGHTING">Lighting</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="CLEANING">Cleaning</option>
            <option value="UTILITY">Utility</option>
          </select>
        </div>
      </div>

      {/* Appliances Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAppliances.map((appliance) => {
          const Icon = getApplianceIcon(appliance.iconName);
          const dailyKWh = calculateDailyKWh(
            appliance.ratedPowerWatts,
            appliance.dailyOperatingHours
          );
          const monthlyKWh = calculateMonthlyKWh(
            appliance.ratedPowerWatts,
            appliance.dailyOperatingHours,
            settings.billingCycleDays
          );
          const monthlyCost = calculateMonthlyCostINR(monthlyKWh, settings.electricityTariffINR);

          return (
            <div
              key={appliance.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                appliance.isOn
                  ? 'border-emerald/30 bg-[#141F30]'
                  : 'border-white/5 bg-[#141F30]/60 opacity-75'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        appliance.isOn
                          ? 'bg-emerald/15 text-emerald border border-emerald/30 shadow-glow'
                          : 'bg-white/5 text-secondaryText border border-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-heading font-bold text-primaryText flex items-center gap-2">
                        {appliance.name}
                        {appliance.isCustom && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-secondaryText">
                            Custom
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-secondaryText">
                        {appliance.location || 'Household'}
                      </span>
                    </div>
                  </div>

                  {/* Power Toggle Switch */}
                  <button
                    onClick={() => toggleAppliance(appliance.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      appliance.isOn
                        ? 'bg-emerald text-black shadow-glow'
                        : 'bg-white/10 text-secondaryText hover:text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{appliance.isOn ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Rating & Operational Specs */}
                <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-secondary/30 border border-white/5">
                  <div>
                    <span className="text-[10px] text-secondaryText block uppercase">Power Rating</span>
                    <span className="text-sm font-heading font-bold text-primaryText">
                      {formatPower(appliance.ratedPowerWatts)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondaryText block uppercase">Daily Runtime</span>
                    <span className="text-sm font-heading font-bold text-primaryText">
                      {formatHours(appliance.dailyOperatingHours)}
                    </span>
                  </div>
                </div>

                {/* Classification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <StatusBadge type="essentiality" value={appliance.essentiality} />
                  <StatusBadge type="comfort" value={appliance.comfort} />
                  <StatusBadge type="powerStatus" value={appliance.isOn ? 'ON' : 'OFF'} />
                </div>
              </div>

              {/* Energy Calculation Metrics Footer */}
              <div className="pt-3 border-t border-white/5">
                <div className="grid grid-cols-3 gap-1 text-center py-2 mb-3 bg-black/20 rounded-lg">
                  <div>
                    <span className="text-[10px] text-secondaryText block">Daily kWh</span>
                    <span className="text-xs font-bold text-primaryText">{dailyKWh.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondaryText block">Monthly kWh</span>
                    <span className="text-xs font-bold text-primaryText">{monthlyKWh.toFixed(1)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-secondaryText block">Monthly Cost</span>
                    <span className="text-xs font-bold text-emerald">{formatINR(monthlyCost)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    onClick={() => handleEditClick(appliance)}
                    className="flex items-center gap-1.5 text-secondaryText hover:text-emerald transition-colors font-medium"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Specs</span>
                  </button>

                  {appliance.isCustom && (
                    <button
                      onClick={() => setApplianceToDelete(appliance)}
                      className="flex items-center gap-1.5 text-danger/80 hover:text-danger transition-colors font-medium"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      <ApplianceModal
        isOpen={isModalOpen}
        appliance={selectedApplianceForEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
      />

      {/* Confirmation Modal for Removing Appliance */}
      <ConfirmationModal
        isOpen={Boolean(applianceToDelete)}
        title={`Remove ${applianceToDelete?.name}?`}
        message={`Are you sure you want to delete this custom appliance? All associated historical projections and simulation metrics will be removed.`}
        confirmLabel="Delete Appliance"
        cancelLabel="Keep Appliance"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setApplianceToDelete(null)}
      />
    </PageContainer>
  );
};
