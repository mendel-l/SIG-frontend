import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dashboard-light dark:bg-dashboard-dark text-gray-900 dark:text-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      <div className="transition-all duration-300 lg:pl-16">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="py-4 sm:py-6 lg:py-8">
          <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
