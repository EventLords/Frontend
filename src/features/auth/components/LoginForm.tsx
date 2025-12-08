import React from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../../components/ui/InputGroup';
import { Mail, Lock } from 'lucide-react';

export const LoginForm: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 w-full animate-fade-in">
      <InputGroup
        label="E-mail"
        type="email"
        placeholder="exemplu@email.com"
        icon={<Mail size={14} />}
      />

      <InputGroup
        label="Parolă"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={14} />}
      />

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
