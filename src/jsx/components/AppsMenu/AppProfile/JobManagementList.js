import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { IMAGES } from '../../../constant/theme';

const tableData = [
    { image:IMAGES.contact1, name:'Abdullah Risher', date:'22 March 2023', lastactive:'Monday'},
    { image:IMAGES.contact2, name:'Amare mama', date:'13 May 2023', lastactive:'Tuesday'},
    { image:IMAGES.contact3, name:'Bongani Femi', date:'14 June 2023', lastactive:'Wednesday'},
    { image:IMAGES.contact5, name:'Darius Addo', date:'29 April 2023', lastactive:'Sunday'},
    { image:IMAGES.contact6, name:'Hakim Joy', date:'20 May 2023', lastactive:'Saturday'},
    { image:IMAGES.contact2, name:'Amare mama', date:'13 May 2023', lastactive:'Tuesday'},
    { image:IMAGES.contact5, name:'Darius Addo', date:'29 April 2023', lastactive:'Sunday'},
    { image:IMAGES.contact6, name:'Hakim Joy', date:'20 May 2023', lastactive:'Saturday'},
    
];

const JobManagementList = () => {
    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;   
    const records = tableData.slice(firstIndex, lastIndex);
    const npage = Math.ceil(tableData.length / recordsPage)
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
            <h4 className="heading mb-0"><i className="fa-solid fa-user-plus text-primary me-3 mb-3"></i> Job Management</h4>
            <div className="card h-auto">
                <div className="card-body p-0">
                    <div className="table-responsive active-projects active-projects ">             
                        <div id="job-tbl_wrapper" className="dataTables_wrapper no-footer">
                            <table id="projects-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Date Added</th>
                                        <th>Last active</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((item, index)=>(
                                        <tr key={index}>
                                            
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={item.image} className="avatar avatar-md rounded-circle" alt="" />
                                                    <div className="ms-2">
                                                        <p className="mb-0 text-start font-w500">{item.name}</p>	
                                                        <span>demo@gmail.com</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="mb-0 font-w500">{item.date}</p>	
                                            </td>
                                            <td>
                                                <p className="mb-0 font-w500">{item.lastactive} </p>	
                                            </td>
                                            <td>
                                                <div className="action-button">
                                                    <button type="button" className="btn btn-primary btn-icon-xxs"><i className="fas fa-pencil-alt"></i></button>{" "}
                                                    <button type="button" className="btn btn-danger btn-icon-xxs"><i className="fas fa-trash-alt"></i></button>
                                                    
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                
                            </table>
                            <div className="d-sm-flex text-center justify-content-between align-items-center">
                                <div className='dataTables_info'>
                                    Showing {lastIndex-recordsPage + 1} to{" "}                                    
                                    {tableData.length < lastIndex ? tableData.length : lastIndex}
                                    {" "}of {tableData.length} entries
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
        </>
    );
};

export default JobManagementList;