import React from 'react';
import { Outlet } from 'react-router-dom';
import OrganizerHeader from './OrganizerHeader';
import Footer from '../components/Footer';

const OrganizerLayout: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(180deg, 
          #DFF3E4 0%, 
          rgba(80, 76, 140, 0.8) 20%, 
          #3F3176 30%, 
          #2E1760 35%, 
          #171738 50%, 
          #2E1760 65%, 
          #3F3176 70%, 
          rgba(80, 76, 140, 0.85) 80%, 
          #DFF3E4 100%
        )`
      }}
    >
      <OrganizerHeader />
      {/* Main content with padding for fixed header */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default OrganizerLayout;
