import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Modal, Offcanvas } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import ClienteCreate from '../../../constant/ClienteCreate';
import axios from 'axios';
const URI = 'http://localhost:3001/api/cliente'
const CompClienteShow = () => {
  const [clientes, setClientes] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); //busqueda
  useEffect(() => {
    getCliente()
  }, [])

  const reloadClientes = () => {
    getCliente();
  };

  //Procedimiento para mostrar todos los clientes
  const getCliente = async () =>{
    const res = await axios.get(URI)
    setClientes(res.data)
  }
  //Procedimiento para eliminar un cliente
  const deleteCliente = async (idCliente) => {
    await axios.delete('${URI}${idCliente}')
    getCliente()
  }
  
    //procedimiento para hacer la busqueda
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
  
    // Filtrar la lista de inventario por el término de búsqueda
    const filtered = clientes.filter((item) => {
      return (
        item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Nit.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const headers = [
    { label: "idCliente", key: "idCliente" },
    { label: "Nombre", key: "Nombre" },
    { label: "Nit", key: "Nit" },
    { label: "Telefono", key: "Telefono" },
    { label: "Estado", key: "Estado" },
    { label: "createAt", key: "createAt" },

  ];

  const csvlink = {
    headers: headers,
    data: clientes,
    filename: "csvfile.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = clientes.slice(firstIndex, lastIndex); //cambio 1
  const npage = Math.ceil(clientes.length / recordsPage);
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

  const cliente = useRef();

  return (
    <>
      <MainPagetitle mainTitle="Cliente" pageTitle={'Cliente'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Clientes</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Exportar reporte
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => cliente.current.showEmployeModal()}
                      >+ Agregar Cliente</Link> {" "}
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
					              <input type="text" className="form-control rounded-0" placeholder="Buscar Cliente (Nombre/NIT)" value={searchTerm} onChange={handleSearch} />
					          </div>

                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>IDCliente</th>
                          <th>Nombre</th>
                          <th>Nit</th>
                          <th>Telefono</th>
                          <th>Estado</th>
                          <th>Creado</th>
                          <th></th>
                          <th></th>
                       
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map ( (clientes) => (
                            <tr key={ clientes.idCliente}>
                                <td>{ clientes.idCliente}</td> 
                                <td>{ clientes.Nombre}</td>
                                <td>{ clientes.Nit}</td>
                                <td>{ clientes.Telefono}</td>
                                <td>
                                <span className={`badge light border-0 ${clientes.Estado === true ? 'badge-success' : 'badge-danger'}`}>
                                {clientes.Estado === true ? 'Activo' : 'Inactivo'}
                               </span>
                               </td>
                                <td>{ clientes.createdAt}</td>
                                <td>
                              <div>
                                <Link to={`/edit-cliente/${clientes.idCliente}`} className='btn btn-info'>Editar</Link>
                             
                              </div>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        {/* cambio 2 */}
                      Mostrado {lastIndex - recordsPage + 1} to{" "}  
                      {clientes.length < lastIndex ? clientes.length : lastIndex}
                      {" "}of {clientes.length} entries

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
      <ClienteCreate
        ref={cliente}
        Title="Add Inventario"
        reloadClientes={reloadClientes}
      />
    </>
  );
};

export default CompClienteShow;