import React from 'react';

const TestComponent = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">¡Aplicación Funcionando!</h4>
            </div>
            <div className="card-body">
              <p>La aplicación está funcionando correctamente.</p>
              <p>Redux Toolkit y React Hook Form están configurados.</p>
              <div className="alert alert-success">
                <strong>¡Éxito!</strong> La plantilla está lista para usar.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
