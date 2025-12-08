import React from 'react';
import InputGroup from '../../../components/ui/InputGroup';
import { User, Phone, Mail, Lock, Building2, FileText } from 'lucide-react';

export const OrganizerRegisterForm: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 animate-fade-in">
      {/* Row 1 */}
      <InputGroup 
        label="Nume responsabil" 
        icon={<User size={14} />}
      />
      <InputGroup 
        label="Prenume responsabil" 
        icon={<User size={14} />}
      />

      {/* Row 2 */}
      <InputGroup 
        label="E-mail" 
        type="email" 
        icon={<Mail size={14} />}
      />
      <InputGroup 
        label="Parolă" 
        type="password" 
        icon={<Lock size={14} />}
      />

      {/* Row 3 */}
      <InputGroup 
        label="Număr de telefon" 
        type="tel" 
        icon={<Phone size={14} />}
      />
      <InputGroup 
        label="Numele organizației (opțional)" 
        icon={<Building2 size={14} />}
      />

      {/* Row 4 */}
      <InputGroup
        label="Tip organizație"
        icon={<Building2 size={14} />}
        options={['ONG', 'Companie', 'Asociație Studențească', 'Facultate']}
      />
      <InputGroup
        label="Descriere și motivul solicitării"
        icon={<FileText size={14} />}
      />
    </div>
  );
};

export default OrganizerRegisterForm;
