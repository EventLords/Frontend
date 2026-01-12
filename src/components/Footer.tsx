import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/events/logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D0D2B] text-white relative z-10">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Column 1: Logo + Description */}
          <div className="space-y-2">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="UNIfy Logo" className="h-7 w-auto" />
              <span className="font-display font-bold text-base">UNIfy</span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Platforma ta pentru descoperirea și organizarea evenimentelor universitare
            </p>
          </div>

          {/* Column 2: Linkuri utile */}
          <div>
            <h4 className="font-semibold text-xs mb-2">Linkuri utile</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Despre noi
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Autentificare
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Toate evenimentele
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Pentru utilizatori */}
          <div>
            <h4 className="font-semibold text-xs mb-2">Pentru utilizatori</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/students" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Studenți
                </Link>
              </li>
              <li>
                <Link to="/organizers" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Organizatori
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-400 hover:text-[#c4b5fd] text-xs transition-colors">
                  Ghid utilizare
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-semibold text-xs mb-2">Contact</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-xs">
                <Mail size={12} className="text-[#a78bfa] flex-shrink-0" />
                <span className="text-gray-400">contact@unievents.ro</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <Phone size={12} className="text-[#a78bfa] flex-shrink-0" />
                <span className="text-gray-400">+40721517326</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <MapPin size={12} className="text-[#a78bfa] flex-shrink-0" />
                <span className="text-gray-400">Suceava, România</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-3 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            © 2025 UNIfyEvents. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
