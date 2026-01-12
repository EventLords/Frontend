import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Upload,
  ArrowLeft,
  Check,
  X,
  File,
  Image,
  Video
} from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { CreateEventData } from '../../../types/organizer';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CreateEventData>({
    name: '',
    type: '',
    deadline: '',
    maxParticipants: 0,
    description: '',
    faculty: '',
    date: '',
    location: '',
    duration: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateEventData, string>>>({});

  const faculties = [
    'FIESC',
    'FDSA',
    'FEFS',
    'FLSC',
    'FIG',
    'FMSB',
    'FSEAP',
    'FSSU',
    'Toate facultățile'
  ];

  const eventTypes = [
    'Workshop',
    'Conferință',
    'Hackathon',
    'Seminar',
    'Târg',
    'Competiție',
    'Training',
    'Altele'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) || 0 : value
    }));
    // Clear error when field is modified
    if (errors[name as keyof CreateEventData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateEventData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Numele evenimentului este obligatoriu';
    if (!formData.type) newErrors.type = 'Tipul evenimentului este obligatoriu';
    if (!formData.deadline) newErrors.deadline = 'Deadline-ul este obligatoriu';
    if (!formData.maxParticipants || formData.maxParticipants <= 0) {
      newErrors.maxParticipants = 'Numărul maxim de participanți trebuie să fie mai mare decât 0';
    }
    if (!formData.description.trim()) newErrors.description = 'Descrierea este obligatorie';
    if (!formData.faculty) newErrors.faculty = 'Facultatea este obligatorie';
    if (!formData.date) newErrors.date = 'Data evenimentului este obligatorie';
    if (!formData.location.trim()) newErrors.location = 'Locația este obligatorie';
    if (!formData.duration.trim()) newErrors.duration = 'Durata este obligatorie';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await eventsService.createEvent(formData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/organizer/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('A apărut o eroare la crearea evenimentului.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField: React.FC<{
    icon: React.ReactNode;
    label: string;
    name: keyof CreateEventData;
    type?: string;
    placeholder?: string;
    value: string | number;
    error?: string;
  }> = ({ icon, label, name, type = 'text', placeholder, value, error }) => (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#4ECDC4]">{icon}</span>
        <label className="text-white/80 text-sm font-medium">{label}</label>
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 bg-[#2a2a5e]/60 border ${
          error ? 'border-red-400' : 'border-white/10'
        } rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  const SelectField: React.FC<{
    icon: React.ReactNode;
    label: string;
    name: keyof CreateEventData;
    options: string[];
    value: string;
    error?: string;
  }> = ({ icon, label, name, options, value, error }) => (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#4ECDC4]">{icon}</span>
        <label className="text-white/80 text-sm font-medium">{label}</label>
      </div>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2.5 bg-[#2a2a5e]/60 border ${
          error ? 'border-red-400' : 'border-white/10'
        } rounded-lg text-white text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors appearance-none cursor-pointer`}
      >
        <option value="" className="bg-[#1a1a4e]">Selectează...</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="bg-[#1a1a4e]">{opt}</option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Eveniment creat cu succes!</h2>
          <p className="text-white/60 text-sm">Redirecționare către dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/organizer/dashboard')}
        className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Înapoi la dashboard</span>
      </button>

      {/* Form Card */}
      <div className="bg-[#1e1e4a]/80 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 text-center">
          <h1 className="text-xl font-bold text-white">Creare eveniment</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column */}
            <div className="space-y-5">
              <InputField
                icon={<FileText size={16} />}
                label="Nume eveniment"
                name="name"
                value={formData.name}
                error={errors.name}
              />
              
              <SelectField
                icon={<Tag size={16} />}
                label="Tip eveniment"
                name="type"
                options={eventTypes}
                value={formData.type}
                error={errors.type}
              />
              
              <InputField
                icon={<Clock size={16} />}
                label="Deadline înscrieri"
                name="deadline"
                type="date"
                value={formData.deadline}
                error={errors.deadline}
              />
              
              <InputField
                icon={<Users size={16} />}
                label="Număr maxim de participanți"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants || ''}
                error={errors.maxParticipants}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <SelectField
                icon={<GraduationCap size={16} />}
                label="Facultate"
                name="faculty"
                options={faculties}
                value={formData.faculty}
                error={errors.faculty}
              />
              
              <InputField
                icon={<Calendar size={16} />}
                label="Data eveniment"
                name="date"
                type="date"
                value={formData.date}
                error={errors.date}
              />
              
              <InputField
                icon={<MapPin size={16} />}
                label="Locație"
                name="location"
                value={formData.location}
                error={errors.location}
              />
              
              <InputField
                icon={<Timer size={16} />}
                label="Durată"
                name="duration"
                placeholder="ex: 3 ore"
                value={formData.duration}
                error={errors.duration}
              />
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#4ECDC4]"><AlignLeft size={16} /></span>
              <label className="text-white/80 text-sm font-medium">Descriere eveniment</label>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 bg-[#2a2a5e]/60 border ${
                errors.description ? 'border-red-400' : 'border-white/10'
              } rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#4ECDC4]/50 transition-colors resize-none`}
              placeholder="Descrie pe scurt evenimentul..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* File Upload Area */}
          <div className="mt-5">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  const newFiles: UploadedFile[] = Array.from(files).map(file => ({
                    id: Math.random().toString(36).substring(7),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file: file
                  }));
                  setUploadedFiles(prev => [...prev, ...newFiles]);
                }
                // Reset input value to allow re-uploading same file
                e.target.value = '';
              }}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#4ECDC4]/40 transition-colors cursor-pointer"
            >
              <Upload size={24} className="mx-auto text-white/40 mb-2" />
              <p className="text-white/60 text-sm">Încarcă document</p>
              <p className="text-white/40 text-xs mt-1">Prezentări/Poze/Fișiere PDF/Video</p>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type.startsWith('image/') ? (
                        <Image size={16} className="text-green-400 shrink-0" />
                      ) : file.type.startsWith('video/') ? (
                        <Video size={16} className="text-purple-400 shrink-0" />
                      ) : (
                        <File size={16} className="text-blue-400 shrink-0" />
                      )}
                      <span className="text-white/80 text-sm truncate">{file.name}</span>
                      <span className="text-white/40 text-xs shrink-0">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#4ECDC4] text-white font-semibold rounded-lg hover:bg-[#3dbdb5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Se creează...
                </>
              ) : (
                'Creare eveniment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
