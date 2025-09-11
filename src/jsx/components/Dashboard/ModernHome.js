import React, { useContext, useEffect } from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import ModernCardWidget from './elements/ModernCardWidget';
import ModernRevenueChart from './elements/ModernRevenueChart';
import ModernSourceChart from './elements/ModernSourceChart';
import ModernLeadsTable from './elements/ModernLeadsTable';

const ModernHome = () => {
  const { changeBackground } = useContext(ThemeContext);
  
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
  }, []);

  return (
    <div className="container-fluid">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1 fw-bold text-dark">Dashboard</h1>
                <p className="text-muted mb-0">Bienvenido a tu panel de control moderno</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="bi bi-calendar3 me-2 text-muted"></i>
                  <span className="text-muted">Last updated: Feb 28, 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="row mb-4">
          <ModernCardWidget />
        </div>

        {/* Charts Row */}
        <div className="row mb-4">
          <ModernRevenueChart />
          <ModernSourceChart />
        </div>

        {/* Leads Table */}
        <div className="row">
          <ModernLeadsTable />
        </div>
    </div>
  );
};

export default ModernHome;
