import React from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "./StudentHeader";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <StudentHeader />
      {/* Main content with padding for fixed header */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;
