import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputMask from 'react-input-mask';

const URI = 'http://localhost:3001/api/persona';

const PersonaCreate = forwardRef((props, ref) => {
  const [IDRol, setidRol] = useState('');
  const [nombre, setNombres] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [salario, setSalario] = useState('');
  const [titulacion, setTitulacion] = useState('');
  const [estado, setEstado] = useState('');
  const [roles, setRoles] = useState([]);

  const [addPersona, setAddPersona] = useState(false);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await axios.get('http://localhost:3001/api/rol');
        setRoles(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
      }
    }

    fetchRoles();
  }, []);

  useImperativeHandle(ref, () => ({
    showPersonaModal() {
      setAddPersona(true);
    },
  }));

  const guardar = async (e) => {
    e.preventDefault();  

    try {
      await axios.post(URI, {
        idRol: IDRol,
        Nombres: nombre,
        FechaNacimiento: fechaNacimiento,
        Direccion: direccion,
        Telefono: telefono,
        Salario: salario,
        Titulacion: titulacion,
        Estado: estado,
      });

      props.reloadPersonas();

      setAddPersona(false);
    } catch (error) {
      console.error('Error al guardar la persona:', error);
    }
  };

  return (
    <>
      <Offcanvas show={addPersona} onHide={() => setAddPersona(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Persona</h5>
          <button type="button" className="btn-close" onClick={() => setAddPersona(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="IDRol" className="form-label">ID Rol<span className="text-danger">*</span></label>
                  <select className="form-select" value={IDRol} onChange={(e) => setidRol(e.target.value)} required>
                    <option value="">Selecciona un rol</option>
                    {roles.map((rol) => (
                      <option key={rol.idRol} value={rol.idRol}>
                        {rol.idRol} - {rol.Rol}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={nombre} onChange={(e) => setNombres(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="fecha" className="form-label">Fecha Nacimiento<span className="text-danger">*</span></label>
                  <input type="date" className="form-control" placeholder="" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="direccion" className="form-label">Direccion<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Telefono<span className="text-danger">*</span></label>
                  <InputMask
                    mask="9999 9999" // Define tu máscara según tus necesidades
                    className="form-control"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="salario" className="form-label">Salario<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">Q</span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder=""
                      value={salario}
                      onChange={(e) => setSalario(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                    />
                  </div>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="titulacion" className="form-label">Titulacion<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={titulacion} onChange={(e) => setTitulacion(e.target.value)} required />
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
                <button
                      type="button"
                      className="btn btn-danger light ms-1"
                      onClick={() => {
                        setAddPersona(false);
                        // Restablecer los estados al valor inicial
                        setidRol('');
                        setNombres('');
                        setFechaNacimiento(new Date());
                        setDireccion('');
                        setTelefono('');
                        setSalario('');
                        setTitulacion('');
                        setEstado('');
                      }}
                    >
                      Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default PersonaCreate;
