// src/components/EventCalendar.tsx

import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { StudentEvent } from '../../../types/student';

// Asigură-te că aceste importuri sunt corecte în fișierul tău:
// import 'react-calendar/dist/Calendar.css'; // Acesta trebuie să fie în App.tsx/main.tsx

interface EventCalendarProps {
  events: StudentEvent[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  // Adăugăm events-urile înscrise separat pentru evidențiere constantă
  enrolledEvents: StudentEvent[]; 
}

const getDatesSet = (events: StudentEvent[]): Set<string> => {
    return new Set(events.map(e => format(new Date(e.date), 'yyyy-MM-dd')));
};

const EventCalendar: React.FC<EventCalendarProps> = ({ 
    events, 
    enrolledEvents, 
    selectedDate, 
    onDateSelect 
}) => {
    
    // Setul de date la care studentul ESTE înscris (pentru evidențierea verde/teal)
    const enrolledDates = getDatesSet(enrolledEvents);
    
    // Setul de date la care există evenimente disponibile (pentru evidențierea albastră, dacă nu e înscris)
    const allAvailableDates = getDatesSet(events);
    
    const tileClassName = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month') {
            const formattedDate = format(date, 'yyyy-MM-dd');
            
            // 1. Evidențiază dacă ESTE înscris (Verde/Teal)
            if (enrolledDates.has(formattedDate)) {
                return 'enrolled-event-date'; // Clasa pentru evenimentele înscrise
            }
            
            // 2. Evidențiază dacă există evenimente disponibile (Albastru)
            if (allAvailableDates.has(formattedDate)) {
                return 'available-event-date'; // Clasa pentru evenimentele disponibile
            }
        }
        return null;
    };

    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 shadow-xl">
            <Calendar
                onChange={onDateSelect as any} 
                value={selectedDate}
                tileClassName={tileClassName}
                locale="ro-RO" 
                calendarType="iso8601" // Forma corectă
                className="w-full border-none p-0 bg-transparent text-white custom-react-calendar" 
            />
        </div>
    );
};

export default EventCalendar;