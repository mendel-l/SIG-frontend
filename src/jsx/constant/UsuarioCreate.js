import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/Usrv';

const UsuarioCreate = forwardRef((props, ref) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContraseña] = useState('');
  const [estado, setEstado] = useState('');
  const [idPersona, setidPersona] = useState('');
  const [personas, setPersonas] = useState([]); // Lista de personas disponibles

  const [addUsuario, setAddUsuario] = useState(false);

  useEffect(() => {
    // Obtener la lista de personas disponibles al cargar el componente
    async function fetchPersonas() {
      try {
        const res = await axios.get('http://localhost:3001/api/persona/active'); // Cambia la URL según tu API
        setPersonas(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de personas:', error);
      }
    }

    fetchPersonas();
  }, []);

  useImperativeHandle(ref, () => ({
    showUsuarioModal() {
      setAddUsuario(true);
    },
  }));

  // Procedimiento para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();

    try {
      // Convertir el valor de estado a booleano
      const estadoBooleano = estado === "1" ? true : false;
      // Enviar los datos al servidor
      await axios.post(URI, {
        Usuario: usuario,
        Contraseña: contrasena,
        Estado: estadoBooleano,
        idPersona: idPersona,
      });

      // Recargar la lista de usuarios en la página principal
      props.reloadUsuarios();

      setAddUsuario(false);
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  return (
    <>
      <Offcanvas show={addUsuario} onHide={() => setAddUsuario(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Usuario</h5>
          <button type="button" className="btn-close" onClick={() => setAddUsuario(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="contrasena" className="form-label">Contraseña<span className="text-danger">*</span> </label>
                  <input type="password" className="form-control" placeholder="" value={contrasena} onChange={(e) => setContraseña(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="persona" className="form-label">Persona<span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={idPersona}
                    onChange={(e) => setidPersona(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una persona</option>
                    {personas.map((persona) => (
                      <option key={persona.idPersona} value={persona.idPersona}>
                        {persona.idPersona} - {persona.Nombres}
                      </option>
                    ))}
                  </select>
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
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddUsuario(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default UsuarioCreate;
