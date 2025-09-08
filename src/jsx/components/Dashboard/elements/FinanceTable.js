import React, {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { CSVLink } from 'react-csv';

const tableData = [
    {account:'Fixed Deposit', amount:'800', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Recurring Deposit', amount:'900', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Savving Account', amount:'700', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Current Account', amount:'600', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Salary', amount:'500', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Fixed Deposit', amount:'800', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Recurring Deposit', amount:'900', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Savving Account', amount:'700', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Current Account', amount:'600', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Salary', amount:'500', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Fixed Deposit', amount:'800', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Recurring Deposit', amount:'900', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Savving Account', amount:'700', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Current Account', amount:'600', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Salary', amount:'500', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
    {account:'Recurring Deposit', amount:'900', accountno:'123400000000', branchcode:'5678',branchname:'Bank Of Lundon'},
]   

const headers = [
    { label: "Account Title", key: "account" },
    { label: "Amount", key: "amount" },
    { label: "Account No", key: "accountno" },
    { label: "Branch Code", key: "branchcode" },
    { label: "Branch Name", key: "branchname" },
]
const csvlink = {
    headers : headers,
    data : tableData,
    filename: "csvfile.csv"
}

const FinanceTable = () => {   
    const [currentPage , setCurrentPage] = useState(1);
    const recordsPage = 8;
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
            <div className="card">                            
                <div className="card-body p-0">
                    <div className="table-responsive active-projects manage-client">   
                        <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                            <h4 className="heading mb-0">Finance</h4>
                            <div>
                                <CSVLink {...csvlink} className="btn btn-primary light btn-sm">
                                    <i className="fa-solid fa-file-excel" /> {" "} 
                                    Export Report
                                </CSVLink> 
                            </div>
                            
                        </div>          
                        <div id="finance-tblwrapper" className="dataTables_wrapper no-footer">
                            <table id="empoloyees-tbl1" className="table ItemsCheckboxSec dataTable no-footer mb-0">
                                <thead>
                                    <tr>
                                        <th>Account Title</th>
                                        <th>Amount</th>
                                        <th>Account No</th>
                                        <th>Branch Code</th>
                                        <th>Branch Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((item, index)=>(
                                        <tr key={index}>
                                            <td>
                                                <Link to={"#"} className="text-primary">{item.account}</Link>
                                            </td>
                                            <td><span>{item.amount} $</span></td>
                                            <td>
                                                <span>{item.accountno}</span>
                                            </td>
                                            <td>
                                                <span>{item.branchcode}</span>
                                            </td>
                                            <td>
                                                <span>{item.branchname}</span>
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

export default FinanceTable;