import React, { useState, useEffect } from 'react';
import { X, Cpu, AlertCircle } from 'lucide-react';
import { Appliance, EssentialityLevel, ComfortLevel, ApplianceCategory } from '../../types/appliance';
import { validateWattage, validateOperatingHours } from '../../utils/validation';

interface ApplianceModalProps {
  isOpen: boolean;
  appliance: Appliance | null; // null if adding new custom appliance
  onClose: () => void;
  onSave: (data: Omit<Appliance, 'id' | 'isCustom'> | Partial<Appliance>) => void;
}

export const ApplianceModal: React.FC<ApplianceModalProps> = ({
  isOpen,
  appliance,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(appliance);

  const [name, setName] = useState('');
  const [ratedPowerWatts, setRatedPowerWatts] = useState<number>(100);
  const [dailyOperatingHours, setDailyOperatingHours] = useState<number>(4);
  const [essentiality, setEssentiality] = useState<EssentialityLevel>('ESSENTIAL');
  const [comfort, setComfort] = useState<ComfortLevel>('MEDIUM');
  const [category, setCategory] = useState<ApplianceCategory>('UTILITY');
  const [location, setLocation] = useState('Living Room');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (appliance) {
      setName(appliance.name);
      setRatedPowerWatts(appliance.ratedPowerWatts);
      setDailyOperatingHours(appliance.dailyOperatingHours);
      setEssentiality(appliance.essentiality);
      setComfort(appliance.comfort);
      setCategory(appliance.category);
      setLocation(appliance.location || 'General');
      setDescription(appliance.description || '');
    } else {
      setName('');
      setRatedPowerWatts(150);
      setDailyOperatingHours(4);
      setEssentiality('OPTIONAL');
      setComfort('MEDIUM');
      setCategory('UTILITY');
      setLocation('Living Room');
      setDescription('');
    }
    setErrorMessage(null);
  }, [appliance, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Appliance name cannot be blank.');
      return;
    }

    const vWatts = validateWattage(Number(ratedPowerWatts));
    if (!vWatts.isValid) {
      setErrorMessage(vWatts.error || 'Invalid power rating.');
      return;
    }

    const vHours = validateOperatingHours(Number(dailyOperatingHours));
    if (!vHours.isValid) {
      setErrorMessage(vHours.error || 'Invalid daily operating hours.');
      return;
    }

    onSave({
      name: name.trim(),
      ratedPowerWatts: Number(ratedPowerWatts),
      dailyOperatingHours: Number(dailyOperatingHours),
      essentiality,
      comfort,
      category,
      location,
      description,
      iconName: appliance?.iconName || 'Cpu',
      isOn: appliance?.isOn ?? true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-white/10 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-secondaryText hover:text-primaryText rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald/10 text-emerald">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-primaryText">
              {isEditing ? `Edit Appliance: ${appliance?.name}` : 'Add Custom Household Appliance'}
            </h3>
            <p className="text-xs text-secondaryText">
              Set electrical specifications and operational duty cycle
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-danger/15 border border-danger/40 flex items-center gap-2.5 text-xs text-danger">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
              Appliance Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Microwave Oven, Geyser, Desktop PC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Rated Power (Watts)
              </label>
              <input
                type="number"
                value={ratedPowerWatts}
                onChange={(e) => setRatedPowerWatts(Number(e.target.value))}
                min={1}
                max={10000}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">e.g. 75W (Fan), 1500W (AC)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Daily Hours (0 - 24)
              </label>
              <input
                type="number"
                step="0.5"
                value={dailyOperatingHours}
                onChange={(e) => setDailyOperatingHours(Number(e.target.value))}
                min={0}
                max={24}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
                required
              />
              <span className="text-[10px] text-secondaryText mt-1 block">Avg daily runtime</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Essentiality Level
              </label>
              <select
                value={essentiality}
                onChange={(e) => setEssentiality(e.target.value as EssentialityLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              >
                <option value="CRITICAL">Critical (Life-support/Fridge)</option>
                <option value="ESSENTIAL">Essential (Fan/Lights)</option>
                <option value="OPTIONAL">Optional / Luxury (AC/TV)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Comfort Importance
              </label>
              <select
                value={comfort}
                onChange={(e) => setComfort(e.target.value as ComfortLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              >
                <option value="HIGH">High Comfort</option>
                <option value="MEDIUM">Medium Comfort</option>
                <option value="LOW">Low Comfort</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ApplianceCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              >
                <option value="CLIMATE">Climate (AC, Fan, Heater)</option>
                <option value="PRESERVATION">Food Preservation (Fridge)</option>
                <option value="LIGHTING">Lighting (LED, Bulbs)</option>
                <option value="ENTERTAINMENT">Entertainment (TV, Audio)</option>
                <option value="CLEANING">Cleaning (Washing Machine)</option>
                <option value="UTILITY">Utility / Kitchen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondaryText uppercase tracking-wider mb-1.5">
                Room Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Living Room, Bedroom, Kitchen..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/50 border border-white/10 text-sm text-primaryText focus:outline-none focus:border-emerald"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-white/5 hover:bg-white/10 text-primaryText"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald hover:bg-emerald/90 text-black shadow-glow"
            >
              {isEditing ? 'Save Changes' : 'Create Appliance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
