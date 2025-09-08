import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/rol'

const RolCreate = forwardRef((props, ref) => {
  const [rol, setRol] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [vproveedores, setvProveedores] = useState('')
  const [vmedicamentos, setvMedicamentos] = useState('')
  const [vinventario, setvInventario] = useState('')
  const [vcliente, setvCliente] = useState('')
  const [vrol, setvRol] = useState('')
  const [vlote, setvLote] = useState('')
  const [vusuario, setvUsuario] = useState('')
  const [vventa, setvVenta] = useState('')
  const [vpersona, setvPersona] = useState('')
  const [vreportes, setvReportes] = useState('')

  const [addRol, setAddRol] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddRol(true);
    },
  }));
  
 //procedimietno para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();
    
    try {
      // Convertir el valor de estado a booleano
      // const proveedoresBooleano = vproveedores === "1" ? true : false;
      // const medicamentoBooleano = vmedicamentos === "1" ? true : false;
      // const inventarioBooleano = vinventario === "1" ? true : false;
      // const clienteBooleano = vcliente === "1" ? true : false;
      // const roBooleano = vrol === "1" ? true : false;
      // const loteBooleano = vlote === "1" ? true : false;
      // const usuarioBooleano = vusuario === "1" ? true : false;
      // const ventaBooleano = vventa === "1" ? true : false;
      // const personaBooleano = vpersona === "1" ? true : false;
      // const reportesBooleano = vreportes === "1" ? true : false;
      
      // Enviar los datos al servidor
      await axios.post(URI, {
        Rol: rol,
        Descripcion: descripcion,
        vProveedores: vproveedores,
        vMedicamentos: vmedicamentos,
        vInventario: vinventario,
        vCliente: vcliente,
        vRol: vrol,
        vLote: vlote,
        vUsuario: vusuario,
        vVenta: vventa,
        vPersona: vpersona,
        vReportes: vreportes,
      });

      props.reloadRoles();

      setAddRol(false);
    } catch (error) {
      console.error('Error al guardar el rol:', error);
    }
  };
  
  return (
    <>
      <Offcanvas show={addRol} onHide={() => setAddRol(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Rol</h5>
          <button type="button" className="btn-close" onClick={() => setAddRol(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="rol" className="form-label">Rol<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={rol} onChange={(e) => setRol(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripcion<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" placeholder="" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="proveedores" className="form-label">Proveedores<span className="text-danger">*</span></label>
                  <select className="form-select" value={vproveedores} onChange={(e) => setvProveedores(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="medicamentos" className="form-label">Medicamentos<span className="text-danger">*</span></label>
                  <select className="form-select" value={vmedicamentos} onChange={(e) => setvMedicamentos(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="inventario" className="form-label">Inventario<span className="text-danger">*</span></label>
                  <select className="form-select" value={vinventario} onChange={(e) => setvInventario(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="cliente" className="form-label">Cliente<span className="text-danger">*</span></label>
                  <select className="form-select" value={vcliente} onChange={(e) => setvCliente(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="rol" className="form-label">Rol<span className="text-danger">*</span></label>
                  <select className="form-select" value={vrol} onChange={(e) => setvRol(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="lote" className="form-label">Lote<span className="text-danger">*</span></label>
                  <select className="form-select" value={vlote} onChange={(e) => setvLote(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario<span className="text-danger">*</span></label>
                  <select className="form-select" value={vusuario} onChange={(e) => setvUsuario(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="venta" className="form-label">Venta<span className="text-danger">*</span></label>
                  <select className="form-select" value={vventa} onChange={(e) => setvVenta(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="persona" className="form-label">Persona<span className="text-danger">*</span></label>
                  <select className="form-select" value={vpersona} onChange={(e) => setvPersona(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="reportes" className="form-label">Reportes<span className="text-danger">*</span></label>
                  <select className="form-select" value={vreportes} onChange={(e) => setvReportes(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddRol(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default RolCreate;