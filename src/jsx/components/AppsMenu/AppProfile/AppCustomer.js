import React, {useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import MainPagetitle from '../../../layouts/MainPagetitle';
import { IMAGES } from '../../../constant/theme';
import EmployeeOffcanvas from '../../../constant/EmployeeOffcanvas';

const tableData = [
    {id: '1', custid:'001', subtitle:'Web Designer', image:IMAGES.contact1, name:'Biam Lucas', email:'demo1@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'USA', status:'Active' },  
    {id: '2', custid:'002', subtitle:'Web Designer', image:IMAGES.contact2, name:'Hrayson Leo', email:'demo2@gmail.com',contact:'+1 123 456 7890', gender: 'Female' , location : 'UK', status:'Active' },  
    {id: '3', custid:'007', subtitle:'Web Designer', image:IMAGES.contact3, name:'Jack Luca', email:'demo3@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'NYC', status:'Pending' },  
    {id: '4', custid:'004', subtitle:'Web Designer', image:IMAGES.contact2, name:'Crayson Leo', email:'demo4@gmail.com', contact:'+1 123 456 7890', gender: 'Female' , location : 'USA', status:'Active' },
    {id: '5', custid:'041', subtitle:'Web Designer', image:IMAGES.contact5, name:'Sack Luca', email:'demo5@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'USA', status:'Active' },  
    {id: '6', custid:'052', subtitle:'Web Designer', image:IMAGES.contact7, name:'Pogan Liam', email:'demo6@gmail.com',contact:'+1 123 456 7890', gender: 'Female' , location : 'UK', status:'Pending' },  
    {id: '7', custid:'006', subtitle:'Web Designer', image:IMAGES.contact1, name:'Benjamin William', email:'demo7@gmail.com',contact:'+1 123 456 7890', gender: 'Female' , location : 'NYC', status:'Active' },
    {id: '8', custid:'008', subtitle:'Web Designer', image:IMAGES.contact2, name:'Ethan Lucas', email:'demo1@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'USA', status:'Active' },  
    {id: '9', custid:'011', subtitle:'Web Designer', image:IMAGES.contact7, name:'Mrayson Levi', email:'demo2@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'NYC', status:'Pending' },  
    {id: '10', custid:'022', subtitle:'Web Designer', image:IMAGES.contact5, name:'Nack Luca', email:'demo3@gmail.com',contact:'+1 123 456 7890', gender: 'Female' , location : 'UK', status:'Active' },  
    {id: '11', custid:'031', subtitle:'Web Designer', image:IMAGES.contact2, name:'Logan Liam', email:'demo7@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'USA', status:'Pending' },  
    {id: '12', custid:'065', subtitle:'Web Designer', image:IMAGES.contact5, name:'Lenjamin William', email:'demo8@gmail.com', contact:'+1 123 456 7890', gender: 'Female' , location : 'NYC', status:'Active' },  
    {id: '13', custid:'036', subtitle:'Web Designer', image:IMAGES.contact7, name:'Theodore William', email:'demo10@gmail.com',contact:'+1 123 456 7890', gender: 'Male' , location : 'UK', status:'Pending' },  
];

const headersTitle = [
    {label:'Customer Id', key:'custid'}, 
    {label:'Name', key:'name'}, 
    {label:'Designation', key:'subtitle'}, 
    {label:'Email Address', key:'email'}, 
    {label:'Contact Number', key:'contact'}, 
    {label:'Gender', key:'gender'}, 
    {label:'Location', key:'location'}, 
    {label:'Status', key:'status'}, 
]

const csvlink = {
    headers : headersTitle,
    data : tableData,
    filename: "csvfile.csv"
}


const AppCustomer = () => {
    const custom = useRef();
    const [currentPage , setCurrentPage] = useState(1);
    const [checked, setChecked] = useState(tableData);
    const [unchecked, setUnChecked] = useState(true);
	const handleChecked = (id)=> {
        let temp = checked.map((data) => {
            if (id === data.id) {
                return { ...data, inputchecked: !data.inputchecked };
            }
            return data;
        });
        setChecked(temp);
    };
    const handleCheckedAll = (value)=> {
        let temp = checked.map((data) => {          
            return { ...data, inputchecked: value };   
        });
        setChecked(temp);
        setUnChecked(!unchecked);
    };
    const recordsPage = 9;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;   
    const records = checked.slice(firstIndex, lastIndex);
    const npage = Math.ceil(checked.length / recordsPage)
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
            <MainPagetitle mainTitle={'Dashboard'} pageTitle={'Customer'} parentTitle={'Customers'} />  
            <div className="container-fluid">
				<div className="row">
					<div className="col-xl-12 bst-seller">
						<div className="d-flex align-items-center justify-content-between mb-4">
							<h4 className="heading mb-0">Customer</h4>
							<div className="d-flex align-items-center">
                                <button type="button" className="btn btn-primary btn-sm me-2"><i className="fa-solid fa-filter me-2"></i>Filter</button>
								<Link to={"#"} className="btn btn-primary btn-sm ms-2" data-bs-toggle="offcanvas"
                                    onClick={()=>custom.current.showEmployeModal()}
                                >
                                    + Add Customer
                                </Link>
								
							</div>
						</div>
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 dt-filter exports">
                                    <div className="tbl-caption">
                                        
                                        <div>
                                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm me-2"><i className="fa-solid fa-file-excel" /> Export Report</CSVLink> 
                                        </div>
									</div>
                                    <div id="appcust-tbl_wrapper" className="dataTables_wrapper no-footer">
                                        <table id="customer-tbl" className="table shorting">
                                            <thead>
                                                <tr>
                                                    <th className="sorting_asc_1" >
                                                        <div className="form-check custom-checkbox ms-0">
                                                            <input type="checkbox" className="form-check-input checkAllInput" required="" 
                                                               onClick={()=>handleCheckedAll(unchecked)}
                                                            />
                                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                                        </div>
                                                    </th>
                                                    <th>Customer ID</th>
                                                    <th>Customer Name</th>
                                                    <th>Email Address</th>
                                                    <th>Contact Number</th>
                                                    <th>Gender</th>
                                                    <th>Location</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((item, index)=>(
                                                    <tr key={index}>
                                                        <td className="sorting_2">
                                                            <div className="form-check11custom-checkbox">
                                                                <input type="checkbox" 
                                                                    className="form-check-input" 
                                                                    id={`app-${item.id}`}
                                                                    checked={item.inputchecked}
                                                                    onChange={()=>handleChecked(item.id)}  
                                                                />
                                                                <label className="form-check-label" htmlFor={`app-${item.id}`}></label>
                                                            </div>
                                                        </td>
                                                        <td><span>{index + 101}</span></td>
                                                        <td>
                                                            <div className="products">
                                                                <img src={item.image} className="avatar avatar-md" alt="" />
                                                                <div>
                                                                    <h6><Link to={"/app-profile-2"}>{item.name}</Link></h6>
                                                                    <span>{item.subtitle}</span>	
                                                                </div>	
                                                            </div>
                                                        </td>
                                                        <td><Link to={"#"} className="text-primary">{item.email}</Link></td>
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
                                                            <span className={`badge light border-0 badge-${item.status === "Active" ? 'success' : 'danger' }`}>{item.status}</span>
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
            <EmployeeOffcanvas
                ref={custom}
                Title="Add Customer"
            /> 
        </>
    );
};

export default AppCustomer;