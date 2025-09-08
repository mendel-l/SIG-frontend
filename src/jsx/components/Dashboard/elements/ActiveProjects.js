import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { IMAGES } from '../../../constant/theme';

const tableData = [
    {id:'1', name: "Batman", name2 :'Liam Risher',profile: IMAGES.contact1, progresStyle: "primary", progresValue: "53%", assigne: '3', status: 'Inprogress',  duedate: '01 May 2023'},
    {id:'2', name: "Mivy App", name2 :'Honey Risher', profile: IMAGES.contact2, progresStyle: "primary", progresValue: "50%", assigne: '3', status: 'Inprogress',  duedate: '08 June 2023'},
    {id:'3', name: "Crypto App", name2 :'Ankites Risher', profile: IMAGES.contact1, progresStyle: "danger", progresValue: "45%", assigne: '2', status: 'Pending',  duedate: '14 Sep 2023'},
    {id:'4', name: "Bender Project", name2 :'Oliver Noah', profile: IMAGES.contact8, progresStyle: "danger", progresValue: "30%", assigne: '3', status: 'Pending',  duedate: '22 Oct 2023'},
    {id:'5', name: "Canary", name2 :'Elijah James', profile: IMAGES.contact2, progresStyle: "success", progresValue: "40%", assigne: '4', status: 'Completed',  duedate: '16 Nov 2023'},
    {id:'6', name: "Canary", name2 :'Elijah James', profile: IMAGES.contact2, progresStyle: "success", progresValue: "40%", assigne: '4', status: 'Completed',  duedate: '16 Nov 2023'},
    {id:'7', name: "Mivy App", name2 :'Honey Risher', profile: IMAGES.contact2, progresStyle: "primary", progresValue: "50%", assigne: '3', status: 'Inprogress',  duedate: '08 June 2023'},
    {id:'8', name: "Batman", name2 :'Liam Risher',profile: IMAGES.contact1, progresStyle: "primary", progresValue: "53%", assigne: '3', status: 'Inprogress',  duedate: '01 May 2023'},
    {id:'9', name: "Bender Project", name2 :'Oliver Noah', profile: IMAGES.contact8, progresStyle: "danger", progresValue: "30%", assigne: '3', status: 'Pending',  duedate: '22 Oct 2023'},
    {id:'10', name: "Crypto App", name2 :'Ankites Risher', profile: IMAGES.contact1, progresStyle: "danger", progresValue: "45%", assigne: '2', status: 'Pending',  duedate: '14 Sep 2023'},
    {id:'11', name: "Mivy App", name2 :'Honey Risher', profile: IMAGES.contact2, progresStyle: "primary", progresValue: "50%", assigne: '3', status: 'Inprogress',  duedate: '08 June 2023'},
    {id:'12', name: "Batman", name2 :'Liam Risher',profile: IMAGES.contact1, progresStyle: "primary", progresValue: "53%", assigne: '3', status: 'Inprogress',  duedate: '01 May 2023'},
    {id:'13', name: "Bender Project", name2 :'Oliver Noah', profile: IMAGES.contact8, progresStyle: "danger", progresValue: "30%", assigne: '3', status: 'Pending',  duedate: '22 Oct 2023'},
    {id:'14', name: "Canary", name2 :'Elijah James', profile: IMAGES.contact2, progresStyle: "success", progresValue: "40%", assigne: '4', status: 'Completed',  duedate: '16 Nov 2023'},
    {id:'15', name: "Crypto App", name2 :'Ankites Risher', profile: IMAGES.contact1, progresStyle: "danger", progresValue: "45%", assigne: '2', status: 'Pending',  duedate: '14 Sep 2023'},
];


const headers = [
    { label: "Project Name", key: "name" },
    { label: "Project Lead", key: "name2" },
    { label: "Status", key: "status" },
    { label: "Due Date", key: "duedate" },
];

const csvlink = {
    headers : headers,
    data : tableData,
    filename: "csvfile.csv"
}

const ActiveProjects = () => {
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

    const recordsPage = 5;
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
          <div className="card">
            <div className="card-body p-0">
                <div className="table-responsive active-projects shorting">
                
                    <div className="tbl-caption d-flex justify-content-between flex-wrap align-items-center">
                        <h4 className="heading mb-0">Active Projects</h4>
                        <div>                            
                            <CSVLink {...csvlink} className="btn btn-primary light btn-sm "><i className="fa-solid fa-file-excel" /> Export Report </CSVLink>                             
                        </div>
                    </div>
                    <div id="projects-tbl_wrapper" className="dataTables_wrapper no-footer">
                        <table id="projects-tbl" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                            <thead>
                                <tr>
                                    <th className="sorting_asc" >
                                        <div className="form-check custom-checkbox ms-0">
                                            <input type="checkbox" className="form-check-input checkAllInput" required="" 
                                                 onClick={()=>handleCheckedAll(unchecked)}
                                            />
                                            <label className="form-check-label" htmlFor="checkAll"></label>
                                        </div>
                                    </th>
                                    <th>Project Name</th>
                                    <th>Project Lead</th>
                                    <th>Progress</th>
                                    <th>Assignee</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((item, index)=>(
                                    <tr key={index}>
                                        <td className="sorting_1">
                                            <div className="form-check custom-checkbox">
                                                <input type="checkbox"                                                    
                                                    className="form-check-input"                                                     
                                                    id={`projectBox-${item.id}`}
                                                    checked={item.inputchecked}
                                                    onChange={()=>handleChecked(item.id)} 
                                                    required="" 
                                                />
                                                <label className="form-check-label" 
                                                    htmlFor={`projectBox-${item.id}`}>                                                    
                                                </label>
                                            </div>
                                        </td>
                                        <td>{item.name}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={item.profile} className="avatar rounded-circle" alt="" />
                                                <p className="mb-0 ms-2">{item.name2}</p>	
                                            </div>
                                        </td>
                                        <td className="pe-0">
                                            <div className="tbl-progress-box">
                                                <div className="progress">
                                                    <div 
                                                        className={`progress-bar bg-${item.progresStyle}`} 
                                                        style={{width: item.progresValue , height:"5px", borderRadius:"4px"}} >
                                                    </div>
                                                </div>
                                                <span className="text-primary">{item.progresValue}</span>
                                            </div>
                                        </td>
                                        <td className="pe-0">
                                            <div className="avatar-list avatar-list-stacked">
                                                {
                                                    item.assigne === '2' ?
                                                        <>
                                                            <img src={IMAGES.contact9} className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact2} className="avatar rounded-circle" alt="" />                                                        
                                                        </>
                                                    
                                                    :

                                                    item.assigne === '3' ?
                                                        <>
                                                            <img src={IMAGES.contact5} className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact6} className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact7} className="avatar rounded-circle" alt="" />
                                                        </>
                                                    
                                                    :
                                                    item.assigne === '4' ?
                                                        <>
                                                            <img src={IMAGES.contact9}className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact8} className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact7} className="avatar rounded-circle" alt="" />
                                                            <img src={IMAGES.contact6} className="avatar rounded-circle" alt="" />
                                                        </>
                                                    :

                                                    <img src={IMAGES.contact1} className="avatar rounded-circle" alt="" />
                                                    
                                                }
                                            </div>
                                        </td>
                                        <td className="pe-0">
                                            <span className={`badge light border-0 badge-${item.progresStyle}`}>{item.status}</span>
                                        </td>
                                        <td>
                                            <span>{item.duedate}</span>
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

export default ActiveProjects;