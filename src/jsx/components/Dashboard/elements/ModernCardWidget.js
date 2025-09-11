import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ModernCardWidget = () => {
  // Datos para Total Leads
  const leadsData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    datasets: [
      {
        data: [120, 190, 300, 500, 200, 300],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  const leadsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  // Datos para Active Opportunities
  const opportunitiesData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [65, 78, 90, 81, 95, 89],
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const opportunitiesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  // Datos para Conversion Ratios
  const conversionData = {
    labels: ['Lead to Qualified', 'Qualified to Proposal', 'Proposal to Closed'],
    datasets: [
      {
        data: [57, 22, 21],
        backgroundColor: ['#1E40AF', '#3B82F6', '#93C5FD'],
        borderWidth: 0
      }
    ]
  };

  const conversionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  return (
    <>
      {/* Total Leads Card */}
      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card modern-card h-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="card-title text-muted mb-1">Total Leads</h6>
                <h3 className="mb-0 fw-bold">1,247</h3>
              </div>
              <div className="bg-primary-light rounded-circle p-2">
                <i className="bi bi-people-fill text-primary"></i>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success me-2">
                <i className="bi bi-arrow-up"></i> +12.5%
              </span>
              <small className="text-muted">Increased vs last week</small>
            </div>
            <div style={{ height: '80px' }}>
              <Line data={leadsData} options={leadsOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Active Opportunities Card */}
      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card modern-card h-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="card-title text-muted mb-1">Active Opportunities</h6>
                <h3 className="mb-0 fw-bold">89</h3>
              </div>
              <div className="bg-success-light rounded-circle p-2">
                <i className="bi bi-graph-up text-success"></i>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success me-2">
                <i className="bi bi-arrow-up"></i> +8.2%
              </span>
              <small className="text-muted">Increased vs last week</small>
            </div>
            <div style={{ height: '80px' }}>
              <Bar data={opportunitiesData} options={opportunitiesOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Ratios Card */}
      <div className="col-xl-4 col-md-6 mb-4">
        <div className="card modern-card h-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 className="card-title text-muted mb-1">Conversion Ratios</h6>
                <h3 className="mb-0 fw-bold">12</h3>
              </div>
              <div className="bg-info-light rounded-circle p-2">
                <i className="bi bi-percent text-info"></i>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success me-2">
                <i className="bi bi-arrow-up"></i> +3
              </span>
              <small className="text-muted">Increased vs last week</small>
            </div>
            <div className="conversion-bars">
              <div className="d-flex align-items-center mb-2">
                <div className="conversion-bar me-2" style={{ width: '57%', backgroundColor: '#1E40AF' }}></div>
                <small className="text-muted">57%</small>
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className="conversion-bar me-2" style={{ width: '22%', backgroundColor: '#3B82F6' }}></div>
                <small className="text-muted">22%</small>
              </div>
              <div className="d-flex align-items-center">
                <div className="conversion-bar me-2" style={{ width: '21%', backgroundColor: '#93C5FD' }}></div>
                <small className="text-muted">21%</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernCardWidget;
