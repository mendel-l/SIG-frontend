import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MainPagetitle from '../../layouts/MainPagetitle';
import { CSVLink } from 'react-csv';
import axios from 'axios';

const URI = 'http://localhost:3001/api/reports/getAuditoriaInner'

const ReportAuditoria = () => {       
    const [reporte, setReporte] = useState([]); 
  useEffect(() => {
    getReporte()
  }, [])

  const reloadReportes = () => {
    getReporte();
  };

  //Procedimiento 
  const getReporte = async () =>{
    const res = await axios.get(URI)
    setReporte(res.data)
  }

  const headers = [
    { label: "IdAuditoria", key: "IdAuditoria" },
    { label: "UsuarioModificador", key: "UsuarioModificador" },
    { label: "PersonaModificador", key: "PersonaModificador" },
    { label: "TablaTrabajada", key: "TablaTrabajada" },
    { label: "RegistroTrabajado", key: "RegistroTrabajado" },
    { label: "Accion", key: "Accion" }
   
];
const csvlink = {
    headers : headers,
    data : reporte,
    filename: "Reporte Auditoria.csv"
};
    

    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 10;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;   
    const records = reporte.slice(firstIndex, lastIndex);
    const npage = Math.ceil(reporte.length / recordsPage)
    const number = [...Array(npage + 1).keys()].slice(1)

    function prePage (){
        if(currentPage !== 1){
            setCurrentPage(currentPage - 1)
        }
    }
    function changeCPage (id){
        setCurrentPage(id);
    }
    function nextPage (){
        if(currentPage !== npage){
            setCurrentPage(currentPage + 1)
        }
    }
    return (
        <>
            <MainPagetitle mainTitle="Reports" pageTitle="Generated Report"  parentTitle="Home" /> 
            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-xl-12">
                        <div className="card">                            
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects manage-client">   
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <h4 className="heading mb-0">Auditoria</h4>
                                        <div>
                                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm">
                                                <i className="fa-solid fa-file-excel" /> {" "} 
                                                Exportar Reporte Auditoria
                                            </CSVLink> 
                                        </div>
                                        
                                    </div>          
                                    <div id="report-tblwrapper" className="dataTables_wrapper no-footer">
                                        <table id="reports-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th>ID Auditoria</th>
                                                    <th>Usuario Modificador</th>
                                                    <th>Persona Modificadora</th>
                                                    <th>Tabla Modificada</th>
                                                    <th>Registro Modificado</th>
                                                    <th>Accion</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reporte.map((reporte)=>(
                                                    <tr key={reporte.IdAuditoria}>
                                                        <td>{ reporte.IdAuditoria}</td>
                                                        <td>{ reporte.UsuarioModificador}</td>
                                                        <td>{ reporte.PersonaModificador}</td> 
                                                        <td>{ reporte.TablaTrabajada}</td>
                                                        <td>{ reporte.RegistroTrabajado}</td>
                                                        <td>{ reporte.Accion}</td> 
                                                    </tr>
                                                ))}
                                            </tbody>
                                            
                                        </table>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center">
                                            
                                            <div className='dataTables_info'>
                                                Showing {lastIndex-recordsPage + 1} to{" "}                                    
                                                {reporte.length < lastIndex ? reporte.length : lastIndex}
                                                {" "}of {reporte.length} entries
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
                                                    {number.map((n , i )=>(
                                                        <Link className={`paginate_button ${currentPage === n ? 'current' :  '' } `} key={i}                                            
                                                            onClick={()=>changeCPage(n)}
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
        </>
    );
};

export default ReportAuditoria;