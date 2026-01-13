// src/features/admin/pages/EventApprovalPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

// -------------------------------------------------------------------------
// TIPURI ȘI MOCK DATA
// -------------------------------------------------------------------------

interface EventApproval {
    id: string;
    title: string;
    organizerName: string;
    submissionDate: Date;
    eventType: 'new' | 'update';
    status: 'pending' | 'approved' | 'rejected';
}

const mockEventsForApproval: EventApproval[] = [
    { id: 'E1', title: 'Conferință IT Securitate', organizerName: 'Departamentul Info', submissionDate: new Date(2025, 11, 14), eventType: 'new', status: 'pending' },
    { id: 'E2', title: 'Workshop AI Avansat', organizerName: 'Tech Club', submissionDate: new Date(2025, 11, 13), eventType: 'update', status: 'pending' },
    { id: 'E3', title: 'Târg de Cariere 2026', organizerName: 'FEAA', submissionDate: new Date(2025, 11, 10), eventType: 'new', status: 'approved' },
];

// -------------------------------------------------------------------------
// COMPONENTA PAGINĂ
// -------------------------------------------------------------------------

const EventApprovalPage: React.FC = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventApproval[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Înlocuiește cu logica ta de fetch reală!
    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setEvents(mockEventsForApproval);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        // Logica reală ar trebui să apeleze un serviciu API
        console.log(`Action ${action} for event ${id}`);
        setEvents(prev => prev.map(event => 
            event.id === id ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' } : event
        ));
    };

    const pendingEvents = events.filter(e => e.status === 'pending');
    
    // Culorile din designul tău
    const darkBgColor = '#3F3176';
    const secondaryColor = '#7B6DB5';
    const highlightColor = '#4ECDC4';

    return (
        <div 
            className="min-h-screen pb-16 text-white" 
            style={{ 
                backgroundColor: darkBgColor, 
                backgroundImage: `radial-gradient(at top center, ${secondaryColor} 0%, ${darkBgColor} 70%, #171738 100%)`,
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={18} /> Înapoi la Dashboard
                </button>

                <h1 className="text-3xl font-bold mb-2">Aprobare Evenimente</h1>
                <p className="text-white/70 mb-8">Revizuiește evenimentele noi sau modificate înainte de publicare.</p>

                {isLoading ? (
                    <div className="text-center py-20">Se încarcă evenimentele...</div>
                ) : (
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/20 pb-3">
                            Evenimente în Așteptare ({pendingEvents.length})
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Eveniment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Organizator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Tip Cerere</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Data Trimitere</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acțiuni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pendingEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                <Link to={`/admin/events/${event.id}/review`} className="text-[#4ECDC4] hover:underline">
                                                    {event.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{event.organizerName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    event.eventType === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {event.eventType === 'new' ? 'Nou' : 'Modificare'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{format(event.submissionDate, 'dd MMM yyyy')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => navigate(`/admin/events/${event.id}/review`)}
                                                    className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-xs"
                                                >
                                                    Vezi Detalii
                                                </button>
                                                <button
                                                    onClick={() => handleAction(event.id, 'approve')}
                                                    className="inline-flex items-center p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                                                    title="Aprobă"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(event.id, 'reject')}
                                                    className="inline-flex items-center p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                                                    title="Respinge"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventApprovalPage;