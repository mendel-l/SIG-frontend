import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import UsuarioCreate from '../../../constant/UsuarioCreate';
import axios from 'axios';

const URI = 'http://localhost:3001/api/Usrv';

const UsuarioShow = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUsuarios();
  }, []);

  const reloadUsuarios = () => {
    getUsuarios();
  };



  const inhabilitar = async (e, idUsuario) => {
    e.preventDefault();
    try {
      await axios.put(URI + '/' + idUsuario, {
        Estado: 0
      });
      getUsuarios();
  
    } catch (error) {
      console.error('Error al inhabilitar el usuario:', error);
    }
  };
  

  
  const habilitar = async (e, idUsuario) => {
    e.preventDefault();
    try {
      await axios.put(URI + '/' + idUsuario, {
        Estado: 1
      });
      getUsuarios();
  
    } catch (error) {
      console.error('Error al habilitar el usuario:', error);
    }
  };

  const getUsuarios = async () => {
    try {
      const res = await axios.get(URI+"/IP");
      setUsuarios(res.data);
      console.log(res.data)
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
    }
  };
 
 
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    return (
      usuario.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.idPersona.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const headers = [
    { label: 'IDUsuarios', key: 'IDUsuarios' },
    { label: 'Usuario', key: 'Usuario' },
    { label: 'Estado', key: 'Estado' },
    { label: 'idPersona', key: 'idPersona' },
    { label: 'Nombres', key: 'Nombres' },
  ];

  const csvlink = {
    headers: headers,
    data: usuarios,
    filename: 'usuarios.csv',
  };

  const elemento = useRef();

  return (
    <>
      <MainPagetitle mainTitle="Usuarios" pageTitle={'Usuarios'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Usuarios</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> Reporte Usuarios
                      </CSVLink>
                      <Link
                        to={'#'}
                        className="btn btn-primary btn-sm ms-1"
                        data-bs-toggle="offcanvas"
                        onClick={() => elemento.current.showUsuarioModal()}
                      >
                        + Agregar Usuario
                      </Link>
                    </div>

                    <div className="input-group search-area">
                      <span className="input-group-text rounded-0">
                        <Link to={'#'}>
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="8.78605" cy="8.78605" r="8.23951" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14.5168 14.9447L17.7471 18.1667" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </span>
                      <input type="text" className="form-control rounded-0" placeholder="Buscar Usuario" value={searchTerm} onChange={handleSearch} />
                    </div>
                  </div>
                  <table className="table ItemsCheckboxSec dataTable no-footer mb-0">
                    <thead>
                      <tr>
                        <th>Id Usuarios</th>
                        <th>Nombre Usuario</th>
                        <th>Estado</th>
                     
                        <th>Id Persona</th>
                        <th>Nombre Persona</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.map((usuario) => (
                        <tr key={usuario.IDUsuarios}>
                            <td>{usuario.IDUsuarios}</td>
                            <td>{usuario.Usuario}</td>
                          
                            <td>
                                <span className={`badge light border-0 ${usuario.Estado === 1 ? 'badge-success' : 'badge-danger'}`}>
                                {usuario.Estado === 1 ? 'Activo' : 'Inactivo'}
                               </span>
                               </td>
                            <td>{usuario.idPersona}</td>
                            <td>{usuario.Nombres}</td>
                        
                            
                            <td>                            <div>
                            <button onClick={(e) => inhabilitar(e, usuario.IDUsuarios)} className="btn btn-danger">
                              Desactivar
                            </button>
                          </div>
                          </td>
                          <td>                            <div>
                            <button onClick={(e) => habilitar(e, usuario.IDUsuarios)} className="btn btn-success">
                              Activar
                            </button>
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
        </div>
      </div>
      <UsuarioCreate ref={elemento} Title="Agregar Usuario" reloadUsuarios={reloadUsuarios} />
    </>
  );
};

export default UsuarioShow;
