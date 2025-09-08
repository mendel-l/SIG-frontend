import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MainPagetitle from '../../layouts/MainPagetitle';
import { CSVLink } from 'react-csv';
import axios from 'axios';

const URI = 'http://localhost:3001/api/reports/getLoginControl'

const ReportES = () => {       
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
    { label: "IDControl", key: "IDControl" },
    { label: "Nombres", key: "Nombres" },
    { label: "Usuario", key: "Usuario" },
    { label: "FechaIn", key: "FechaIn" },
    { label: "FechaOut", key: "FechaOut" },
    { label: "Estado", key: "Estado" },
    { label: "HoraOut", key: "HoraOut" }
   
];
const csvlink = {
    headers : headers,
    data : reporte,
    filename: "Reporte Control IO.csv"
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
                                        <h4 className="heading mb-0">Control de Entradas y Salidas</h4>
                                        <div>
                                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm">
                                                <i className="fa-solid fa-file-excel" /> {" "} 
                                                Exportar Reporte I/O
                                            </CSVLink> 
                                        </div>
                                        
                                    </div>          
                                    <div id="report-tblwrapper" className="dataTables_wrapper no-footer">
                                        <table id="reports-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th>ID Control</th>
                                                    <th>Nombres</th>
                                                    <th>Usuario</th>
                                                    <th>Fecha Ingreso</th>
                                                    <th>Fecha Salida</th>
                                                    <th>Estado</th>
                                                    <th>Hora Salida</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reporte.map((reporte)=>(
                                                    <tr key={reporte.IDControl}>
                                                        <td>{ reporte.IDControl}</td>
                                                        <td>{ reporte.Nombres}</td>
                                                        <td>{ reporte.Usuario}</td> 
                                                        <td>{ reporte.FechaIn}</td>
                                                        <td>{ reporte.FechaOut}</td>
                                                        <td>{ reporte.Estado}</td>
                                                        <td>{ reporte.HoraOut}</td>
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

export default ReportES;