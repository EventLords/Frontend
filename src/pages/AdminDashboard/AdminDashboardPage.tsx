import React from 'react';
import { 
  Users, 
  Calendar, 
  FileCheck, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { Button, Card, StatCard } from '../../components';

// Mock data for account validation requests
const accountRequests = [
  { id: '1', name: 'Maria Popescu', email: 'maria.popescu@student.ro', role: 'Organizator', date: '07 Dec 2024' },
  { id: '2', name: 'Ion Gheorghe', email: 'ion.gheorghe@student.ro', role: 'Organizator', date: '06 Dec 2024' },
  { id: '3', name: 'Ana Dumitrescu', email: 'ana.d@student.ro', role: 'Organizator', date: '06 Dec 2024' },
  { id: '4', name: 'Mihai Ionescu', email: 'mihai.i@student.ro', role: 'Organizator', date: '05 Dec 2024' },
];

// Mock data for event organization requests
const eventRequests = [
  { id: '1', title: 'Workshop Frontend Development', organizer: 'Maria Popescu', date: '15 Dec 2024', status: 'pending' },
  { id: '2', title: 'Conferință AI în Educație', organizer: 'Ion Gheorghe', date: '20 Dec 2024', status: 'pending' },
  { id: '3', title: 'Hackathon Winter 2024', organizer: 'Ana Dumitrescu', date: '22 Dec 2024', status: 'pending' },
];

// Stats data
const stats = [
  { title: 'Total Utilizatori', value: '2,450', icon: Users, trend: { value: 12, isPositive: true } },
  { title: 'Evenimente Active', value: '48', icon: Calendar, trend: { value: 8, isPositive: true } },
  { title: 'Cereri în Așteptare', value: '15', icon: FileCheck, trend: { value: 3, isPositive: false } },
  { title: 'Participări Luna Aceasta', value: '1,280', icon: TrendingUp, trend: { value: 24, isPositive: true } },
];

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-unify-navy mb-2">
          Gestionează platforma de evenimente universitare
        </h1>
        <p className="text-gray-600">
          Bine ai venit! Aici poți gestiona cererile și monitoriza activitatea platformei.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            variant="default"
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account Validation Requests */}
        <Card variant="default" padding="none">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-unify-navy flex items-center gap-2">
                <Users size={20} className="text-unify-purple" />
                Cereri de validare a conturilor noi
              </h2>
              <span className="px-3 py-1 bg-unify-mint text-unify-purple text-sm font-medium rounded-full">
                {accountRequests.length} noi
              </span>
            </div>
          </div>
          <div className="divide-y">
            {accountRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-unify-purple to-unify-purple-dark flex items-center justify-center text-white font-medium">
                      {request.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-unify-navy">{request.name}</h4>
                      <p className="text-sm text-gray-500">{request.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{request.role}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400">{request.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Aprobă">
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Respinge">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50">
            <Button variant="ghost" size="sm" fullWidth>
              Vezi toate cererile
            </Button>
          </div>
        </Card>

        {/* Event Organization Requests */}
        <Card variant="default" padding="none">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-unify-navy flex items-center gap-2">
                <Calendar size={20} className="text-unify-purple" />
                Cereri organizare evenimente
              </h2>
              <span className="px-3 py-1 bg-unify-mint text-unify-purple text-sm font-medium rounded-full">
                {eventRequests.length} noi
              </span>
            </div>
          </div>
          <div className="divide-y">
            {eventRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-unify-navy mb-1">{request.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{request.organizer}</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {request.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Vizualizează">
                      <Eye size={20} />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Aprobă">
                      <CheckCircle size={20} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Respinge">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50">
            <Button variant="ghost" size="sm" fullWidth>
              Vezi toate cererile
            </Button>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Events by Category Chart Placeholder */}
        <Card variant="default">
          <h3 className="font-display font-semibold text-lg text-unify-navy mb-4">
            Evenimente pe categorii
          </h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full border-8 border-unify-purple relative">
                <div className="absolute inset-2 rounded-full border-8 border-unify-mint"></div>
                <div className="absolute inset-4 rounded-full border-8 border-blue-400"></div>
              </div>
              <p className="text-sm text-gray-500">Grafic categorii evenimente</p>
              <p className="text-xs text-gray-400 mt-1">(Recharts / Chart.js placeholder)</p>
            </div>
          </div>
        </Card>

        {/* Participation Trend Chart Placeholder */}
        <Card variant="default">
          <h3 className="font-display font-semibold text-lg text-unify-navy mb-4">
            Tendința participărilor
          </h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center w-full px-8">
              <div className="flex items-end justify-between h-32 gap-2">
                {[40, 65, 45, 80, 55, 90, 70].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-unify-purple to-unify-purple-light rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mie</span>
                <span>Joi</span>
                <span>Vin</span>
                <span>Sâm</span>
                <span>Dum</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">Grafic tendință participări</p>
            </div>
          </div>
        </Card>

        {/* User Growth Chart Placeholder */}
        <Card variant="default">
          <h3 className="font-display font-semibold text-lg text-unify-navy mb-4">
            Creșterea utilizatorilor
          </h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center w-full px-8">
              <svg className="w-full h-32" viewBox="0 0 200 80">
                <path
                  d="M 0 60 Q 30 55, 50 50 T 100 35 T 150 25 T 200 10"
                  fill="none"
                  stroke="#3F3176"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 60 Q 30 55, 50 50 T 100 35 T 150 25 T 200 10 L 200 80 L 0 80 Z"
                  fill="url(#gradient)"
                  opacity="0.2"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3F3176" />
                    <stop offset="100%" stopColor="#DFF3E4" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-sm text-gray-500 mt-4">Grafic creștere utilizatori</p>
            </div>
          </div>
        </Card>

        {/* Events Status Chart Placeholder */}
        <Card variant="default">
          <h3 className="font-display font-semibold text-lg text-unify-navy mb-4">
            Status evenimente
          </h3>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <div className="text-center">
              <div className="flex gap-4 mb-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl mb-2">
                    32
                  </div>
                  <span className="text-xs text-gray-500">Aprobate</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-xl mb-2">
                    15
                  </div>
                  <span className="text-xs text-gray-500">În așteptare</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl mb-2">
                    3
                  </div>
                  <span className="text-xs text-gray-500">Respinse</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Status evenimente</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
