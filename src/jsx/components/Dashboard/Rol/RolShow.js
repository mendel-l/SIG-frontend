import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Modal, Offcanvas } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import RolCreate from '../../../constant/RolCreate';
import axios from 'axios';
const URI = 'http://localhost:3001/api/rol'
const CompRolShow = () => {
  const [roles, setRoles] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); //busqueda
  useEffect(() => {
    getRol()
  }, [])

  const reloadRoles = () => {
    getRol();
  };

  //Procedimiento para mostrar todos los roles
  const getRol = async () =>{
    const res = await axios.get(URI)
    setRoles(res.data)
  }
  //Procedimiento para eliminar un rol
  const deleteRol = async (idRol) => {
    await axios.delete(`${URI}/${idRol}`);
    getRol();
  }
  
  
    //procedimiento para hacer la busqueda
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
  
    // Filtrar la lista de inventario por el término de búsqueda
    const filtered = roles.filter((item) => {
      return (
        item.Rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.idRol.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const headers = [
    { label: "idRol", key: "idRol" },
    { label: "Rol", key: "Rol" },
    { label: "Descripcion", key: "Descripcion" },
    { label: "vProveedores", key: "vProveedores" },
    { label: "vMedicamentos", key: "vMedicamentos" },
    { label: "vInventario", key: "vInventario" },
    { label: "vCliente", key: "vCliente" },
    { label: "vRol", key: "vRol" },
    { label: "vLote", key: "vLote" },
    { label: "vUsuario", key: "vUsuario" },
    { label: "vVenta", key: "vVenta" },
    { label: "vPersona", key: "vPersona" },
    { label: "vReportes", key: "vReportes" },
  ];

  const csvlink = {
    headers: headers,
    data: roles,
    filename: "roles.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = roles.slice(firstIndex, lastIndex); //cambio 1
  const npage = Math.ceil(roles.length / recordsPage);
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

  const elemento = useRef();

  return (
    <>
      <MainPagetitle mainTitle="Rol" pageTitle={'Rol'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Roles</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Exportar Roles
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => elemento.current.showEmployeModal()}
                      >+ Agregar Rol</Link> {" "}
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
					              <input type="text" className="form-control rounded-0" placeholder="Buscar Rol (Nombre/ID)" value={searchTerm} onChange={handleSearch} />
					          </div>

                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>IDRol</th>
                          <th>Rol</th>
                          <th>Descripcion</th>
                          <th>Proveedores</th>
                          <th>Medicamentos</th>
                          <th>Inventario</th>
                          <th>Cliente</th>
                          <th>Rol</th>
                          <th>Lote</th>
                          <th>Usuario</th>
                          <th>Venta</th>
                          <th>Persona</th>
                          <th>Reportes</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map ( (roles) => (
                            <tr key={ roles.idRol}>
                                <td>{ roles.idRol}</td> 
                                <td>{ roles.Rol}</td>
                                <td>{ roles.Descripcion}</td>
                                                            <td>
                              <span className={`badge light border-0 ${roles.vProveedores === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vProveedores === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vMedicamentos === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vMedicamentos === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vInventario === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vInventario === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vCliente === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vCliente === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vRol === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vRol === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vLote === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vLote === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vUsuario === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vUsuario === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vVenta === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vVenta === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vPersona === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vPersona === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge light border-0 ${roles.vReportes === true ? 'badge-success' : 'badge-danger'}`}>
                                {roles.vReportes === true ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>

                              <div>
                              <td>
                                <Link to={`/edit-rol/${roles.idRol}`} className='btn btn-info'>Editar</Link>
                                </td>
                                <td>
                                <button onClick={() => deleteRol(roles.idRol)} className='btn btn-danger'>Eliminar</button>
                                </td>
                              </div>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        {/* cambio 2 */}
                      Mostrado {lastIndex - recordsPage + 1} to{" "}  
                      {roles.length < lastIndex ? roles.length : lastIndex}
                      {" "}of {roles.length} entries

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
      <RolCreate
        ref={elemento}
        Title="Add Inventario"
        reloadRoles={reloadRoles}
      />
    </>
  );
};

export default CompRolShow;