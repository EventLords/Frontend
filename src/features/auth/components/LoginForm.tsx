import React from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../../components/ui/InputGroup';
import { Mail, Lock } from 'lucide-react';
import { LoginFormData } from '../../../types/auth';

interface LoginFormProps {
  formData: LoginFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors?: Partial<Record<keyof LoginFormData, string>>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ formData, onChange, errors }) => {
  return (
    <div className="flex flex-col gap-5 w-full animate-fade-in">
      <div>
        <InputGroup
          label="E-mail"
          type="email"
          placeholder="exemplu@email.com"
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
          placeholder="••••••••"
          icon={<Lock size={14} />}
          name="password"
          value={formData.password}
          onChange={onChange}
        />
        {errors?.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      {/* Forgot password link */}
      <div className="text-right -mt-2">
        <Link
          to="/forgot-password"
          className="text-xs text-gray-400 hover:text-[#3F3176] font-medium hover:underline transition-colors"
        >
          Ai uitat parola?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
