import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ModernSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
  };

  const menuItems = [
    { icon: 'bi-house', label: 'Dashboard', path: '/dashboard', active: true },
    { icon: 'bi-file-text', label: 'Documents', path: '/documents' },
    { icon: 'bi-check-square', label: 'Tasks', path: '/tasks' },
    { icon: 'bi-globe', label: 'Website', path: '/website' },
    { icon: 'bi-graph-up', label: 'Analytics', path: '/analytics' },
    { icon: 'bi-person', label: 'Profile', path: '/profile' },
    { icon: 'bi-gear', label: 'Settings', path: '/settings' },
    { icon: 'bi-bell', label: 'Notifications', path: '/notifications' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="modern-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-square">
            <div className="logo-shape"></div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                title={item.label}
              >
                <i className={`bi ${item.icon}`}></i>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <img 
              src="/images/avatar/1.jpg" 
              alt="User" 
              className="rounded-circle"
            />
          </div>
        </div>
        <div className="logout-section">
          <button 
            className="nav-link logout-btn" 
            onClick={handleLogout}
            title="Cerrar Sesión"
          >
            <i className="bi bi-box-arrow-right"></i>
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
