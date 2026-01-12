import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';
import AnimatedBackground from '../components/AnimatedBackground';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Header />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
