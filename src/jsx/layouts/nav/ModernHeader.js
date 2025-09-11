import React from 'react';

const ModernHeader = () => {
  return (
    <header className="modern-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="header-right">
          <div className="last-updated">
            <i className="bi bi-calendar3 me-2"></i>
            <span>Last updated: Feb 28, 2024</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
