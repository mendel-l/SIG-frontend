import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MainPagetitle from '../../layouts/MainPagetitle';

const tableData = [
    { title: 'Aaron', designation: 'Civil Engineer', rating : '4', added : 'John Marry', date: '14 April 2023' },
    { title: 'Cedric', designation: 'Software Engineer', rating : '3', added : 'Caty Fsa', date: '17 April 2023' },
    { title: 'Ethan', designation: 'Website Engineer', rating : '2', added : 'John Marry', date: '19 April 2023' },
    { title: 'Jack', designation: 'Civil Engineer', rating : '4', added : 'Geeta Marry', date: '14 April 2023' },
    { title: 'Joe', designation: 'Software Engineer', rating : '3', added : 'Caty Fsa', date: '12 April 2023' },
    { title: 'Khalid', designation: 'Electrical Engineer', rating : '4', added : 'Geeta Marry', date: '10 May 2023' },
    { title: 'Morris', designation: 'Computer Enginner', rating : '3', added : 'John Marry', date: '11 May 2023' },
    { title: 'Peter', designation: 'Software Enginner', rating : '4', added : 'John Marry', date: '14 April 2023' },
    { title: 'Robin', designation: 'Computer Enginner', rating : '2', added : 'Caty Fsa', date: '25 May 2023' },
    { title: 'Samuel', designation: 'Civil Enginner', rating : '3', added : 'Geeta Marry', date: '14 April 2023' },
    { title: 'Sandy', designation: 'Electrical Enginner', rating : '4', added : 'John Marry', date: '19 May 2023' },
    { title: 'Scott', designation: 'Software Engineer', rating : '3', added : 'Caty Fsa', date: '30 April 2023' },  
];


const Performance = () => {     
    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 10;
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
            <MainPagetitle mainTitle='Performance' pageTitle="Performance"  parentTitle="Home" /> 
            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-xl-12">
                        <div className="card">                            
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects manage-client">   
                                    <div className="tbl-caption">
                                        <h4 className="heading mb-0">Performance Indicators</h4>                                        
                                    </div>          
                                    <div id="empoloyees-tblwrapper" className="dataTables_wrapper no-footer">
                                        <table id="projects-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Designation</th>
                                                    <th>Rating</th>
                                                    <th>Added By</th>   
                                                    <th>Created Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((item, index)=>(
                                                    <tr key={index}>
                                                        <td>
                                                            <Link to={"#"}>{item.title}</Link>
                                                        </td>
                                                        <td><span>{item.designation}</span></td>
                                                        <td>
                                                            {item.rating === '4' ?
                                                                <>
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}                                                            
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                </>
                                                                : 
                                                                item.rating === '3' ?
                                                                <>
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}                                                                    
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                </>
                                                                : 
                                                                item.rating === '2' ?
                                                                    <>
                                                                        <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}
                                                                        <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}                                                                    
                                                                        <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                        <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                    </>
                                                                : 
                                                                <>
                                                                    <i className="fa-sharp fa-solid fa-star text-orange"></i>{" "}                                                                 
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                    <i className="fa-solid fa-star-half-stroke text-orange"></i>{" "}
                                                                </>

                                                                }
                                                            <span>{item.rating}.0</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.added}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.date}</span>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Performance;