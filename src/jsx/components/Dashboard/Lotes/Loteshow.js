import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import LoteCreate from '../../../constant/LoteCreate'; // Cambiado
import axios from 'axios';

const URI = 'http://localhost:3001/api/lote'; // Cambiado

const CompLoteShow = () => {
  const [lotes, setLotes] = useState([]); // Cambiado
  const [searchTerm, setSearchTerm] = useState(''); //busqueda
  useEffect(() => {
    getLotes(); // Cambiado
  }, []);

  // Esto es para recargar la página al momento de crear un elemento de lote
  const reloadLotes = () => {
    // Esta función se pasará a LoteCreate
    // y se llamará para actualizar el estado local
    getLotes(); // Cambiado
  };

  // Procedimiento para mostrar todos los elementos de lote
  const getLotes = async () => {
    const res = await axios.get(`http://localhost:3001/api/lote/getAllInner`);
    setLotes(res.data);
  };

  // Procedimiento para eliminar un elemento de lote
  const deleteLote = async (IDLote) => {
    await axios.delete(`${URI}/${IDLote}`);
    getLotes(); // Cambiado
  };

    //procedimiento para hacer la busqueda
    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };
  
    // Filtrar la lista de inventario por el término de búsqueda
    const filtered = lotes.filter((item) => {
      return (
        item.IDLote.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const headers = [
    { label: "IDLote", key: "IDLote" },
    { label: "Precio de Compra", key: "PrecioCompra" },
    { label: "Fecha de Ingreso", key: "FechaIngreso" },
    { label: "Fecha de Vencimiento", key: "FechaVencimiento" },
    { label: "Cantidad de Compra", key: "CantidadCompra" },
    { label: "Cantidad Disponible", key: "CantidadDisponible" },
    { label: "ID Proveedor", key: "IDProveedor" },
    { label: "ID Medicamento", key: "IDMedicamento" },
    { label: "Estado", key: "Estado" },
  ];

  const csvlink = {
    headers: headers,
    data: lotes,
    filename: "csvfile.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = lotes.slice(firstIndex, lastIndex); // Cambiado
  const npage = Math.ceil(lotes.length / recordsPage);
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
      <MainPagetitle mainTitle="Lote" pageTitle={'Lote'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Lote</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Exportar reporte
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => elemento.current.showLoteModal()} // Cambiado
                      >+ Agregar Lote</Link> {" "}
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
					              <input type="text" className="form-control rounded-0" placeholder="Buscar Lote (ID)" value={searchTerm} onChange={handleSearch} />
					          </div>

                  </div>
                  <div id="lote-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="lote-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>id</th>
                          <th>Precio de Compra</th>
                          <th>Fecha de Ingreso</th>
                          <th>Fecha de Vencimiento</th>
                          <th>Cantidad de Compra</th>
                          <th>Cantidad Disponible</th>
                          <th>Proveedor</th>
                          <th>Medicamento</th>
                          <th>Estado</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((dato) => (
                          <tr key={dato.IDLote}>
                            <td>{dato.IDLote}</td>
                            <td>{dato.PrecioCompra}</td>
                            <td>{dato.Fecha_Ingreso}</td>
                            <td>{dato.Fecha_Vencimiento}</td>
                            <td>{dato.CantidadCompra}</td>
                            <td>{dato.cantidadDisponible}</td>
                            <td>{dato.Proveedor}</td>
                            <td>{dato.Medicamento}</td>
                            <td>
                                <span className={`badge light border-0 ${dato.Estado === true ? 'badge-success' : 'badge-danger'}`}>
                                {dato.Estado === true ? 'Activo' : 'Inactivo'}
                               </span>
                               </td>
                              
                             
                            <div>
                               <td>{<Link to={`/edit-lote/${dato.IDLote}`} className='btn btn-info'>Editar</Link>}</td>
                               {/*<td>{<button onClick={() => deleteLote(dato.IDLote)} className='btn btn-danger'>Eliminar</button> }</td>--*/}
                            </div>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {lotes.length < lastIndex ? lotes.length : lastIndex}
                        {" "}of {lotes.length} entries
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
      <LoteCreate
        ref={elemento}
        Title="Add Lote"
        reloadLotes={reloadLotes} // Cambiado
      />
    </>
  );
};

export default CompLoteShow;
