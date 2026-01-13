// src/pages/AdminDashboardPage.tsx (MODIFICAT PENTRU LEGAREA RUTELOR)

import React from 'react';
import { Link } from 'react-router-dom'; // Importăm Link
import { Users, FileCheck, Calendar, TrendingUp, XCircle, ChevronRight, Bell } from 'lucide-react';

// Date Mock (simulează datele pe care le preiei de la servicii)
const mockAdminStats = {
    totalUsers: 1540,
    activeEvents: 45,
    pendingOrgRequests: 8,
    pendingEventApprovals: 12,
};

const mockActivity = [
// ... (Activitatea mock rămâne neschimbată) ...
    { type: 'aprobare', description: 'Cerere cont organizator: Tech Club', date: 'Acum 5 min' },
    { type: 'eveniment', description: 'Eveniment nou creat: Conferință Blockchain', date: 'Acum 30 min' },
    { type: 'respingere', description: 'Cerere cont organizator: Alex Popescu', date: 'Ieri' },
];

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    linkTo?: string; // Adăugat linkTo
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, linkTo }) => {
    return (
        // 🛑 NOU: Folosim <Link> pentru a face cardul clicabil
        <Link 
            to={linkTo || '#'} 
            className={`flex flex-col justify-between p-5 rounded-2xl shadow-xl transition-transform hover:scale-[1.02] h-full ${color}`}
        >
            <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-white/80">{title}</p>
                <div className="p-2 rounded-full bg-white/10 text-white/90">
                    {icon}
                </div>
            </div>
            <h3 className="text-3xl font-bold text-white mt-4">{value}</h3>
        </Link>
    );
};


const AdminDashboardPage: React.FC = () => {
    const darkBgColor = '#3F3176';
    const secondaryColor = '#7B6DB5';
    
    const pageStyle = {
        minHeight: '100vh',
        backgroundColor: darkBgColor, 
        backgroundImage: `radial-gradient(at top center, ${secondaryColor} 0%, ${darkBgColor} 70%, #171738 100%)`,
    };

    return (
        <div style={pageStyle} className="text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold mb-8">Dashboard Administrator</h1>
                
                {/* Statistici Cheie */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard 
                        title="Total Utilizatori" 
                        value={mockAdminStats.totalUsers} 
                        icon={<Users size={24} />} 
                        color="bg-gradient-to-r from-indigo-600 to-purple-600"
                        linkTo="/admin/utilizatori"
                    />
                    <StatCard 
                        title="Evenimente Active" 
                        value={mockAdminStats.activeEvents} 
                        icon={<Calendar size={24} />} 
                        color="bg-gradient-to-r from-teal-500 to-cyan-500"
                        linkTo="/admin/evenimente"
                    />
                    <StatCard 
                        title="Cereri Organizator" 
                        value={mockAdminStats.pendingOrgRequests} 
                        icon={<FileCheck size={24} />} 
                        color="bg-gradient-to-r from-orange-500 to-yellow-500"
                        // 🛑 LEGARE: Ruta către pagina OrgRequestsPage
                        linkTo="/admin/cereri/organizator" 
                    />
                    <StatCard 
                        title="Aprobări Evenimente" 
                        value={mockAdminStats.pendingEventApprovals} 
                        icon={<Bell size={24} />} 
                        color="bg-gradient-to-r from-red-500 to-pink-500"
                        // 🛑 LEGARE: Ruta către pagina EventApprovalPage
                        linkTo="/admin/cereri/evenimente" 
                    />
                </div>
                
                {/* Secțiunea Cereri / Activitate Recentă */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Activitate Recentă (Rămâne neschimbată) */}
                    <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Activitate Recentă</h2>
                        <div className="space-y-3">
                            {mockActivity.map((activity, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {activity.type === 'aprobare' && <FileCheck size={20} className="text-green-400" />}
                                        {activity.type === 'eveniment' && <Calendar size={20} className="text-blue-400" />}
                                        {activity.type === 'respingere' && <XCircle size={20} className="text-red-400" />}
                                        <p className="text-sm">{activity.description}</p>
                                    </div>
                                    <span className="text-xs text-white/50">{activity.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Acces Rapid la Cereri */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-lg flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Acțiuni Necesare</h2>
                            {/* 🛑 LEGARE: Ruta către pagina OrgRequestsPage */}
                            <Link 
                                to="/admin/cereri/organizator" 
                                className="flex justify-between items-center p-3 bg-white/10 rounded-lg mb-3 hover:bg-white/20 transition-colors"
                            >
                                <span className="font-medium">Aprobare Conturi</span>
                                <span className="text-sm font-bold text-orange-400 flex items-center gap-1">
                                    {mockAdminStats.pendingOrgRequests} <ChevronRight size={16} />
                                </span>
                            </Link>
                            {/* 🛑 LEGARE: Ruta către pagina EventApprovalPage */}
                            <Link 
                                to="/admin/cereri/evenimente" 
                                className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                            >
                                <span className="font-medium">Aprobare Evenimente</span>
                                <span className="text-sm font-bold text-red-400 flex items-center gap-1">
                                    {mockAdminStats.pendingEventApprovals} <ChevronRight size={16} />
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;