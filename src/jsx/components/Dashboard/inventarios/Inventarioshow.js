import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import InventarioCreate from '../../../constant/InventarioCreate'; // Cambiado
import axios from 'axios';

const URI = 'http://localhost:3001/api/inventario'; // Cambiado

const CompInventarioShow = () => {
  const [inventario, setInventario] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); //busqueda

  useEffect(() => {
    getInventario(); // Cambiado
  }, []);

  // Esto es para recargar la página al momento de crear un elemento de inventario
  const reloadInventario = () => {
    // Esta función se pasará a InventarioCreate
    // y se llamará para actualizar el estado local
    getInventario(); // Cambiado
  };

  // Procedimiento para mostrar todos los elementos de inventario
  const getInventario = async () => {
    const res = await axios.get(URI);
    // Combina información del medicamento con los datos de inventario
    const inventarioData = res.data.map(async (item) => {
      const medicamentoRes = await axios.get(`http://localhost:3001/api/medicamento/${item.idMedicamento}`);
      return {
        ...item,
        medicamento: medicamentoRes.data,
      };
    });
    const inventarioWithData = await Promise.all(inventarioData);
    setInventario(inventarioWithData);
  };
  

  // Procedimiento para eliminar un elemento de inventario
  const deleteInventario = async (IdInventario) => {
    await axios.delete(`${URI}/${IdInventario}`);
    getInventario(); // Cambiado
  };

  //procedimiento para hacer la busqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar la lista de inventario por el término de búsqueda
  const filteredInventario = inventario.filter((item) => {
    return (
      item.medicamento.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medicamento.idMedicamento.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });


  const headers = [
    { label: "IdInventario", key: "IdInventario" },
    { label: "Cantidad Disponible", key: "CantidadDisponible" },
    { label: "Precio de Venta", key: "PrecioVenta" },
    { label: "ID Medicamento", key: "idMedicamento" },
    { label: "Estado", key: "Estado" },
  ];

  const csvlink = {
    headers: headers,
    data: inventario,
    filename: "inventario.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = inventario.slice(firstIndex, lastIndex); // Cambiado
  const npage = Math.ceil(inventario.length / recordsPage);
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
      <MainPagetitle mainTitle="Inventario" pageTitle={'Inventario'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Inventario</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Reporte Inventario
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => elemento.current.showEmployeModal()} // Cambiado
                      >+ Agregar Elemento de Inventario</Link> {" "}
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
					              <input type="text" className="form-control rounded-0" placeholder="Buscar (Nombre/ID)" value={searchTerm} onChange={handleSearch} />
					          </div>
                    
                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>id</th>
                          <th>Medicamento</th>
                          <th>Cantidad Disponible</th>
                          <th>Precio de Venta</th>
                          <th>Estado</th>
                          <th></th>
                         
                          
                        </tr>
                      </thead>
                      <tbody>
                          {filteredInventario.map((dato) => (
                          <tr key={dato.IdInventario}>
                        
                            <td>{dato.IdInventario}</td>
                            <td>{dato.medicamento ? `${dato.medicamento.Nombre}` : ''}</td>
                            <td>{dato.CantidadDisponible}</td>
                            <td>{dato.PrecioVenta}</td>
                            <td>
                                <span className={`badge light border-0 ${dato.Estado === true ? 'badge-success' : 'badge-danger'}`}>
                                {dato.Estado === true ? 'Activo' : 'Inactivo'}
                               </span>
                            </td>
                            <td>                            <div>
                              <Link to={`/edit-inventario/${dato.IdInventario}`} className='btn btn-info'>Editar</Link>
                             
                            </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {inventario.length < lastIndex ? inventario.length : lastIndex}
                        {" "}of {inventario.length} entries
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
      <InventarioCreate
        ref={elemento}
        Title="Add Inventario"
        reloadInventario={reloadInventario} // Cambiado
      />
    </>
  );
};

export default CompInventarioShow;
