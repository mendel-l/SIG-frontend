import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Modal, Offcanvas } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import MedicamentoCreate from '../../../constant/MedicamentoCreate';
import axios from 'axios';
const URI = 'http://localhost:3001/api/medicamento' //-----------------------

const CompMedicamentoShow = () => {
  const [medicamentos, setMedicamentos] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); //busqueda 
  useEffect(() => {
    getmedicamento()
  }, [])

  //esto es para recargar la pagina al momento de crear un medicamento
  const reloadMedicamentos = () => {
    // Esta función se pasará a MedicamentoCreate
    // y se llamará para actualizar el estado local
    getmedicamento();
  };

  //Procedimiento para mostrar todos los proveedores
  const getmedicamento = async () =>{
    const res = await axios.get(URI)
    setMedicamentos(res.data)
  }
  //Procedimiento para eliminar un proveedor
  const deleteMedicamento = async (idMedicamento) => {
    await axios.delete('${URI}${idMedicamento}')
    getmedicamento()
  }
  
  //procedimiento para hacer la busqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filtered = medicamentos.filter((item) => {
    return (
      item.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.idMedicamento.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const headers = [
    { label: "idMedicamento", key: "idMedicamento" },
    { label: "Nombre", key: "Nombre" },
    { label: "Descripcion", key: "Descripcion" },
    { label: "Sustancias", key: "Sustancias" },
    { label: "casaFarmaceutica", key: "casaFarmaceutica" },
    { label: "Estado", key: "Estado" },
  ];

  const csvlink = {
    headers: headers,
    data: medicamentos,
    filename: "medicamento.csv"
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPage = 100;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = medicamentos.slice(firstIndex, lastIndex); //cambio 1
  const npage = Math.ceil(medicamentos.length / recordsPage);
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

  const medicamento = useRef();

  return (
    <>
      <MainPagetitle mainTitle="Medicamento" pageTitle={'Medicamento'} parentTitle={'Inicio'} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                  <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                    <h4 className="heading mb-0">Medicamentos</h4>
                    <div>
                      <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-1">
                        <i className="fa-solid fa-file-excel" /> {" "}
                        Reporte Medicamentos
                      </CSVLink>
                      <Link to={"#"} className="btn btn-primary btn-sm ms-1" data-bs-toggle="offcanvas"
                        onClick={() => medicamento.current.showEmployeModal()}
                      >+ Agregar Medicamento</Link> {" "}
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
					              <input type="text" className="form-control rounded-0" placeholder="Buscar Medicamento (Nombre/ID)" value={searchTerm} onChange={handleSearch} />
					          </div>

                  </div>
                  <div id="employee-tbl_wrapper" className="dataTables_wrapper no-footer">
                    <table id="empoloyees-tblwrapper" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                      <thead>
                        <tr>
                        <th>id</th>
                      <th>Nombre</th>
                      <th>Descripcion</th>
                      <th>Sustancias</th>
                      <th>casa Farmaceutica</th>
                      <th>Estado</th>
                      <th></th>
                    
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map ( (dato) => (
                            <tr key={ dato.idMedicamento}>
                                <td>{ dato.idMedicamento}</td> 
                                <td>{ dato.Nombre}</td>
                                <td>{ dato.Descripcion}</td>
                                <td>{ dato.Sustancias}</td>
                                <td>{ dato.casaFarmaceutica}</td>
                                <td>
                                <span className={`badge light border-0 ${dato.Estado === true ? 'badge-success' : 'badge-danger'}`}>
                                {dato.Estado === true ? 'Activo' : 'Inactivo'}
                               </span>
                               </td>
                               <td>
                               <div>
                                <Link to={`/edit-medicamento/${dato.idMedicamento}`} className='btn btn-info'>Editar</Link>
                              
                              </div>
                               </td>
                              
                            </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="d-sm-flex text-center justify-content-between align-items-center">
                      <div className='dataTables_info'>
                        {/* cambio 2 */}
                      Showing {lastIndex - recordsPage + 1} to{" "}  
                      {medicamentos.length < lastIndex ? medicamentos.length : lastIndex}
                      {" "}of {medicamentos.length} entries

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
      <MedicamentoCreate
        ref={medicamento}
        Title="Add Inventario"
        reloadMedicamentos={reloadMedicamentos} // Pasar la función aquí
      />
    </>
  );
};

export default CompMedicamentoShow;

