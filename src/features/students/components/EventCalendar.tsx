import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { StudentEvent, CalendarDay } from "../../../types/student";

interface EventCalendarProps {
  events: StudentEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const DAYS_OF_WEEK_SHORT = ["L", "M", "M", "J", "V", "S", "D"];
const DAYS_OF_WEEK_FULL = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];
const MONTHS = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  selectedDate,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(selectedDate);

  const getEventsForDate = (date: Date): StudentEvent[] => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((event) => event.date.startsWith(dateStr));
  };

  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        events: getEventsForDate(date),
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date),
      });
    }
    return days;
  }, [currentDate, events]);

  const handleDateClick = (day: CalendarDay) => {
    setSelected(day.date);
    onDateSelect?.(day.date);
  };

  const isSelected = (date: Date) =>
    selected?.toDateString() === date.toDateString();

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1040]/30">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-bold text-white tracking-wide">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Zile Săptămână */}
      <div className="grid grid-cols-7 border-b border-white/5 bg-[#1a1040]/20">
        {DAYS_OF_WEEK_FULL.map((day, idx) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-white/40 uppercase tracking-wider"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{DAYS_OF_WEEK_SHORT[idx]}</span>
          </div>
        ))}
      </div>

      {/* Grid Calendar */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const hasEvents = day.events.length > 0;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative min-h-[60px] sm:min-h-[80px] p-2 border-b border-r border-white/5 transition-all duration-200 flex flex-col items-center justify-start gap-1.5
                ${
                  !day.isCurrentMonth
                    ? "opacity-20 bg-black/10"
                    : "hover:bg-white/5"
                }
                ${
                  isSelected(day.date)
                    ? "bg-[#6366f1]/10 shadow-[inset_0_0_20px_rgba(99,102,241,0.15)]"
                    : ""
                }
              `}
            >
              <span
                className={`
                  inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full transition-all
                  ${
                    day.isToday
                      ? "bg-[#6366f1] text-white shadow-lg shadow-indigo-500/40 scale-110"
                      : isSelected(day.date)
                      ? "text-[#6366f1] font-bold"
                      : "text-white/70"
                  }
                `}
              >
                {day.date.getDate()}
              </span>

              {/* ✅ INDICATORI VIZUALI (Buline) - Fără text */}
              {hasEvents && (
                <div className="flex gap-1 flex-wrap justify-center content-center max-w-[80%]">
                  {day.events.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className={`
                        w-1.5 h-1.5 rounded-full shadow-sm
                        ${
                          event.isEnrolled
                            ? "bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.6)]"
                            : "bg-indigo-400/80"
                        }
                      `}
                      title={event.title}
                    />
                  ))}
                  {day.events.length > 5 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventCalendar;
