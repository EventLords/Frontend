import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { StudentEvent, CalendarDay } from '../../../types/student';
import { Link } from 'react-router-dom';

interface EventCalendarProps {
  events: StudentEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const DAYS_OF_WEEK_SHORT = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAYS_OF_WEEK_FULL = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];
const MONTHS = [
  'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
  'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
];

const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  selectedDate,
  onDateSelect
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(selectedDate);

  // Generate calendar days for current month
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date)
      });
    }
    
    // Current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        events: getEventsForDate(date)
      });
    }
    
    // Next month days (to fill the grid)
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: getEventsForDate(date)
      });
    }
    
    return days;
  }, [currentDate, events]);

  const getEventsForDate = (date: Date): StudentEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelected(day.date);
    onDateSelect?.(day.date);
  };

  const isSelected = (date: Date) => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  // Get events for selected date
  const selectedDateEvents = selected ? getEventsForDate(selected) : [];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button
          onClick={handlePrevMonth}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-white/10">
        {DAYS_OF_WEEK_FULL.map((day, idx) => (
          <div
            key={day}
            className="py-2 sm:py-3 text-center text-xs font-medium text-white/60"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{DAYS_OF_WEEK_SHORT[idx]}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const hasEvents = day.events.length > 0;
          const hasEnrolledEvent = day.events.some(e => e.isEnrolled);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative min-h-[48px] sm:min-h-[80px] p-1 sm:p-2 border-b border-r border-white/5 transition-colors
                ${!day.isCurrentMonth ? 'opacity-30' : ''}
                ${day.isToday ? 'bg-[#4ECDC4]/10' : ''}
                ${isSelected(day.date) ? 'bg-[#4ECDC4]/20 ring-2 ring-[#4ECDC4]/50 ring-inset' : 'hover:bg-white/5'}
              `}
            >
              {/* Date Number */}
              <span className={`
                inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm font-medium rounded-full
                ${day.isToday ? 'bg-[#4ECDC4] text-white' : 'text-white/80'}
              `}>
                {day.date.getDate()}
              </span>

              {/* Event Indicators */}
              {hasEvents && (
                <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 space-y-0.5 sm:space-y-1">
                  {/* On mobile, just show dots */}
                  <div className="sm:hidden flex gap-0.5 justify-center">
                    {day.events.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={`w-1.5 h-1.5 rounded-full ${event.isEnrolled ? 'bg-green-400' : 'bg-blue-400'}`}
                      />
                    ))}
                  </div>
                  {/* On desktop, show event names */}
                  <div className="hidden sm:block space-y-1">
                    {day.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`
                          text-[10px] px-1.5 py-0.5 rounded truncate
                          ${event.isEnrolled 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                          }
                        `}
                      >
                        {event.name}
                      </div>
                    ))}
                    {day.events.length > 2 && (
                      <div className="text-[10px] text-white/40 px-1.5">
                        +{day.events.length - 2} mai multe
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enrolled Indicator Dot */}
              {hasEnrolledEvent && !hasEvents && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Events */}
      {selected && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon size={16} className="text-[#4ECDC4]" />
            <h3 className="text-sm font-medium text-white">
              {selected.toLocaleDateString('ro-RO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </h3>
          </div>
          
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-white/50">Niciun eveniment în această zi</p>
          ) : (
            <div className="space-y-2">
              {selectedDateEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/student/events/${event.id}`}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {event.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {event.time} • {event.location}
                    </p>
                  </div>
                  {event.isEnrolled && (
                    <span className="px-2 py-1 text-[10px] font-semibold bg-green-500/20 text-green-400 rounded-full">
                      Înscris
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
