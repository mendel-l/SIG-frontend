import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const URI = 'http://localhost:3001/api/persona';

const PersonaEdit = () => {
  const [IDRol, setidRol] = useState('');
  const [nombre, setNombres] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [salario, setSalario] = useState('');
  const [titulacion, setTitulacion] = useState('');
  const [estado, setEstado] = useState('');
  const [roles, setRoles] = useState([]);

  const { CUI } = useParams();
  const navigate = useNavigate();

  const actualizarPersona = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URI}/${CUI}`, {
        idRol: IDRol,
        Nombres: nombre,
        FechaNacimiento: fechaNacimiento,
        Direccion: direccion,
        Telefono: telefono,
        Salario: salario,
        Titulacion: titulacion,
        Estado: estado,
      });
      navigate('/Persona'); // Redirige a la página de personas después de actualizar
    } catch (error) {
      console.error('Error al actualizar la persona:', error);
    }
  };

  useEffect(() => {
    obtenerPersonaPorID();

    async function obtenerRoles() {
      try {
        const res = await axios.get('http://localhost:3001/api/rol');
        setRoles(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de roles:', error);
      }
    }

    obtenerRoles();
  }, []);

  const obtenerPersonaPorID = async () => {
    try {
      const res = await  axios.get(`${URI}/${CUI}`);

      setidRol(res.data.idRol); // Cambiado
      setNombres(res.data.Nombres);
      setFechaNacimiento(res.data.FechaNacimiento);
      setDireccion(res.data.Direccion);
      setTelefono(res.data.Telefono);
      setSalario(res.data.Salario);
      setTitulacion(res.data.Titulacion);
      setEstado(res.data.Estado);
    } catch (error) {
      console.error('Error al obtener la persona:', error);
    }
    console.log(obtenerPersonaPorID.data)
  };

  return (
    <div>
      <h3>Editar Persona</h3>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <form onSubmit={actualizarPersona}>
            <div className="row">
              <div className="col-xl-6 mb-3">
                <label htmlFor="idRol" className="form-label">ID Rol<span className="text-danger">*</span></label>
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
                <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="direccion" className="form-label">Direccion<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="telefono" className="form-label">Telefono<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="salario" className="form-label">Salario<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={salario} onChange={(e) => setSalario(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="titulacion" className="form-label">Titulacion<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={titulacion} onChange={(e) => setTitulacion(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="estado" className="form-label">Estado<span className="text-danger">*</span></label>
                <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary me-1">Actualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonaEdit;


