import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  X,
  Users,
  Clock,
  MapPin,
  AlignLeft,
  GraduationCap,
  Tag,
  Loader,
  Timer,
} from "lucide-react";
import eventsService from "../services/eventsService";
import AnimatedBackground from "../../../components/AnimatedBackground";

/* =========================
    TYPES
========================= */

type ModalState =
  | { open: false }
  | { open: true; title: string; message: string; canSubmit: boolean };

type UploadedFile = {
  id: string;
  file: File;
  isCover: boolean;
  previewUrl?: string;
};

type FormState = {
  title: string;
  faculty_id: number;
  type_id: number;
  date_start: string;
  deadline: string;
  location: string;
  duration: string;
  max_participants: number;
  description: string;
};

type OptionItem = { id: number; name: string };

/* =========================
    COMPONENT
========================= */

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [faculties, setFaculties] = useState<OptionItem[]>([]);
  const [eventTypes, setEventTypes] = useState<OptionItem[]>([]);

  const [form, setForm] = useState<FormState>({
    title: "",
    faculty_id: 0,
    type_id: 0,
    date_start: "",
    deadline: "",
    location: "",
    duration: "3 ore",
    max_participants: 50,
    description: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ open: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultiesData = await eventsService.getFaculties();
        const mappedFaculties = facultiesData.map((f: any) => ({
          id: f.id_faculty,
          name: f.name,
        }));
        setFaculties(mappedFaculties);

        const typesData = await eventsService.getEventTypes();
        setEventTypes(typesData);
      } catch (e) {
        console.error("Eroare la încărcare date:", e);
        setError("Nu s-a putut încărca lista de facultăți.");
      }
    };
    fetchData();
  }, []);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "faculty_id" ||
        name === "type_id" ||
        name === "max_participants"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const toIsoOrThrow = (value: string, label: string) => {
    if (!value) throw new Error(`${label} este obligatorie.`);
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) throw new Error(`${label} este invalidă.`);
    return d.toISOString();
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Permite deadline-ul până la ora de start a evenimentului
  const getMaxDeadline = () => {
    if (!form.date_start) return undefined;
    const eventDate = new Date(form.date_start);
    eventDate.setMinutes(
      eventDate.getMinutes() - eventDate.getTimezoneOffset()
    );
    return eventDate.toISOString().slice(0, 16);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: UploadedFile[] = Array.from(e.target.files).map(
        (file) => ({
          id: Math.random().toString(36).substring(7),
          file,
          isCover: false,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      );

      setUploadedFiles((prev) => {
        const combined = [...prev, ...newFiles];
        const hasCover = combined.some((f) => f.isCover);
        if (!hasCover) {
          const firstImage = combined.find((f) =>
            f.file.type.startsWith("image/")
          );
          if (firstImage) firstImage.isCover = true;
        }
        return combined;
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      const wasCover = prev.find((f) => f.id === id)?.isCover;
      if (wasCover && filtered.length > 0) {
        const nextImage = filtered.find((f) =>
          f.file.type.startsWith("image/")
        );
        if (nextImage) nextImage.isCover = true;
      }
      return filtered;
    });
  };

  const setAsCover = (id: string) => {
    setUploadedFiles((prev) =>
      prev.map((f) => ({
        ...f,
        isCover: f.id === id,
      }))
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const saveDraft = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!form.title)
        throw new Error("Numele evenimentului este obligatoriu.");
      if (!form.faculty_id) throw new Error("Selectează facultatea.");
      if (!form.type_id) throw new Error("Selectează tipul evenimentului.");
      if (!form.date_start)
        throw new Error("Data evenimentului este obligatorie.");
      if (!form.deadline)
        throw new Error("Deadline-ul înscrierilor este obligatoriu.");

      const payload = {
        title: form.title,
        description: form.description,
        location: form.location,
        date_start: toIsoOrThrow(form.date_start, "Data eveniment"),
        deadline: toIsoOrThrow(form.deadline, "Deadline înscrieri"),
        duration: form.duration,
        max_participants: form.max_participants,
        faculty_id: form.faculty_id,
        type_id: form.type_id,
      };

      const res = await eventsService.createEvent(payload);
      const id =
        typeof res?.id_event === "number" ? res.id_event : (res as any).id;
      setCreatedEventId(id);

      if (uploadedFiles.length > 0) {
        for (const fileObj of uploadedFiles) {
          const formData = new FormData();
          formData.append("file", fileObj.file);
          const uploaded = await eventsService.uploadFile(id, formData);

          if (fileObj.isCover && (uploaded.id_file || uploaded.id)) {
            await eventsService.setCoverImage(
              id,
              uploaded.id_file || uploaded.id
            );
          }
        }
      }

      setModal({
        open: true,
        title: "Draft salvat",
        message:
          "Evenimentul a fost salvat ca draft. Îl poți trimite la admin pentru aprobare.",
        canSubmit: Boolean(id),
      });
    } catch (e: any) {
      setError(e?.message || "Eroare la salvare draft");
    } finally {
      setLoading(false);
    }
  };

  const submitToAdmin = async () => {
    if (!createdEventId) return;
    setLoading(true);

    try {
      await eventsService.submitEvent(createdEventId);
      navigate("/organizer/dashboard", {
        state: {
          flash: {
            type: "success",
            message: "Eveniment trimis spre aprobare!",
          },
        },
      });
    } catch (e: any) {
      setError(e?.message || "Eroare la trimitere");
      setLoading(false);
      setModal({ open: false });
    }
  };

  return (
    <div className="min-h-screen text-white font-sans relative">
      <AnimatedBackground />
      <div className="flex justify-center py-12 px-4 sm:px-6 relative z-10">
        <style>{`
          input[type=number]::-webkit-inner-spin-button, 
          input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
        `}</style>

        <div className="w-full max-w-4xl bg-[#1e1e4a]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-white/10 bg-[#232355]/50 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Creare eveniment
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Completează detaliile pentru noul eveniment
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Înapoi</span>
            </button>
          </div>

          <div className="p-8 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Rândul 1: Titlu & Facultate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <FileText size={18} className="text-[#a78bfa]" /> Nume
                  eveniment
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#a78bfa] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <GraduationCap size={18} className="text-[#a78bfa]" />{" "}
                  Facultate
                </label>
                <div className="relative">
                  <select
                    name="faculty_id"
                    value={form.faculty_id}
                    onChange={onChange}
                    className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#a78bfa]"
                  >
                    <option value={0}>Selectează...</option>
                    {faculties.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Rândul 2: Tip & Data Start */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Tag size={18} className="text-[#a78bfa]" /> Tip eveniment
                </label>
                <select
                  name="type_id"
                  value={form.type_id}
                  onChange={onChange}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-[#a78bfa]"
                >
                  <option value={0}>Selectează...</option>
                  {eventTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Calendar size={18} className="text-[#a78bfa]" /> Data
                  eveniment
                </label>
                <input
                  type="datetime-local"
                  name="date_start"
                  value={form.date_start}
                  onChange={onChange}
                  min={getMinDateTime()}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a78bfa] [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Rândul 3: Deadline & Locație */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Clock size={18} className="text-[#a78bfa]" /> Deadline
                  înscrieri
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={form.deadline}
                  onChange={onChange}
                  min={getMinDateTime()}
                  max={getMaxDeadline()}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a78bfa] [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <MapPin size={18} className="text-[#a78bfa]" /> Locație
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>

            {/* Rândul 4: Participanți & Durată */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Users size={18} className="text-[#a78bfa]" /> Nr. max
                  participanți
                </label>
                <input
                  type="number"
                  name="max_participants"
                  value={form.max_participants === 0 ? "" : form.max_participants}
                  onChange={onChange}
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a78bfa]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                  <Timer size={18} className="text-[#a78bfa]" /> Durată
                </label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={onChange}
                  placeholder="Ex: 3 ore"
                  className="w-full bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#a78bfa]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
                <AlignLeft size={18} className="text-[#a78bfa]" /> Descriere
                eveniment
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Descrie pe scurt evenimentul..."
                className="w-full h-24 bg-[#2a2a5e]/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-[#a78bfa]"
              />
            </div>

            {/* Upload Area */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-purple-400" /> Materiale &
                Copertă
              </h3>
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border border-dashed border-white/20 rounded-lg px-4 py-3 flex flex-col items-center justify-center text-center bg-[#2a2a5e]/25 group-hover:border-purple-500/50 transition-all">
                  <Upload className="text-purple-400 mb-1.5" size={16} />
                  <p className="text-white text-xs font-semibold">
                    Adaugă fișiere
                  </p>
                  <p className="text-white/40 text-[11px]">
                    Imagini, PDF, Prezentări
                  </p>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((fileObj) => (
                    <div
                      key={fileObj.id}
                      className={`group relative bg-[#1E1E40] border ${
                        fileObj.isCover
                          ? "border-purple-500/50"
                          : "border-slate-700/50"
                      } rounded-xl overflow-hidden flex flex-col`}
                    >
                      <div className="h-32 w-full bg-[#151632] flex items-center justify-center relative">
                        {fileObj.previewUrl ? (
                          <img
                            src={fileObj.previewUrl}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText size={32} className="text-slate-500" />
                        )}
                        {fileObj.isCover && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-20">
                            COPERTĂ
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
                          {fileObj.previewUrl && !fileObj.isCover && (
                            <button
                              type="button"
                              onClick={() => setAsCover(fileObj.id)}
                              className="p-2 rounded-full bg-purple-500/20 hover:bg-purple-600"
                            >
                              <ImageIcon size={18} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(fileObj.id)}
                            className="p-2 rounded-full bg-red-500/20 hover:bg-red-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-[#1A1A2E]">
                        <p className="text-sm font-medium text-white truncate">
                          {fileObj.file.name}
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {formatSize(fileObj.file.size)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={saveDraft}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-10 py-3 bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/40 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" /> Se salvează...
                  </>
                ) : (
                  "Creare eveniment"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {modal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#161828] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="text-green-400" size={28} />
                <h3 className="text-xl font-bold text-white">{modal.title}</h3>
              </div>
              <p className="text-gray-300 mb-8 text-sm">{modal.message}</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                  onClick={() => setModal({ open: false })}
                >
                  Închide
                </button>
                {modal.canSubmit && (
                  <button
                    className="flex-1 py-2.5 rounded-lg bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-sm"
                    onClick={submitToAdmin}
                  >
                    Trimite la admin
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEventPage;
