import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { EventFilters as FilterType, categoryOptions, periodOptions, locationOptions } from '../../../types/student';

interface EventFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  resultsCount?: number;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFilterChange,
  resultsCount
}) => {
  const handleChange = (key: keyof FilterType, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      period: 'all',
      location: '',
      faculty: ''
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.period !== 'all' || 
    filters.location;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Caută evenimente..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category Filter */}
        <div className="relative">
          <label className="block text-xs text-white/60 mb-1.5 ml-1">Categorie</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {categoryOptions.map((option) => (
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
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {periodOptions.map((option) => (
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
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer"
          >
            {locationOptions.map((location) => (
              <option key={location} value={location === 'Toate locațiile' ? '' : location} className="bg-[#1a1a4e] text-white">
                {location}
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
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <X size={16} />
              Resetează filtrele
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

export default EventFilters;
