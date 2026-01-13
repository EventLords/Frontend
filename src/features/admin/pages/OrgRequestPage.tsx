// src/features/admin/pages/OrgRequestsPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

// -------------------------------------------------------------------------
// TIPURI ȘI MOCK DATA
// -------------------------------------------------------------------------

interface OrgRequest {
    id: string;
    userName: string;
    userEmail: string;
    requestedFaculty: string;
    reason: string;
    requestDate: Date;
    status: 'pending' | 'approved' | 'rejected';
}

const mockRequests: OrgRequest[] = [
    { id: '1', userName: 'Maria Popescu', userEmail: 'maria.popescu@student.ro', requestedFaculty: 'FIRESC', reason: 'Doresc să organizez un hackathon', requestDate: new Date(2025, 11, 10), status: 'pending' },
    { id: '2', userName: 'Ion Gheorghe', userEmail: 'ion.gheorghe@student.ro', requestedFaculty: 'FEAA', reason: 'Vreau să creez un târg de cariere', requestDate: new Date(2025, 11, 12), status: 'pending' },
    { id: '3', userName: 'Ana Dumitrescu', userEmail: 'ana.d@student.ro', requestedFaculty: 'FIM', reason: 'Cerere standard', requestDate: new Date(2025, 11, 5), status: 'approved' },
];

// -------------------------------------------------------------------------
// COMPONENTA PAGINĂ
// -------------------------------------------------------------------------

const OrgRequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<OrgRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Înlocuiește cu logica ta de fetch reală!
    useEffect(() => {
        setIsLoading(true);
        // Simulează fetch-ul
        setTimeout(() => {
            setRequests(mockRequests);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        // Logica reală ar trebui să apeleze un serviciu API
        console.log(`Action ${action} for request ${id}`);
        setRequests(prev => prev.map(req => 
            req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req
        ));
    };

    const pendingRequests = requests.filter(req => req.status === 'pending');
    
    // Culorile din designul tău
    const darkBgColor = '#3F3176';
    const secondaryColor = '#7B6DB5';

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

                <h1 className="text-3xl font-bold mb-2">Cereri Cont Organizator</h1>
                <p className="text-white/70 mb-8">Aprobă sau respinge cererile pentru a acorda drepturi de organizare evenimente.</p>

                {isLoading ? (
                    <div className="text-center py-20">Se încarcă cererile...</div>
                ) : (
                    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 border-b border-white/20 pb-3">
                            Cereri în Așteptare ({pendingRequests.length})
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Utilizator</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Facultate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Motivație</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Data Cererii</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Acțiuni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pendingRequests.map((req) => (
                                        <tr key={req.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-[#4ECDC4]" />
                                                    {req.userName}
                                                </div>
                                                <p className="text-xs text-white/50 flex items-center gap-1">
                                                    <Mail size={12} /> {req.userEmail}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{req.requestedFaculty}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80 max-w-xs truncate">{req.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{format(req.requestDate, 'dd MMM yyyy')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button
                                                    onClick={() => handleAction(req.id, 'approve')}
                                                    className="inline-flex items-center p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                                                    title="Aprobă"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'reject')}
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
                        
                        {/* Secțiunea Aprobate/Respinse (opțional, pentru completitudine) */}
                        <h2 className="text-xl font-semibold mt-8 mb-4 border-b border-white/20 pb-3">Istoric</h2>
                        {/* Aici ar veni un tabel mai simplu cu cererile aprobate/respinse */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgRequestsPage;