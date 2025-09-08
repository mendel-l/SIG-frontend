import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/proveedores';
//aun existe error al guardar datos
const ProveedorCreate = forwardRef((props, ref) => {
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState('')

  const [addProveedor, setAddProveedor] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddProveedor(true);
    },
  }));
  
 //procedimietno para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();
    
    try {
      // Enviar los datos al servidor
      await axios.post(URI, {
        Nombre: nombre,
        Direccion: direccion,
        Telefono: telefono,
        Descripcion: descripcion,
        Estado: estado,
      });

      // Cerrar el modal después de guardar los datos
      setAddProveedor(false);

      // Recargar la lista de proveedores en la página principal
      props.reloadProveedores();
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
    }
  };
  
  return (
    <>
      <Offcanvas show={addProveedor} onHide={() => setAddProveedor(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Proveedor</h5>
          <button type="button" className="btn-close" onClick={() => setAddProveedor(false)}>
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
                  <label htmlFor="direccion" className="form-label">Dirección<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" placeholder="" value={direccion} onChange={(e) => setDireccion(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono<span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="" value={telefono} onChange={(e) => setTelefono(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción<span className="text-danger">*</span> </label>
                  <input type="text" className="form-control" placeholder="" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
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
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddProveedor(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default ProveedorCreate;

