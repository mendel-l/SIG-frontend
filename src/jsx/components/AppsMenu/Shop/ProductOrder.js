import React, {useState} from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function DropdonBlog(){
  return(
    <>
      <Dropdown className="dropdown text-sans-serif">          
          <Dropdown.Toggle as="div" variant="" className="i-false">
            <button className="btn btn-primary i-false tp-btn-light sharp" type="button" id="order-dropdown-0">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg"  width="18px" height="18px" viewBox="0 0 24 24" version="1.1">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <circle fill="#000000" cx="12" cy="5" r="2"></circle>
                    <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                    <circle fill="#000000" cx="12" cy="19" r="2"></circle>
                  </g>
                </svg>
              </span>
              </button>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu dropdown-menu-right border py-0">
            <div className="py-2">
              <Link className="dropdown-item" to="/ecom-product-order">Completed</Link>
              <Link className="dropdown-item" to="/ecom-product-order">Processing</Link>
              <Link className="dropdown-item" to="/ecom-product-order">On Hold</Link>
              <Link className="dropdown-item" to="/ecom-product-order">Pending</Link>
              <div className="dropdown-divider" />
              <Link className="dropdown-item text-danger" to="/ecom-product-order">Delete</Link>
            </div>
          </Dropdown.Menu>
        </Dropdown>
    </>
  )
}

const tableData = [
  {id: '101', color: 'success', title:'Ricky Antony', date:'20/05/2023', para:"Ricky Antony, 2392 Main Avenue, Penasauka, New Jersey 02149", status:'Completed', amount:'99'},
  {id: '102', color: 'primary', title:'Kin Rossow', date:'21/05/2023', para:'Kin Rossow, 1 Hollywood Blvd,Beverly Hills, California 90210', status:'Processing', amount:'120'},
  {id: '103', color: 'secondary', title:'Merry Diana', date:'22/05/2023', para:'Merry Diana, 1 Infinite Loop, Cupertino, California 90210', status:'On Hold', amount:'119'},
  {id: '104', color: 'warning ', title:'Bucky Robert', date:'22/05/2023', para:'Bucky Robert, 1 Infinite Loop, Cupertino, California 90210', status:'Pending', amount:'101'},
  {id: '105', color: 'primary', title:'Kin Rossow', date:'21/05/2023', para:'Kin Rossow, 1 Hollywood Blvd,Beverly Hills, California 90210', status:'Processing', amount:'120'},
  {id: '106', color: 'secondary', title:'Merry Diana', date:'22/05/2023', para:'Merry Diana, 1 Infinite Loop, Cupertino, California 90210', status:'On Hold', amount:'119'},
  {id: '107', color: 'warning ', title:'Bucky Robert', date:'22/05/2023', para:'Bucky Robert, 1 Infinite Loop, Cupertino, California 90210', status:'Pending', amount:'101'},
  {id: '108', color: 'success', title:'Ricky Antony', date:'20/05/2023', para:"Ricky Antony, 2392 Main Avenue, Penasauka, New Jersey 02149", status:'Completed', amount:'99'},
  {id: '109', color: 'primary', title:'Kin Rossow', date:'21/05/2023', para:'Kin Rossow, 1 Hollywood Blvd,Beverly Hills, California 90210', status:'Processing', amount:'120'},
  {id: '110', color: 'secondary', title:'Merry Diana', date:'22/05/2023', para:'Merry Diana, 1 Infinite Loop, Cupertino, California 90210', status:'On Hold', amount:'119'},
  {id: '111', color: 'warning ', title:'Bucky Robert', date:'22/05/2023', para:'Bucky Robert, 1 Infinite Loop, Cupertino, California 90210', status:'Pending', amount:'101'},
  {id: '112', color: 'success', title:'Ricky Antony', date:'20/05/2023', para:"Ricky Antony, 2392 Main Avenue, Penasauka, New Jersey 02149", status:'Completed', amount:'99'},
];

const ProductOrder = () => {
  const [unchecked, setUnChecked] = useState(true);
  const [checked, setChecked] = useState(tableData);
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
  return (
    <div className="h-80">        
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm mb-0 table-responsive-lg ">
                      <thead className="text-white bg-primary">
                        <tr>
                          <th className="align-middle">
                            <div className="form-check custom-checkbox ms-1">
                              <input type="checkbox"                                 
                                onClick={()=>handleCheckedAll(unchecked)}
                                className="form-check-input  product_order_single" id="checkAll"
                              />  
                            </div>
                          </th>
                          <th className="align-middle">Order</th>
                          <th className="align-middle pr-7">Date</th>
                          <th className="align-middle minw200">Ship To</th>
                          <th className="align-middle text-end">Status</th>
                          <th className="align-middle text-end">Amount</th>
                          <th className="no-sort text-end" >Action</th>
                        </tr>
                      </thead>
                      <tbody id="orders">
                          {checked.map((item, index)=>(
                            <tr className="btn-reveal-trigger" key={index}>
                              <td className="py-2">
                                <div className={`form-check custom-checkbox checkbox-${item.color}`}>
                                  <input type="checkbox"                                 
                                    id={`mail-${item.id}`}
                                    checked={item.inputchecked}
                                    onChange={()=>handleChecked(item.id)}
                                    className="form-check-input product_order" 
                                  />
                                  <label className="form-check-label" htmlFor={`mail-${item.id}`} />
                                </div>
                              </td>
                              <td className="py-2">
                                <Link to="/ecom-product-order">
                                  <strong>{`#${index+181}`}</strong>
                                </Link>{" "}
                                by <strong>{item.title}</strong>
                                <br />
                                <a href="mailto:ricky@example.com">ricky@example.com</a>
                              </td>
                              <td className="py-2">20/04/2022</td>
                              <td className="py-2">
                                {item.para}
                                <p className="mb-0 text-500">Via Flat Rate</p>
                              </td>
                              <td className="py-2 text-end">
                                <span className={`badge badge-${item.color} badge-sm`}>
                                  {item.status}
                                  <span className="ms-1 fa fa-check" />
                                </span>
                              </td>
                              <td className="py-2 text-end font-w600">${item.amount}</td>
                              <td className="py-2 text-end">
                                  <DropdonBlog />
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProductOrder;