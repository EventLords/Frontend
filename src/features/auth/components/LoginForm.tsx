import React from 'react';
import { Link } from 'react-router-dom';
import InputGroup from '../../../components/ui/InputGroup';
import { Mail, Lock } from 'lucide-react';

export const LoginForm: React.FC = () => {
  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-5 w-full animate-fade-in">
=======
    <form className="flex flex-col gap-5 w-full animate-fade-in">
>>>>>>> 202a381 (Local frontend state before syncing with remote)
      <InputGroup
        label="E-mail"
        type="email"
        placeholder="exemplu@email.com"
        icon={<Mail size={14} />}
<<<<<<< HEAD
=======
        name="email"
>>>>>>> 202a381 (Local frontend state before syncing with remote)
      />

      <InputGroup
        label="Parolă"
        type="password"
        placeholder="••••••••"
        icon={<Lock size={14} />}
<<<<<<< HEAD
=======
        name="password"
>>>>>>> 202a381 (Local frontend state before syncing with remote)
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
<<<<<<< HEAD
    </div>
=======

      {/* Submit Button */}
      <div className="flex justify-center mt-4">
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold py-3 px-8 rounded-full uppercase tracking-widest hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Autentificare
        </button>
      </div>
    </form>
>>>>>>> 202a381 (Local frontend state before syncing with remote)
  );
};

export default LoginForm;
