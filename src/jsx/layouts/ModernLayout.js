import React from 'react';
import { Outlet } from 'react-router-dom';
import ModernSidebar from './nav/ModernSidebar';
import ModernHeader from './nav/ModernHeader';

const ModernLayout = () => {
  return (
    <div className="modern-layout">
      <ModernSidebar />
      <ModernHeader />
      <main className="modern-main">
        <Outlet />
      </main>
    </div>
  );
};

export default ModernLayout;
