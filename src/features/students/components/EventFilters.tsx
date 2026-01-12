// src/features/student/components/EventFilters.tsx

import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { EventFilters as FilterType } from "../../../types/student";
import { studentEventsService } from "../services/eventsService";
import "./EventFilters.css";

interface EventFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  resultsCount?: number;
}

type Option<T extends string = string> = { value: T; label: string };

const periodOptions: Option<FilterType["period"]>[] = [
  { value: "all", label: "Oricând" },
  { value: "today", label: "Astăzi" },
  { value: "this_week", label: "Săptămâna aceasta" },
  { value: "this_month", label: "Luna aceasta" },
];

const EventFilters: React.FC<EventFiltersProps> = ({
  filters,
  onFilterChange,
  resultsCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // State pentru opțiuni dinamice
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        // 1. Locații unice
        const locations = await studentEventsService.getUniqueLocations();
        setLocationOptions(locations);

        // 2. Tipuri Evenimente (Categorii) - Mock sau din API
        setCategoryOptions([
          { value: "all", label: "Toate categoriile" },
          { value: "1", label: "Conferință" },
          { value: "2", label: "Workshop" },
          { value: "3", label: "Social" },
          { value: "4", label: "Academic" },
          { value: "5", label: "Carieră" },
          { value: "6", label: "Sportiv" },
          { value: "7", label: "Voluntariat" },
          { value: "8", label: "Cultural" },
        ]);
      } catch (e) {
        console.error("Failed to load filter options", e);
      }
    };
    loadOptions();
  }, []);

  const handleChange = <K extends keyof FilterType>(
    key: K,
    value: FilterType[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      category: "all",
      period: "all",
      location: "",
      faculty: "",
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    (filters.period !== "all" && filters.period !== "upcoming") ||
    !!filters.location;

  const activeFilterCount = [
    filters.category !== "all",
    filters.period !== "all" && filters.period !== "upcoming",
    filters.location !== "",
  ].filter(Boolean).length;

  return (
    <div className="student-filters-bar">
      {/* Header: Search + Filter Toggle */}
      <div className="student-filters-header">
        <div className="student-filters-search-wrapper">
          <Search size={16} className="student-filters-search-icon" />
          <input
            type="text"
            placeholder="Caută evenimente, organizatori, facultăți..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="student-filters-search-input"
          />
          {filters.search && (
            <button
              onClick={() => handleChange("search", "")}
              className="student-filters-clear-search"
              type="button"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`student-filters-toggle-btn ${isOpen ? "active" : ""}`}
          type="button"
        >
          <SlidersHorizontal size={14} />
          <span>Filtre</span>
          {activeFilterCount > 0 && (
            <span className="badge">{activeFilterCount}</span>
          )}
          <ChevronDown
            size={12}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      <div className={`student-filters-panel ${isOpen ? "open" : ""}`}>
        <div className="student-filters-grid">
          {/* Category */}
          <div className="student-filters-item">
            <label className="student-filters-label">Categorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleChange("category", e.target.value as any)}
              className="student-filters-select"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="student-filters-item">
            <label className="student-filters-label">Perioadă</label>
            <select
              value={filters.period}
              onChange={(e) => handleChange("period", e.target.value as any)}
              className="student-filters-select"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location - Dinamic */}
          <div className="student-filters-item">
            <label className="student-filters-label">Locație</label>
            <select
              value={filters.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="student-filters-select"
            >
              <option value="">Toate locațiile</option>
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div
            className="student-filters-item"
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`student-filters-reset-btn ${
                hasActiveFilters ? "active" : "inactive"
              }`}
              type="button"
            >
              <X size={10} />
              Resetează
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {resultsCount !== undefined && (hasActiveFilters || !!filters.search) && (
        <div className="student-filters-results">
          {resultsCount === 0
            ? "Nu s-au găsit evenimente"
            : resultsCount === 1
            ? "1 eveniment găsit"
            : `${resultsCount} evenimente găsite`}
          {hasActiveFilters && (
            <span className="highlight"> (filtre active)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default EventFilters;
