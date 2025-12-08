import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export interface EventFiltersState {
  search: string;
  category: string;
  type: string;
  location: string;
  period: string;
}

interface EventFiltersBarProps {
  filters: EventFiltersState;
  onFilterChange: (filters: EventFiltersState) => void;
  resultsCount?: number;
}

const categoryOptions = [
  { value: 'all', label: 'Toate categoriile' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conferinta', label: 'Conferință' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'training', label: 'Training' },
  { value: 'networking', label: 'Networking' },
];

const typeOptions = [
  { value: 'all', label: 'Toate tipurile' },
  { value: 'fizic', label: 'Fizic' },
  { value: 'online', label: 'Online' },
  { value: 'hibrid', label: 'Hibrid' },
];

const locationOptions = [
  { value: '', label: 'Toate locațiile' },
  { value: 'Aula Magna', label: 'Aula Magna' },
  { value: 'Amfiteatrul Central', label: 'Amfiteatrul Central' },
  { value: 'Corp A', label: 'Corp A' },
  { value: 'Corp B', label: 'Corp B' },
  { value: 'Online', label: 'Online' },
];

const periodOptions = [
  { value: 'all', label: 'Oricând' },
  { value: 'today', label: 'Astăzi' },
  { value: 'week', label: 'Săptămâna aceasta' },
  { value: 'month', label: 'Luna aceasta' },
  { value: 'upcoming', label: 'Viitoare' },
];

const EventFiltersBar: React.FC<EventFiltersBarProps> = ({
  filters,
  onFilterChange,
  resultsCount
}) => {
  const handleChange = (key: keyof EventFiltersState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      type: 'all',
      location: '',
      period: 'all'
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.type !== 'all' ||
    filters.period !== 'all' || 
    filters.location;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4 sm:p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          type="text"
          placeholder="Caută evenimente..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Category Filter */}
        <div className="relative">
          <label className="block text-xs text-white/60 mb-1.5 ml-1">Categorie</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a4e] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <Filter size={14} className="absolute right-3 bottom-3 text-white/40 pointer-events-none" />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <label className="block text-xs text-white/60 mb-1.5 ml-1">Tip</label>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a4e] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <Filter size={14} className="absolute right-3 bottom-3 text-white/40 pointer-events-none" />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <label className="block text-xs text-white/60 mb-1.5 ml-1">Locație</label>
          <select
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a4e] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <Filter size={14} className="absolute right-3 bottom-3 text-white/40 pointer-events-none" />
        </div>

        {/* Period Filter */}
        <div className="relative">
          <label className="block text-xs text-white/60 mb-1.5 ml-1">Perioadă</label>
          <select
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a4e] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <Filter size={14} className="absolute right-3 bottom-3 text-white/40 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              hasActiveFilters
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <X size={16} />
              Resetează
            </span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-white/60">
            {resultsCount === 0 ? (
              'Nu s-au găsit evenimente'
            ) : resultsCount === 1 ? (
              '1 eveniment găsit'
            ) : (
              <>{resultsCount} evenimente găsite</>
            )}
            {hasActiveFilters && (
              <span className="text-[#4ECDC4] ml-1">
                (filtre active)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventFiltersBar;
