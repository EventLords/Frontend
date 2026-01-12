import React, { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import "./EventFiltersBar.css";

export interface EventFiltersState {
  search: string;
  category: string;
  location: string;
  period: string;
}

interface EventFiltersBarProps {
  filters: EventFiltersState;
  onFilterChange: (filters: EventFiltersState) => void;
  resultsCount?: number;
  availableLocations?: string[];
}

// ✅ Corrected: Using IDs for values because eventsService maps 'category' to 'typeId' param
const categoryOptions = [
  { value: "all", label: "Toate categoriile" },
  { value: "1", label: "Conferință" },
  { value: "2", label: "Workshop" },
  { value: "3", label: "Social" },
  { value: "4", label: "Academic" },
  { value: "5", label: "Carieră" },
  { value: "6", label: "Sportiv" },
  { value: "7", label: "Voluntariat" },
  { value: "8", label: "Cultural" },
];

const periodOptions = [
  { value: "all", label: "Oricând" },
  { value: "today", label: "Astăzi" },
  { value: "this_week", label: "Săptămâna aceasta" },
  { value: "this_month", label: "Luna aceasta" },
];

const EventFiltersBar: React.FC<EventFiltersBarProps> = ({
  filters,
  onFilterChange,
  resultsCount,
  availableLocations = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: keyof EventFiltersState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "all",
      location: "all",
      period: "upcoming",
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.period !== "upcoming" ||
    filters.location !== "all" ||
    filters.search !== "";

  const activeFilterCount = [
    filters.category !== "all",
    filters.period !== "upcoming",
    filters.location !== "all",
  ].filter(Boolean).length;

  return (
    <div className="filters-bar">
      {/* Header: Search + Filter Toggle */}
      <div className="filters-bar-header">
        <div className="filters-search-wrapper">
          <Search size={18} className="filters-search-icon" />
          <input
            type="text"
            placeholder="Caută evenimente..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="filters-search-input"
          />
          {filters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="filters-clear-search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`filters-toggle-btn ${isOpen ? "active" : ""}`}
        >
          <SlidersHorizontal size={16} />
          <span>Filtre</span>
          {activeFilterCount > 0 && (
            <span className="badge">{activeFilterCount}</span>
          )}
          <ChevronDown
            size={14}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      <div className={`filters-panel ${isOpen ? "open" : ""}`}>
        <div className="filters-grid">
          {/* Category Dropdown */}
          <div className="filters-item">
            <label className="filters-label">Categorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="filters-select"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown - Dynamic */}
          <div className="filters-item">
            <label className="filters-label">Locație</label>
            <select
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="filters-select"
            >
              <option value="all">Toate locațiile</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Period Dropdown */}
          <div className="filters-item">
            <label className="filters-label">Perioadă</label>
            <select
              value={filters.period}
              onChange={(e) => handleChange("period", e.target.value)}
              className="filters-select"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div
            className="filters-item"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`filters-reset-btn ${
                hasActiveFilters ? "active" : "inactive"
              }`}
            >
              <X size={12} />
              Resetează
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (hasActiveFilters || filters.search) && (
        <div className="filters-results">
          {resultsCount === 0 ? (
            "Nu s-au găsit evenimente"
          ) : resultsCount === 1 ? (
            "1 eveniment găsit"
          ) : (
            <>{resultsCount} evenimente găsite</>
          )}
          {hasActiveFilters && (
            <span className="highlight"> (filtre active)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EventFiltersBar;
