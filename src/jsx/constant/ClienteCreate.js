import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/cliente'

const ClienteCreate = forwardRef((props, ref) => {
  const [nombre, setNombre] = useState('')
  const [nit, setNit] = useState('')
  const [telefono, setTelefono] = useState('')
  const [estado, setEstado] = useState('')

  const [addCliente, setAddCliente] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddCliente(true);
    },
  }));
  
 //procedimietno para guardar los datos
 const guardar = async (e) => {
  e.preventDefault();
    
  try {
    // Enviar los datos al servidor
    await axios.post(URI, {
      Nombre:nombre,
      Nit:nit,
      Telefono:telefono,
      Estado:estado,
    });

    props.reloadClientes(); // Cambiado
    setAddCliente(false);
  } catch (error) {
     console.error('Error al guardar el Cliente:', error);
  }
};
  
  return (
    <>
      <Offcanvas show={addCliente} onHide={() => setAddCliente(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Cliente</h5>
          <button type="button" className="btn-close" onClick={() => setAddCliente(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nit" className="form-label">Nit<span className="text-danger">*</span>
                  </label>
                  <input type="number" className="form-control" placeholder="" value={nit} onChange={(e) => setNit(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono<span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="" value={telefono} onChange={(e) => setTelefono(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                    <label htmlFor="estado" className="form-label">Estado<span className="text-danger">*</span></label>
                    <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                </div>

              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddCliente(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default ClienteCreate;