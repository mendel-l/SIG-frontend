import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import MainPagetitle from '../../layouts/MainPagetitle';
import { CSVLink } from 'react-csv';
import { IMAGES } from '../../constant/theme';

const tableData = [
    {image: IMAGES.contact3, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact1, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
    {image: IMAGES.contact2, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact1, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
    {image: IMAGES.contact5, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact1, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
    {image: IMAGES.contact3, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact6, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
    {image: IMAGES.contact3, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact1, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
    {image: IMAGES.contact3, name: 'John Antony', designation: 'Web Designer', username: 'john.antony',  contact: '+91 123 456 7890', gender: 'Male', location : 'USA', status: 'Active'},
    {image: IMAGES.contact1, name: 'Ricky Antony', designation: 'Manager', username: 'ricky.antony',  contact: '+91 123 456 7890', gender: 'Female', location : 'UK', status: 'Inactive'},
   
]

const headers = [
    { label: "Name", key: "name" },
    { label: "Designation", key: "designation" },
    { label: "User Name", key: "username" },
    { label: "Contact", key: "contact" },
    { label: "Gender", key: "gender" },
    { label: "Location", key: "location" },
    { label: "Status", key: "status" },
];

const csvlink = {
    headers : headers,
    data : tableData,
    filename: "csvfile.csv"
}

const ManageClient = () => {  
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
            <MainPagetitle mainTitle="Manage Client" pageTitle="Manage Client"  parentTitle="Home" /> 
            <div className='container-fluid'>
                <div className='row'>
                    <div className="col-xl-12">
                        <div className="card">                            
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects manage-client">   
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <h4 className="heading mb-0">Manage Client</h4>
                                        <div>
                                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm">
                                                <i className="fa-solid fa-file-excel" /> {" "} 
                                                Export Report
                                            </CSVLink> 
                                        </div>
                                        
                                    </div>          
                                    <div id="manage-tblwrapper" className="dataTables_wrapper no-footer">
                                        <table id="reports-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>User Name</th>
                                                    <th>Contact</th>
                                                    <th>Gender</th>
                                                    <th>Location</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((item, index)=>(
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="products">
                                                                <img src={item.image} className="avatar avatar-md" alt="s" />
                                                                <div>
                                                                    <h6>{item.name}</h6>
                                                                    <span>{item.designation}</span>	
                                                                </div>	
                                                            </div>
                                                        </td>
                                                        <td><span className="text-primary">{item.username}</span></td>
                                                        <td>
                                                            <span>{item.contact}</span>
                                                        </td>
                                                        <td>
                                                            <span>{item.gender}</span>
                                                        </td>	
                                                        <td>
                                                            <span>{item.location}</span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge light border-0 ${item.status === "Active"  ? 'badge-success': 'badge-danger'}`}>{item.status}</span>
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

export default ManageClient;