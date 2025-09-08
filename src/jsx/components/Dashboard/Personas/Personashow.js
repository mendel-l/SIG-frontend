import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import PersonaCreate from '../../../constant/PersonaCreate'; // Cambiado
import axios from 'axios';

const URI = 'http://localhost:3001/api/persona'; // Cambiado

const PersonaShow = () => {
  const [personas, setPersonas] = useState([]); // Cambiado
  const [searchTerm, setSearchTerm] = useState(''); //busqueda
  useEffect(() => {
    getPersonas(); // Cambiado
  }, []);

// AREGLEN LA BASE DE DATOS AAAAAAAAAAAAAAAAAAAAAAAA
  const reloadPersonas = () => {

    getPersonas(); // Cambiado
  };

  const getPersonas = async () => {
    const res = await axios.get(`${URI}/getAllInner`);
    setPersonas(res.data);
  };

  const deletePersona = async (CUI) => {
    await axios.delete(`${URI}/${CUI}`);
    getPersonas(); // Cambiado
  };

  //procedimiento para hacer la busqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar la lista de inventario por el término de búsqueda
  const filtered = personas.filter((item) => {
    return (
      item.Nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.idPersona.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const headers = [
    { label: "CUI", key: "CUI" },
    { label: "ID Rol", key: "idRol" },
    { label: "Nombre", key: "Nombres" },
    { label: "Fecha de Nacimiento", key: "FechaNacimiento" },
    { label: "Direccion", key: "Direccion" },
    { label: "Telefono", key: "Telefono" },
    { label: "Salario", key: "Salario" },
    { label: "Titulacion", key: "Titulacion" },
    { label: "Estado", key: "Estado" },
  ];

  const csvlink = {
    headers: headers,
    data: personas,
    filename: "csvfile.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = personas.slice(firstIndex, lastIndex); // Cambiado
  const npage = Math.ceil(personas.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const elemento = useRef(); // Cambiado

  return (
    <>
      <MainPagetitle mainTitle="Persona" pageTitle={'Persona'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Empleados</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Exportar reporte
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => elemento.current.showPersonaModal()} // Cambiado
                      >+ Agregar Empleado</Link> {" "}
                    </div>
                    <div className="input-group search-area">
						          <span className="input-group-text rounded-0">
							          <Link to={"#"}>
								          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
								            <circle cx="8.78605" cy="8.78605" r="8.23951" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
								              <path d="M14.5168 14.9447L17.7471 18.1667" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
							            </svg>
						            </Link>
					            </span>
					              <input type="text" className="form-control rounded-0" placeholder="Buscar Empleado (Nombre/ID)" value={searchTerm} onChange={handleSearch} />
					          </div>
                  </div>
                  <div id="persona-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="persona-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                        <th>ID Persona</th>
                          <th>Nombre</th>
                          <th>Fecha de Nacimiento</th>
                          <th>Direccion</th>
                          <th>Telefono</th>
                          <th>Salario</th>
                          <th>Titulacion</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((dato) => (
                          <tr key={dato.idPersona}>
                            <td>{dato.idPersona}</td>
                            <td>{dato.Nombres}</td>
                            <td>{dato.FechaNacimiento}</td>
                            <td>{dato.Direccion}</td>
                            <td>{dato.Telefono}</td>
                            <td>{`Q ${dato.Salario}`}</td> {/* Modificado para agregar "Q" */}
                            <td>{dato.Titulacion}</td>
                            <td>{dato.Rol}</td>
                            <td>
                                <span className={`badge light border-0 ${dato.Estado === true ? 'badge-success' : 'badge-danger'}`}>
                                {dato.Estado === true ? 'Activo' : 'Inactivo'}
                               </span>
                            </td>
                            <div>
                              <td>                              <Link to={`/edit-persona/${dato.idPersona}`} className='btn btn-info'>Editar</Link>
</td>
                              {/*<button onClick={() => deletePersona(dato.idPersona)} className='btn btn-danger'>Eliminar</button>*/}
                            </div>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {personas.length < lastIndex ? personas.length : lastIndex}
                        {" "}of {personas.length} entries
                      </div>
                      <div
                        className="dataTables_paginate paging_simple_numbers justify-content-center"
                        id="example2_paginate"
                      >
                        <Link
                          className="paginate_button previous disabled"
                          to="#"
                          onClick={prePage}
                        >
                          <i className="fa-solid fa-angle-left" />
                        </Link>
                        <span>
                          {number.map((n, i) => (
                            <Link className={`paginate_button ${currentPage === n ? 'current' : ''} `} key={i}
                              onClick={() => changeCPage(n)}
                            >
                              {n}
                            </Link>
                          ))}
                        </span>
                        <Link
                          className="paginate_button next"
                          to="#"
                          onClick={nextPage}
                        >
                          <i className="fa-solid fa-angle-right" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PersonaCreate
        ref={elemento}
        Title="Add Persona"
        reloadPersonas={reloadPersonas} // Cambiado
      />
    </>
  );
};

export default PersonaShow;
