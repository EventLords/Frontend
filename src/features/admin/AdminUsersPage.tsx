import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Shield,
  GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import adminService, {
  AdminUser,
} from "../../features/admin/services/adminService";

const AdminUsersPage: React.FC = () => {
  // State pentru date
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State pentru filtrare
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "student" | "organizer">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "suspended" | "pending"
  >("all");

  // 1. Încărcare date reale
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUsers();
      // Filtrăm utilizatorii ADMIN din start
      const nonAdminUsers = data.filter((u) => u.role !== "ADMIN");
      setUsers(nonAdminUsers);
      setFilteredUsers(nonAdminUsers);
    } catch (error) {
      console.error("Eroare la preluarea utilizatorilor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Logică de filtrare
  useEffect(() => {
    let result = users;

    // Filtrare după text
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.displayName.toLowerCase().includes(lowerTerm) ||
          user.email.toLowerCase().includes(lowerTerm)
      );
    }

    // Filtrare după rol
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role.toLowerCase() === roleFilter);
    }

    // Filtrare după status (Doar dacă e selectat 'organizer')
    if (roleFilter === "organizer" && statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Resetare filtru status când schimbăm rolul
  useEffect(() => {
    if (roleFilter !== "organizer") {
      setStatusFilter("all");
    }
  }, [roleFilter]);

  // Statistici calculate
  const studentCount = users.filter((u) => u.role === "STUDENT").length;
  const organizerCount = users.filter((u) => u.role === "ORGANIZER").length;

  // Helper componente
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            Activ
          </span>
        );
      case "inactive":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 whitespace-nowrap">
            Inactiv
          </span>
        );
      case "suspended":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
            Suspendat
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
            În așteptare
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/5 text-white/60 whitespace-nowrap">
            {status}
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "STUDENT":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 w-fit">
            <GraduationCap size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Student</span>
          </div>
        );
      case "ORGANIZER":
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20 w-fit">
            <Shield size={14} className="text-violet-400" />
            <span className="text-xs font-medium text-violet-400">
              Organizator
            </span>
          </div>
        );
      default:
        return <span className="text-xs text-white/60">{role}</span>;
    }
  };

  const formatDisplayText = (text: string) => {
    if (!text || text === "N/A" || text === "-") return text;
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const getCategoryOrFaculty = (user: AdminUser) => {
    let rawValue = "-";
    if (user.role === "ORGANIZER") {
      rawValue = user.organization_type || user.department || "N/A";
    } else if (user.role === "STUDENT") {
      rawValue =
        user.department && user.department !== "N/A"
          ? user.department
          : "Student USV";
    }
    return formatDisplayText(rawValue);
  };

  return (
    <div className="text-white animate-fade-in p-6 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Utilizatori Platformă
        </h1>
        <p className="text-white/60">
          Gestionează toți utilizatorii înregistrați pe platformă
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-5 shadow-xl transition-transform hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">
                Total Utilizatori
              </p>
              <p className="text-4xl font-bold text-white tracking-tight">
                {users.length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#a78bfa]/10 text-[#a78bfa]">
              <User size={28} />
            </div>
          </div>
        </div>
        <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-5 shadow-xl transition-transform hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">Studenți</p>
              <p className="text-4xl font-bold text-white tracking-tight">
                {studentCount}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400">
              <GraduationCap size={28} />
            </div>
          </div>
        </div>
        <div className="bg-[#1a1040]/40 backdrop-blur-sm rounded-2xl border border-[#a78bfa]/20 p-5 shadow-xl transition-transform hover:scale-[1.01]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium mb-1">
                Organizatori
              </p>
              <p className="text-4xl font-bold text-white tracking-tight">
                {organizerCount}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-400">
              <Shield size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#1a1040]/60 backdrop-blur-md rounded-2xl border border-[#a78bfa]/20 p-5 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-5 items-center">
          {/* Search Input */}
          <div className="flex-1 relative w-full group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#a78bfa] transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Caută utilizator după nume sau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0f0a2e]/80 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#a78bfa]/50 focus:ring-1 focus:ring-[#a78bfa]/50 transition-all text-sm"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Role Filter */}
            <div className="relative flex-1 md:flex-none">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <Filter size={18} />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="w-full md:w-[200px] pl-10 pr-10 py-3 bg-[#0f0a2e]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a78bfa]/50 appearance-none cursor-pointer text-sm font-medium transition-all hover:bg-[#0f0a2e]"
              >
                <option value="all">Toate rolurile</option>
                <option value="student">Studenți</option>
                <option value="organizer">Organizatori</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter - Apare DOAR pentru Organizatori */}
            {roleFilter === "organizer" && (
              <div className="relative flex-1 md:flex-none animate-fade-in">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full md:w-[200px] px-4 py-3 bg-[#0f0a2e]/80 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#a78bfa]/50 appearance-none cursor-pointer text-sm font-medium transition-all hover:bg-[#0f0a2e]"
                >
                  <option value="all">Toate statusurile</option>
                  <option value="active">Activ</option>
                  <option value="pending">În așteptare</option>
                  <option value="inactive">Inactiv</option>
                  <option value="suspended">Suspendat</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#1a1040]/30 rounded-2xl border border-white/5">
          <div className="w-12 h-12 border-3 border-[#a78bfa] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white/60 font-medium">Se încarcă datele...</p>
        </div>
      ) : (
        <div className="bg-[#1a1040]/40 backdrop-blur-md rounded-2xl border border-[#a78bfa]/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-5 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Utilizator
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Tip Organizație / Facultate
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Înregistrat
                  </th>
                  <th className="px-6 py-5 text-xs font-bold text-white/50 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id_user}
                    className="group hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/20 group-hover:scale-105 transition-transform duration-200">
                          {user.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">
                            {user.displayName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Mail size={12} className="text-white/40" />
                            {/* ✅ EMAIL MAI MARE SI MAI VIZIBIL */}
                            <p className="text-sm text-white/70 font-medium font-mono">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/80 font-medium">
                        {getCategoryOrFaculty(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar size={14} className="text-white/30" />
                        <span className="text-sm font-medium">
                          {format(new Date(user.created_at), "dd MMM yyyy", {
                            locale: ro,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-20 bg-white/[0.02]">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Search size={24} className="text-white/30" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                Nu s-au găsit rezultate
              </h3>
              <p className="text-white/40 text-sm">
                Încearcă să modifici filtrele pentru a vedea mai multe
                rezultate.
              </p>
            </div>
          )}

          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
            <p className="text-xs font-medium text-white/40">
              Se afișează{" "}
              <span className="text-white">{filteredUsers.length}</span> din{" "}
              <span className="text-white">{users.length}</span> utilizatori
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
