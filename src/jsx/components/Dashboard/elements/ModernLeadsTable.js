import React from 'react';

const ModernLeadsTable = () => {
  const leadsData = [
    {
      id: 1,
      name: 'Jacob Jones',
      avatar: '/images/avatar/1.jpg',
      source: 'Website',
      status: 'Contacted',
      lastContact: '01 January 2025',
      progress: 30,
      actions: ['edit', 'more']
    },
    {
      id: 2,
      name: 'Kristin Watson',
      avatar: '/images/avatar/2.jpg',
      source: 'Email',
      status: 'Done',
      lastContact: '07 January 2025',
      progress: 100,
      actions: ['edit', 'more']
    },
    {
      id: 3,
      name: 'Ronald Richards',
      avatar: '/images/avatar/3.jpg',
      source: 'Social Media',
      status: 'Contacted',
      lastContact: '09 January 2025',
      progress: 30,
      actions: ['edit', 'more']
    }
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Contacted': 'bg-light text-dark',
      'Done': 'bg-success text-white',
      'Pending': 'bg-warning text-dark'
    };
    
    return (
      <span className={`badge ${statusClasses[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="col-12 mb-4">
      <div className="card modern-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">Leads</h5>
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

          <div className="table-responsive">
            <table className="table table-hover modern-table">
              <thead>
                <tr>
                  <th className="border-0">Lead</th>
                  <th className="border-0">Source</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Last Contact</th>
                  <th className="border-0">Progress</th>
                  <th className="border-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {leadsData.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-3">
                          <img 
                            src={lead.avatar} 
                            alt={lead.name}
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-semibold">{lead.name}</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted">{lead.source}</span>
                    </td>
                    <td>
                      {getStatusBadge(lead.status)}
                    </td>
                    <td>
                      <span className="text-muted">{lead.lastContact}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="progress me-2" style={{ width: '60px', height: '6px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${lead.progress}%` }}
                          ></div>
                        </div>
                        <small className="text-muted">{lead.progress}%</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-primary me-2" title="Edit">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary" 
                            type="button" 
                            data-bs-toggle="dropdown"
                            title="More options"
                          >
                            <i className="bi bi-three-dots"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">View Details</a></li>
                            <li><a className="dropdown-item" href="#">Edit Lead</a></li>
                            <li><a className="dropdown-item" href="#">Delete Lead</a></li>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLeadsTable;
