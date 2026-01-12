import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  Tag,
  Clock,
  Users,
  AlignLeft,
  GraduationCap,
  Calendar,
  MapPin,
  Timer,
  ArrowLeft,
  Loader,
  Save,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import eventsService from "../services/eventsService";
import { UpdateEventData } from "../../../types/organizer";
import AnimatedBackground from "../../../components/AnimatedBackground";

// Helper types
type OptionItem = { id: number; name: string };

// Tipuri pentru răspunsurile de la backend
interface ApiFaculty {
  id_faculty?: number;
  id?: number;
  name: string;
}

interface ApiEventType {
  id?: number;
  id_type?: number;
  name: string;
}

interface CombinedFile {
  id: string;
  name: string;
  size?: number;
  type?: string;
  url?: string;
  file?: File;
  isCover: boolean;
  isLocal: boolean;
}

const EditEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [facultiesList, setFacultiesList] = useState<OptionItem[]>([]);
  const [eventTypesList, setEventTypesList] = useState<OptionItem[]>([]);

  const [formData, setFormData] = useState<UpdateEventData>({
    name: "",
    type_id: 0,
    faculty_id: 0,
    date: "",
    deadline: "",
    location: "",
    duration: "",
    maxParticipants: 0,
    description: "",
    status: "draft",
  });

  const [files, setFiles] = useState<CombinedFile[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);

  // =========================================================
  // 1. DATA LOADING
  // =========================================================
  useEffect(() => {
    const loadAllData = async () => {
      if (!eventId) return;
      setIsLoading(true);
      setError(null);

      try {
        const [eventData, facultiesRes, typesRes] = await Promise.all([
          eventsService.getEventById(Number(eventId)),
          eventsService.getFaculties(),
          eventsService.getEventTypes(),
        ]);

        // Normalize lists
        const mappedFaculties = facultiesRes.map((f: ApiFaculty) => ({
          id: f.id_faculty || f.id || 0,
          name: f.name,
        }));

        const mappedTypes = typesRes.map((t: ApiEventType) => ({
          id: t.id || t.id_type || 0,
          name: t.name,
        }));

        setFacultiesList(mappedFaculties);
        setEventTypesList(mappedTypes);

        // Populate Form
        if (eventData) {
          const rawEvent = eventData as any;

          const formatDateTime = (d: string | Date | undefined) => {
            if (!d) return "";
            const dateObj = new Date(d);
            if (isNaN(dateObj.getTime())) return "";
            const offset = dateObj.getTimezoneOffset() * 60000;
            return new Date(dateObj.getTime() - offset)
              .toISOString()
              .slice(0, 16);
          };

          // --- ID MAPPING LOGIC ---
          let selectedFacultyId = 0;
          if (rawEvent.faculty_id) {
            selectedFacultyId = Number(rawEvent.faculty_id);
          } else if (rawEvent.faculties?.id_faculty) {
            selectedFacultyId = rawEvent.faculties.id_faculty;
          } else if (rawEvent.faculties?.id) {
            selectedFacultyId = rawEvent.faculties.id;
          }

          let selectedTypeId = 0;
          if (rawEvent.type_id) {
            selectedTypeId = Number(rawEvent.type_id);
          } else if (rawEvent.event_types?.id) {
            selectedTypeId = rawEvent.event_types.id;
          } else if (rawEvent.event_types?.id_type) {
            selectedTypeId = rawEvent.event_types.id_type;
          }

          // Fallback
          if (!selectedFacultyId && rawEvent.faculty) {
            const found = mappedFaculties.find(
              (f: OptionItem) => f.name === rawEvent.faculty
            );
            if (found) selectedFacultyId = found.id;
          }
          if (!selectedTypeId && rawEvent.type) {
            const found = mappedTypes.find(
              (t: OptionItem) => t.name === rawEvent.type
            );
            if (found) selectedTypeId = found.id;
          }

          setFormData({
            name: rawEvent.name || rawEvent.title || "",
            description: rawEvent.description || "",
            location: rawEvent.location || "",
            duration: rawEvent.duration || "",
            maxParticipants:
              rawEvent.maxParticipants || rawEvent.max_participants || 0,
            status: rawEvent.status,
            faculty_id: selectedFacultyId,
            type_id: selectedTypeId,
            date: formatDateTime(rawEvent.date || rawEvent.date_start),
            deadline: formatDateTime(rawEvent.deadline),
          });

          // Process Files
          const rawFiles = rawEvent.files || [];
          if (Array.isArray(rawFiles)) {
            const apiBase =
              import.meta.env.VITE_API_URL || "http://localhost:3001/api";
            // Eliminăm "/api" din URL-ul de bază pentru a servi fișierele statice corect
            const serverRoot = apiBase.replace("/api", "");

            const mappedFiles: CombinedFile[] = rawFiles.map((f: any) => {
              let fileUrl = f.file_path || f.path || f.url || "";

              // Construim URL-ul complet pentru fișier dacă nu este deja absolut
              if (fileUrl && !fileUrl.startsWith("http")) {
                // Curățăm calea (scoatem "./" sau alte prefixe relative dacă există)
                const cleanPath = fileUrl
                  .replace(/^\.\//, "")
                  .replace(/^\//, "");
                fileUrl = `${serverRoot}/${cleanPath}`;
              }

              // Determinăm tipul MIME dacă nu este setat, bazându-ne pe extensie
              let mimeType = f.mimetype || f.type || "application/octet-stream";
              if (!f.mimetype && fileUrl) {
                const ext = fileUrl.split(".").pop()?.toLowerCase();
                if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) {
                  mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;
                }
              }

              return {
                id: String(f.id_file || f.id),
                name:
                  f.original_name || f.file_name || f.name || "Fișier existent",
                size: Number.isFinite(Number(f.size)) ? Number(f.size) : undefined,
                type: mimeType, // Folosim tipul determinat
                url: fileUrl,
                isCover: Boolean(f.is_cover || f.isCover),
                isLocal: false,
              };
            });
            setFiles(mappedFiles);
          }
        }
      } catch (err: any) {
        console.error("Eroare la încărcare:", err);
        setError("Nu am putut încărca datele evenimentului.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, [eventId]);

  // =========================================================
  // 2. HANDLERS
  // =========================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "maxParticipants" ||
        name === "faculty_id" ||
        name === "type_id"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: CombinedFile[] = Array.from(e.target.files).map(
        (file) => ({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          isCover: false,
          isLocal: true,
          url: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      );

      setFiles((prev) => {
        const combined = [...prev, ...newFiles];
        // Dacă nu avem copertă, punem prima imagine ca și copertă
        if (!combined.some((f) => f.isCover)) {
          const firstImg = combined.find((f) => f.type?.startsWith("image/"));
          if (firstImg) firstImg.isCover = true;
        }
        return combined;
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove && !fileToRemove.isLocal) {
      setDeletedFileIds((prev) => [...prev, fileId]);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const setAsCover = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => ({
        ...f,
        isCover: f.id === fileId,
      }))
    );
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // --- SUBMIT LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update Basic Info
      await eventsService.updateEvent(Number(eventId), formData);

      // 2. Delete Removed Files
      if (deletedFileIds.length > 0) {
        for (const fileId of deletedFileIds) {
          await eventsService.deleteFile(Number(eventId), Number(fileId));
        }
      }

      // 3. Upload New Files
      const filesToUpload = files.filter((f) => f.isLocal && f.file);
      for (const fileObj of filesToUpload) {
        if (!fileObj.file) continue;

        const uploadData = new FormData();
        uploadData.append("file", fileObj.file);

        const uploaded = await eventsService.uploadFile(
          Number(eventId),
          uploadData
        );

        if (fileObj.isCover && (uploaded.id_file || uploaded.id)) {
          const newFileId = uploaded.id_file || uploaded.id;
          await eventsService.setCoverImage(Number(eventId), Number(newFileId));
        }
      }

      // 5. Handle Cover Update for existing (server) files
      const existingCover = files.find((f) => !f.isLocal && f.isCover);
      if (existingCover) {
        await eventsService.setCoverImage(
          Number(eventId),
          Number(existingCover.id)
        );
      }

      navigate("/organizer/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Eroare la salvare: " + (err.message || "Necunoscută"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UI HELPERS ---
  const InputField = ({
    icon,
    label,
    name,
    type = "text",
    value,
    placeholder,
  }: any) => (
    <div className="relative group">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#a78bfa] group-focus-within:text-purple-400 transition-colors">
          {icon}
        </span>
        <label className="text-white/80 text-sm font-medium">{label}</label>
      </div>
      <input
        type={type}
        name={name}
        value={name === "maxParticipants" && type === "number" && value === 0 ? "" : value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-[#2a2a5e]/60 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-all [color-scheme:dark]"
      />
    </div>
  );

  const SelectField = ({ icon, label, name, options, value }: any) => (
    <div className="relative group">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#a78bfa] group-focus-within:text-purple-400 transition-colors">
          {icon}
        </span>
        <label className="text-white/80 text-sm font-medium">{label}</label>
      </div>
      <div className="relative">
        <select
          name={name}
          value={value || 0}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-[#2a2a5e]/60 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-all appearance-none cursor-pointer"
        >
          <option value={0} className="bg-[#1a1a4e]" disabled>
            Selectează...
          </option>
          {options.map((opt: OptionItem) => (
            <option key={opt.id} value={opt.id} className="bg-[#1a1a4e]">
              {opt.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
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
    </div>
  );

  // --- RENDER ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-[#a78bfa] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Se încarcă datele...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-red-200 font-bold mb-2">Eroare</h3>
          <p className="text-red-200/70 mb-4">{error}</p>
          <button
            onClick={() => navigate("/organizer/dashboard")}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
          >
            Înapoi la Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans relative">
      <AnimatedBackground />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative z-10">
        <div className="bg-[#1e1e4a]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10 bg-[#232355]/50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Editare Eveniment
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Editează detaliile pentru:{" "}
                <span className="text-purple-300">{formData.name}</span>
              </p>
            </div>
            <button
              onClick={() => navigate("/organizer/dashboard")}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              <span>Înapoi</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputField
                  icon={<FileText size={18} />}
                  label="Nume eveniment"
                  name="name"
                  value={formData.name}
                />
                <SelectField
                  icon={<Tag size={18} />}
                  label="Tip eveniment"
                  name="type_id"
                  options={eventTypesList}
                  value={formData.type_id}
                />
                <InputField
                  icon={<Clock size={18} />}
                  label="Deadline înscrieri"
                  name="deadline"
                  type="datetime-local"
                  value={formData.deadline}
                />
                <InputField
                  icon={<Users size={18} />}
                  label="Nr. max participanți"
                  name="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                />
              </div>

              <div className="space-y-6">
                <SelectField
                  icon={<GraduationCap size={18} />}
                  label="Facultate"
                  name="faculty_id"
                  options={facultiesList}
                  value={formData.faculty_id}
                />
                <InputField
                  icon={<Calendar size={18} />}
                  label="Data eveniment"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                />
                <InputField
                  icon={<MapPin size={18} />}
                  label="Locație"
                  name="location"
                  value={formData.location}
                />
                <InputField
                  icon={<Timer size={18} />}
                  label="Durată"
                  name="duration"
                  placeholder="ex: 3 ore"
                  value={formData.duration}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#a78bfa]">
                  <AlignLeft size={18} />
                </span>
                <label className="text-white/80 text-sm font-medium">
                  Descriere eveniment
                </label>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-[#2a2a5e]/60 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-[#a78bfa] transition-all resize-y min-h-[120px]"
                placeholder="Descrie detaliile evenimentului..."
              />
            </div>

            {/* ZONA MATERIALE */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-400" /> Materiale &
                Copertă
              </h3>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-white/20 rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center bg-[#2a2a5e]/25 hover:bg-[#2a2a5e]/35 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors mb-1.5">
                  <Upload className="text-purple-400" size={16} />
                </div>
                <p className="text-white text-xs font-semibold">Adaugă fișiere</p>
                <p className="text-white/40 text-[11px]">Imagini, PDF, Prezentări</p>
              </div>

              {/* ✅ GRID PENTRU FIȘIERE (Design Modern cu Preview) */}
              {files.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file) => {
                    const isImage = file.type?.startsWith("image/");
                    return (
                      <div
                        key={file.id}
                        className={`group relative bg-[#1E1E40] border ${
                          file.isCover
                            ? "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                            : "border-slate-700/50"
                        } rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col`}
                      >
                        {/* ZONA PREVIEW */}
                        <div className="h-32 w-full bg-[#151632] flex items-center justify-center overflow-hidden relative">
                          {isImage ? (
                            file.url ? (
                              <img
                                src={file.url}
                                alt="preview"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <ImageIcon
                                size={32}
                                className="text-purple-400"
                              />
                            )
                          ) : (
                            <FileText size={32} className="text-slate-500" />
                          )}

                          {/* Badge COPERTĂ */}
                          {file.isCover && (
                            <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg z-20 flex items-center gap-1">
                              <CheckCircle size={10} /> COPERTĂ
                            </div>
                          )}

                          {/* Overlay cu Acțiuni */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[1px] z-10">
                            {isImage && !file.isCover && (
                              <button
                                type="button"
                                onClick={() => setAsCover(file.id)}
                                className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/30 transition-colors"
                                title="Setează ca imagine de copertă"
                              >
                                <ImageIcon size={18} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeFile(file.id)}
                              className="p-2 rounded-full bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/30 transition-colors"
                              title="Șterge fișier"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>

                        {/* INFO JOS */}
                        <div className="p-3 bg-[#1A1A2E] border-t border-white/5">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 ${
                                isImage
                                  ? "bg-purple-500/10 text-purple-400"
                                  : "bg-slate-700/30 text-slate-400"
                              }`}
                            >
                              {isImage ? (
                                <ImageIcon size={16} />
                              ) : (
                                <FileText size={16} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p
                                className="text-sm font-medium text-white truncate w-full"
                                title={file.name}
                              >
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {Number(file.size) > 0 && (
                                  <span className="text-[10px] text-slate-500">
                                    {formatSize(Number(file.size))}
                                  </span>
                                )}
                                {file.isLocal && (
                                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold tracking-wider">
                                    NOU
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-center border-t border-white/10 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-3.5 bg-gradient-to-r from-[#c4b5fd] via-[#a78bfa] to-[#8b5cf6] hover:from-[#a78bfa] hover:to-[#7c3aed] transition-all rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 active:scale-95 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={20} className="animate-spin" /> Se salvează...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Salvează Modificările
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
