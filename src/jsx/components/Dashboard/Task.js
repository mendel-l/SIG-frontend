import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import CountUp from 'react-countup';
import { CSVLink } from 'react-csv';

import { IMAGES } from '../../constant/theme';

const cardCounter = [
	{number: '8', countText:'primary', title:'Not Started'},
	{number: '7', countText:'purple', title:'In Progress'},
	{number: '13',countText:'warning',  title:'Testing'},
	{number: '11',countText:'danger',  title:'Cancelled'},
	{number: '21',countText:'success',  title:'Complete'},
	{number: '16',countText:'danger',  title:'Pending'},
];

const tableData = [
    {id: '01', invid:'INV-100023456', assign: '3', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress', select:'High'},    
    {id: '02', invid:'INV-100023567', assign: '4', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert', select:'Low'},    
    {id: '03', invid:'INV-100023987', assign: '4', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML template Issue Complete', select:'Medium'},    
    {id: '04', invid:'INV-100023420', assign: '3', status:'In Progress', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Complete Admin Dashboard Project', select:'Low'},    
    {id: '05', invid:'INV-100023436', assign: '4', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress', select:'High'},    
    {id: '06', invid:'INV-100023123', assign: '5', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert',select:'Low'},    
    {id: '07', invid:'INV-100023987', assign: '4', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML template Issue Complete',select:'Medium'},    
    {id: '08', invid:'INV-100023852', assign: '3', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Complete Admin Dashboard Project',select:'High' },    
    {id: '09', invid:'INV-100023741', assign: '5', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress',select:'Low' },    
    {id: '10', invid:'INV-100023963', assign: '4', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert', select:'High'},
    {id: '11', invid:'INV-100023123', assign: '5', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert',select:'Low'},    
    {id: '12', invid:'INV-100023987', assign: '4', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML template Issue Complete',select:'Medium'},    
    {id: '13', invid:'INV-100023852', assign: '3', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Complete Admin Dashboard Project',select:'High' },    
    {id: '14', invid:'INV-100023741', assign: '5', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress',select:'Low' },    
    {id: '15', invid:'INV-100023963', assign: '4', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert', select:'High'}, 
	{id: '16', invid:'INV-100023456', assign: '3', status:'Complete', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress', select:'High'},    
    {id: '17', invid:'INV-100023567', assign: '4', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML To React Convert', select:'Low'},    
    {id: '18', invid:'INV-100023987', assign: '4', status:'Pending', startdate:'06 May 2023', enddate:'12 june 2023', title: 'HTML template Issue Complete', select:'Medium'},    
    {id: '19', invid:'INV-100023420', assign: '3', status:'In Progress', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Complete Admin Dashboard Project', select:'Low'},    
    {id: '20', invid:'INV-100023436', assign: '4', status:'Testing', startdate:'06 May 2023', enddate:'12 june 2023', title: 'Create Frontend WordPress', select:'High'},    
 
];
const headersTitle = [
    {label:'Employee ID', key:'id'}, 
    {label:'Invoice', key:'invid'}, 
    {label:'Status', key:'status'}, 
    {label:'Name', key:'title'}, 
	{label:'Start Date', key:'startdate'},
	{label:'End Date', key:'enddate'},
	{label:'Priority', key:'select'},
]

const csvlink = {
    headers : headersTitle,
    data : tableData,
    filename: "csvfile.csv"
}

const Task = () => {	

	const [statusPriority, setStatusPriority] = useState(tableData);
	const handleSelect = (id, value)	=> {
		let temp = statusPriority.map((data) => {
			if (id === data.id) {
				return { ...data, select: value };
			}
			return data;
		});
		setStatusPriority(temp);
	};
	const handleAction = (id, value)	=> {
		let temp = statusPriority.map((data) => {
			if (id === data.id) {
				return { ...data, status: value };
			}
			return data;
		});
		setStatusPriority(temp);
	};
    const [unchecked, setUnChecked] = useState(true);
	const handleChecked = (id)=> {
        let temp = statusPriority.map((data) => {
            if (id === data.id) {
                return { ...data, inputchecked: !data.inputchecked };
            }
            return data;
        });
        setStatusPriority(temp);
    };
    const handleCheckedAll = (value)=> {
        let temp = statusPriority.map((data) => {          
            return { ...data, inputchecked: value };   
        });
        setStatusPriority(temp);
        setUnChecked(!unchecked);
    };
    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 13;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;   
    const records = statusPriority.slice(firstIndex, lastIndex);
    const npage = Math.ceil(statusPriority.length / recordsPage)
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
			<div className="container-fluid">				
				<div className="row">
					<div className="col-xl-12">
						<div className="card">
							<div className="card-body">
								<div className="row task">
									{cardCounter.map((item, index)=>(
										<div className="col-xl-2 col-sm-4 col-6" key={index}>
											<div className="task-summary">
												<div className="d-flex align-items-baseline">
													<CountUp className={`mb-0 fs-28 fw-bold me-2 text-${item.countText}`}  end={item.number} duration={'5'} />
													<h6 className='mb-0'>{item.title}</h6>
												</div>
												<p>Tasks assigne</p>
											</div>
										</div>
									))}

								</div>	
							</div>	
						</div>	
					</div>	
					<div className='col-xl-12'>
						<div className="card">            
							<div className="card-body p-0">
								<div className="table-responsive active-projects task-table">   
									<div className="tbl-caption d-flex justify-content-between align-items-center">
										<h4 className="heading mb-0">Task</h4>
										<div>
											<CSVLink {...csvlink} className="btn btn-primary light btn-sm me-2"><i className="fa-solid fa-file-excel" /> Export Report</CSVLink>
										</div>
									</div>    
									<div id="task-tbl_wrapper" className="dataTables_wrapper no-footer">
										<table id="empoloyeestbl2" className="table ItemsCheckboxSec dataTable no-footer mb-2 mb-sm-0">
											<thead>
												<tr>
													<th className="sorting_asc_15" >
														<div className="form-check custom-checkbox ms-0">
															<input type="checkbox" className="form-check-input checkAllInput" required="" 																
																onClick={()=>handleCheckedAll(unchecked)}
															/>
															<label className="form-check-label" htmlFor="checkAll"></label>
														</div>
													</th>
													<th>#</th>
													<th>Name</th>
													<th>Status</th>
													<th>Start Date</th>
													<th>End Date</th>
													<th>Assigned To</th>
													<th>Tags</th>
													<th className="text-end">Priority</th>
												</tr>
											</thead>
											<tbody>
												{records.map((item, index)=>(
													<tr key={index}>
														<td className="sorting_25">
															<div className="form-check custom-checkbox">
																<input type="checkbox" className="form-check-input" 																	
																	id={`user-${item.id}`}
																	checked={item.inputchecked}
																	onChange={()=>handleChecked(item.id)}
																/>
																<label className="form-check-label" htmlFor={`user-${item.id}`}></label>
															</div>
														</td>
														<td><span>{index + 101}</span></td>
														<td>
															<div className="products">
																<div>
																	<h6>{item.title}</h6>
																	<span>{item.invid}</span>
																</div>	
															</div>
														</td>
														<td>
															<Dropdown className="task-dropdown-2">
																<Dropdown.Toggle as="div" className={item.status}>{item.status}</Dropdown.Toggle>
																<Dropdown.Menu className='task-drop-menu'>
																	<Dropdown.Item  onClick={()=>handleAction(item.id,'In Progress')}>In Progress</Dropdown.Item>
																	<Dropdown.Item onClick={()=>handleAction(item.id,'Pending')}>Pending</Dropdown.Item>
																	<Dropdown.Item onClick={()=>handleAction(item.id,'Testing')}>Testing</Dropdown.Item>
																	<Dropdown.Item onClick={()=>handleAction(item.id,'Complete')}>Complete</Dropdown.Item>
																</Dropdown.Menu>
															</Dropdown>															
														</td>
														<td><span>{item.startdate}</span></td>
														<td>
															<span>{item.enddate}</span>
														</td>
														<td>
															<div className="avatar-list avatar-list-stacked">
																{item.assign === "3" ? 																
																	<>
																		<img src={IMAGES.contact6} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact5} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact3} className="avatar avatar-md rounded-circle" alt="" />
																	</>
																: 
																item.assign === "4" ? 
																	<>
																		<img src={IMAGES.contact6} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact5} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact3} className="avatar avatar-md rounded-circle" alt="" />
																		<img src={IMAGES.contact1} className="avatar avatar-md rounded-circle" alt="" />
																	</>
																:

																	<>
																		<img src={IMAGES.contact6} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact5} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact3} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact2} className="avatar avatar-md rounded-circle" alt="" />{" "}
																		<img src={IMAGES.contact1} className="avatar avatar-md rounded-circle" alt="" />
																	</>																	
																}
															</div>
														</td>	
														<td>
															<span className="badge badge-primary light border-0 me-1">Issue</span>
															<span className="badge badge-secondary light border-0 ms-1">HTML</span>
														</td>
														<td className="text-end">															
															<Dropdown className="task-dropdown-2">
																<Dropdown.Toggle as="div" className={item.select}>{item.select}</Dropdown.Toggle>
																<Dropdown.Menu className='task-drop-menu'>
																	<Dropdown.Item onClick={()=>handleSelect(item.id,'High')}>High</Dropdown.Item>
																	<Dropdown.Item onClick={()=>handleSelect(item.id,'Medium')}>Medium</Dropdown.Item>
																	<Dropdown.Item onClick={()=>handleSelect(item.id,'Low')}>Low</Dropdown.Item>																	
																</Dropdown.Menu>
															</Dropdown>
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

export default Task;