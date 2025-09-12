import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModernSourceChart = () => {
  const sourceData = {
    labels: ['Website', 'Email', 'Social Media'],
    datasets: [
      {
        data: [35, 25, 15],
        backgroundColor: [
          '#1E40AF',
          '#6B7280', 
          '#3B82F6'
        ],
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
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

  const sourceStats = [
    { name: 'Website', value: 35, change: '+5.2%', trend: 'up' },
    { name: 'Email', value: 25, change: '+3.8%', trend: 'down' },
    { name: 'Social Media', value: 15, change: '+4.5%', trend: 'up' }
  ];

  return (
    <div className="col-xl-4 mb-4">
      <div className="card modern-card h-100">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Source</h5>
            <div className="dropdown">
              <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Weekly
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#">Daily</a></li>
                <li><a className="dropdown-item" href="#">Weekly</a></li>
                <li><a className="dropdown-item" href="#">Monthly</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-1">75</h3>
            <div className="d-flex align-items-center justify-content-center">
              <span className="badge bg-success me-2">
                <i className="bi bi-arrow-up"></i> +3
              </span>
              <small className="text-muted">Increased vs last week</small>
            </div>
          </div>

          <div style={{ height: '150px' }} className="mb-4">
            <Bar data={sourceData} options={options} />
          </div>

          <div className="source-stats">
            {sourceStats.map((stat, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <div 
                    className="legend-dot me-2" 
                    style={{ 
                      backgroundColor: stat.name === 'Website' ? '#1E40AF' : 
                                     stat.name === 'Email' ? '#6B7280' : '#3B82F6' 
                    }}
                  ></div>
                  <span className="text-muted small">{stat.name}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="fw-bold me-2">{stat.value}</span>
                  <span className={`badge ${stat.trend === 'up' ? 'bg-success' : 'bg-danger'} small`}>
                    {stat.trend === 'up' ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>}
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSourceChart;
