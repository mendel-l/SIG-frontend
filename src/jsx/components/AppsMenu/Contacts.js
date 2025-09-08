import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../layouts/MainPagetitle';
import EmployeeOffcanvas from '../../constant/EmployeeOffcanvas';
import InviteCustomer from '../../constant/ModalList';
import { IMAGES } from '../../constant/theme';

const tableData = [
    {image:IMAGES.contact1, name:'Biam Lucas', email:'demo1@gmail.com', tags:'Customer', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Sep 2092'},  
    {image:IMAGES.contact2, name:'Hrayson Leo', email:'demo2@gmail.com', tags:'Customer',tags2:'Lead', phone:'(123) 456 789 ', status:'In Progress', dob:'15 Jan 2095'},  
    {image:IMAGES.contact3, name:'Jack Luca', email:'demo3@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'10 Jan 2095'},  
    {image:IMAGES.contact2, name:'Crayson Leo', email:'demo4@gmail.com', tags:'Customer',tags2:'Lead', phone:'', status:'Avalible', dob:'17 Feb 2093'},  
    {image:IMAGES.contact5, name:'Sack Luca', email:'demo5@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'In Progress', dob:'26 Mar 2094'},  
    {image:IMAGES.contact7, name:'Pogan Liam', email:'demo6@gmail.com', tags:'Important', phone:'(123) 456 789 ', status:'Cancelled', dob:'24 July 2096'},  
    {image:IMAGES.contact1, name:'Benjamin William', email:'demo7@gmail.com', tags:'Important',tags2:'Lead', phone:'', status:'Cancelled', dob:'18 Jan 2090'},  
    {image:IMAGES.contact2, name:'Ethan Lucas', email:'demo1@gmail.com', tags:'Customer', phone:'(123) 456 789 ', status:'In Progress', dob:'08 April 2091'},  
    {image:IMAGES.contact7, name:'Mrayson Levi', email:'demo2@gmail.com', tags:'Customer',tags2:'Lead', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Jan 2095'},  
    {image:IMAGES.contact5, name:'Nack Luca', email:'demo3@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'18 Jan 2090'},  
    {image:IMAGES.contact2, name:'Logan Liam', email:'demo7@gmail.com', tags:'Important', phone:'(123) 456 789 ', status:'In Progress', dob:'26 Mar 2094'},  
    {image:IMAGES.contact5, name:'Lenjamin William', email:'demo8@gmail.com', tags:'Important', tags2:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'30 Mar 2089'},  
    {image:IMAGES.contact7, name:'Theodore William', email:'demo10@gmail.com', tags:'Supplier', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Jan 2095'},      
    {image:IMAGES.contact7, name:'Pogan Liam', email:'demo6@gmail.com', tags:'Important', phone:'(123) 456 789 ', status:'Cancelled', dob:'24 July 2096'},  
    {image:IMAGES.contact1, name:'Benjamin William', email:'demo7@gmail.com', tags:'Important',tags2:'Lead', phone:'', status:'Cancelled', dob:'18 Jan 2090'},  
    {image:IMAGES.contact2, name:'Ethan Lucas', email:'demo1@gmail.com', tags:'Customer', phone:'(123) 456 789 ', status:'In Progress', dob:'08 April 2091'},  
    {image:IMAGES.contact7, name:'Mrayson Levi', email:'demo2@gmail.com', tags:'Customer',tags2:'Lead', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Jan 2095'},  
    {image:IMAGES.contact5, name:'Nack Luca', email:'demo3@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'18 Jan 2090'},  
    {image:IMAGES.contact2, name:'Logan Liam', email:'demo7@gmail.com', tags:'Important', phone:'(123) 456 789 ', status:'In Progress', dob:'26 Mar 2094'},  
    {image:IMAGES.contact5, name:'Lenjamin William', email:'demo8@gmail.com', tags:'Important', tags2:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'30 Mar 2089'},  
    {image:IMAGES.contact7, name:'Theodore William', email:'demo10@gmail.com', tags:'Supplier', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Jan 2095'},  
    {image:IMAGES.contact1, name:'Biam Lucas', email:'demo1@gmail.com', tags:'Customer', phone:'(123) 456 789 ', status:'Avalible', dob:'06 Sep 2092'},  
    {image:IMAGES.contact2, name:'Hrayson Leo', email:'demo2@gmail.com', tags:'Customer',tags2:'Lead', phone:'(123) 456 789 ', status:'In Progress', dob:'15 Jan 2095'},  
    {image:IMAGES.contact3, name:'Jack Luca', email:'demo3@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'Cancelled', dob:'10 Jan 2095'},  
    {image:IMAGES.contact2, name:'Crayson Leo', email:'demo4@gmail.com', tags:'Customer',tags2:'Lead', phone:'', status:'Avalible', dob:'17 Feb 2093'},  
    {image:IMAGES.contact5, name:'Sack Luca', email:'demo5@gmail.com', tags:'Lead', phone:'(123) 456 789 ', status:'In Progress', dob:'26 Mar 2094'},  
];

const headersTitle = [
    {label:'Name', key:'name'}, 
    {label:'Email', key:'email'}, 
    {label:'Tags', key:'tags'}, 
    {label:'Tags', key:'tags2'}, 
    {label:'Phone', key:'phone'}, 
    {label:'Status', key:'status'}, 
    {label:'DOB', key:'dob'}, 
    
]

const csvlink = {
    headers : headersTitle,
    data : tableData,
    filename: "csvfile.csv"
}

const Contacts = () => {
    const addcontact = useRef();
    const custom = useRef();    
    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 13;
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
   
	const checkbox = document.querySelectorAll(".sorting_2 input");
	const motherCheckBox = document.querySelector(".sorting_asc_1 input");
        const checkboxFun = (type) => {
        for (let i = 0; i < checkbox.length; i++) {
            const element = checkbox[i];
            if (type === "all") {
                if (motherCheckBox.checked) {
                    element.checked = true;
                } else {
                 element.checked = false;
                }
            } else {
                if (!element.checked) {
                motherCheckBox.checked = false;
                break;
                } else {
                    motherCheckBox.checked = true;
                }
            }
        }
    };
    return (
        <>
            <MainPagetitle parentTitle={'Apps'} pageTitle={'Contacts'}/>
            <div className="container-fluid">
				<div className="row">
					<div className="col-xl-12 active-p">
						<div className="d-flex align-items-center justify-content-between mb-4">
							<h4 className="heading mb-0">Contacts</h4>
							<div>
								<Link to={"#"} className="btn btn-primary btn-sm me-1" data-bs-toggle="offcanvas"
                                    onClick={()=>addcontact.current.showEmployeModal()}
                                >
                                    + Add Contacts
                                </Link>
								{" "} <button type="button" className="btn btn-secondary btn-sm ms-1" 
                                    onClick={()=>custom.current.showInviteModal()}       
                                >
                                    + Invite Customer
								</button>
							</div>
						</div>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 shorting dt-filter exports">
                                    <div className="tbl-caption">
                                        <h4 className="heading mb-0">Contacts</h4>
                                        <div>
                                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-2"><i className="fa-solid fa-file-excel" /> Export Report</CSVLink> 
                                        </div>
									</div>
                                    <div id="contacts-tbl_wrapper" className="dataTables_wrapper no-footer">
                                        <table id="projects-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="sorting_asc_1" >
                                                        <div className="form-check custom-checkbox ms-0">
                                                            <input type="checkbox" className="form-check-input checkAllInput" required="" 
                                                                onClick={() => checkboxFun("all")}
                                                            />
                                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                                        </div>
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Tags</th>
                                                    <th>Phone</th>
                                                    <th>Status</th>
                                                    <th>Dob</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((item, index)=>(
                                                    <tr key={index}>
                                                        <td className="sorting_2">
                                                            <div className="form-check11custom-checkbox">
                                                                <input type="checkbox" className="form-check-input" 
                                                                    id={`contact${index+101}`} required="" 
                                                                    onClick={() => checkboxFun()}
                                                                />
                                                                <label className="form-check-label" htmlFor={`contact${index+101}`}></label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img src={item.image} className="avatar rounded-circle" alt="" />
                                                                <p className="mb-0 ms-2">{item.name}</p>	
                                                            </div>
                                                        </td>
                                                        <td>{item.email}</td>
                                                        
                                                        <td className="pe-0">
                                                            <span 
                                                                className={`badge border-0 badge-sm badge-${item.tags === 'Important' ? 'secondary': 
                                                                    item.tags === 'Customer' ? 'success' : item.tags==='Supplier' ? 'danger' : 'warning' }
                                                                `}
                                                            >
                                                                {item.tags}
                                                            </span>{" "}
                                                            <span className="badge badge-warning border-0 badge-sm">
                                                                {item.tags2}
                                                            </span>
                                                        </td>
                                                        <td className="pe-0">
                                                            {item.contact}
                                                        </td>
                                                        <td className="pe-0 c-status">
                                                            <span><i 
                                                                className=
                                                                {`fa-solid fa-circle text-${item.status==='Avalible' ? 'success' : 
                                                                    item.status==='Cancelled' ? 'danger': 'primary' }`} 
                                                                 />
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span>{item.dob}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>                                
                                        </table>
                                        <div className="d-sm-flex text-center justify-content-between align-items-center">                                            
                                            <div className='dataTables_info'>
                                                Showing {lastIndex-recordsPage + 1} to{" "}
                                                {lastIndex} 
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
            <EmployeeOffcanvas 
                ref={addcontact}
                Title="Add Contacts"
            />
            <InviteCustomer
                ref={custom}
                Title="Invite Customer"
            />
        </>
    );
};

export default Contacts;