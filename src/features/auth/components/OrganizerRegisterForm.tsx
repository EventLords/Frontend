import React from "react";
import InputGroup from "../../../components/ui/InputGroup";
import { User, Phone, Mail, Lock, Building2, FileText } from "lucide-react";
import { OrganizerRegisterFormData } from "../../../types/auth";

interface OrganizerRegisterFormProps {
  formData: OrganizerRegisterFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  errors?: Partial<Record<keyof OrganizerRegisterFormData, string>>;
}

// Organization type options
const organizationTypeOptions = [
  { value: "ONG", label: "ONG" },
  { value: "companie", label: "Companie" },
  { value: "Asociatie_studenteasca", label: "Asociație Studențească" },
  { value: "Facultate", label: "Facultate" },
];

export const OrganizerRegisterForm: React.FC<OrganizerRegisterFormProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
      {/* Row 1 */}
      <div>
        <InputGroup
          label="Nume responsabil"
          icon={<User size={14} />}
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
        />
        {errors?.lastName && (
          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
        )}
      </div>
      <div>
        <InputGroup
          label="Prenume responsabil"
          icon={<User size={14} />}
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
        />
        {errors?.firstName && (
          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Row 2 */}
      <div>
        <InputGroup
          label="E-mail"
          type="email"
          icon={<Mail size={14} />}
          name="email"
          value={formData.email}
          onChange={onChange}
        />
        {errors?.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <InputGroup
          label="Parolă"
          type="password"
          icon={<Lock size={14} />}
          name="password"
          value={formData.password}
          onChange={onChange}
        />
        {errors?.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      {/* Row 3 */}
      <div>
        <InputGroup
          label="Număr de telefon"
          type="tel"
          icon={<Phone size={14} />}
          name="phone"
          value={formData.phone}
          onChange={onChange}
        />
        {errors?.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
      <div>
        <InputGroup
          label="Numele organizației (opțional)"
          icon={<Building2 size={14} />}
          name="organizationName"
          value={formData.organizationName}
          onChange={onChange}
        />
      </div>

      {/* Row 4 - Full width */}
      <div className="md:col-span-2">
        <InputGroup
          label="Tip organizație"
          icon={<Building2 size={14} />}
          options={organizationTypeOptions}
          name="organizationType"
          value={formData.organizationType}
          onChange={onChange}
        />
        {errors?.organizationType && (
          <p className="text-red-500 text-xs mt-1">{errors.organizationType}</p>
        )}
      </div>
      <div className="md:col-span-2">
        <InputGroup
          label="Descriere și motivul solicitării"
          icon={<FileText size={14} />}
          name="organizationDescription"
          value={formData.organizationDescription}
          onChange={onChange}
          isTextarea
        />
        {errors?.organizationDescription && (
          <p className="text-red-500 text-xs mt-1">
            {errors.organizationDescription}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrganizerRegisterForm;
