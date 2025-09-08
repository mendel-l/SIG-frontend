import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Modal, Offcanvas } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../layouts/MainPagetitle';
import EmployeeOffcanvas from '../../constant/EmployeeOffcanvas';
import axios from 'axios';

const Inventario = () => {
  const [datos, setDatos] = useState([]); 

  useEffect(() => {
    // Realizar una solicitud al servidor Express para obtener los datos
    axios.get('http://localhost:3001/api/Back/obtener-datos') 
      .then((response) => {
        setDatos(response.data); 
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  
  const headers = [
    { label: "IdInventario", key: "idinventario" },
    { label: "Cantidad Disponible", key: "cantidadDisponible" },
    { label: "Precio Venta", key: "precioVenta" },
    { label: "IdMedicamento", key: "idmedicamento" },

  ];

  const csvlink = {
    headers: headers,
    data: datos,
    filename: "csvfile.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = datos.slice(firstIndex, lastIndex);
  const npage = Math.ceil(datos.length / recordsPage);
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

  const inventario = useRef();

  return (
    <>
      <MainPagetitle mainTitle="Clientes" pageTitle={'Clientes'} parentTitle={'Inicio'} />
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
                        Exportar reporte
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => inventario.current.showEmployeModal()}
                      >+ Agregar Producto</Link> {" "}
                    </div>
                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                          <th>IdInvetario</th>
                          <th>Cantidad Disponible</th>
                          <th>Precio Venta</th>
                          <th>IdMedicamento</th>
                       
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="products">
                                <div>
                                  <h6>{item.Nombre}</h6>
                                </div>
                              </div>
                            </td>
                            <td><span>{item.idCliente}</span></td>
                            <td>{item.Nit}</td>
                            <td><span>{item.telefono}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        Showing {lastIndex - recordsPage + 1} to{" "}
                        {datos.length < lastIndex ? datos.length : lastIndex}
                        {" "}of {datos.length} entries
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
      <EmployeeOffcanvas
        ref={inventario}
        Title="Add Inventario"
      />
    </>
  );
};

export default Inventario;