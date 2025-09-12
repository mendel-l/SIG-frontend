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

const ModernRevenueChart = () => {
  const revenueData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Revenue',
        type: 'line',
        data: [120, 190, 300, 500, 200, 300],
        borderColor: '#1E40AF',
        backgroundColor: 'rgba(30, 64, 175, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#1E40AF',
        borderWidth: 3
      },
      {
        label: 'Ava Deal Size',
        type: 'bar',
        data: [80, 120, 150, 200, 180, 220],
        backgroundColor: '#E5E7EB',
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
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#E5E7EB',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        grid: {
          color: '#F3F4F6'
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return '$' + value + 'K';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="col-xl-8 mb-4">
      <div className="card modern-card h-100">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Revenue Performance</h5>
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="d-flex align-items-center">
                  <div className="legend-dot me-2" style={{ backgroundColor: '#1E40AF' }}></div>
                  <small className="text-muted">Total Revenue</small>
                </div>
              </div>
              <div className="me-3">
                <div className="d-flex align-items-center">
                  <div className="legend-dot me-2" style={{ backgroundColor: '#E5E7EB' }}></div>
                  <small className="text-muted">Ava Deal Size</small>
                </div>
              </div>
              <div className="dropdown">
                <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Ene 2024 - Dic 2024
                  <i className="bi bi-calendar3 ms-2"></i>
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Ene 2024 - Dic 2024</a></li>
                  <li><a className="dropdown-item" href="#">Ene 2023 - Dic 2023</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ height: '350px' }}>
            <Line data={revenueData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernRevenueChart;
