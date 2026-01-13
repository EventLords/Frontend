import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import Footer from '../components/Footer';

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col student-main-gradient">
      <StudentHeader />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;