import React, { useState, forwardRef, useImperativeHandle  } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const EmployeeOffcanvas =forwardRef((props, ref) => {
    const [startDate, setStartDate] = useState(new Date());
    const [addEmploye , setAddEmploye] = useState(false);
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmploye(true)
        }    
    }));
    const nav = useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        nav("#");
    }
    return (
        <>
            <Offcanvas show={addEmploye} onHide={setAddEmploye} className="offcanvas-end customeoff" placement='end'>
				<div className="offcanvas-header">
					<h5 className="modal-title" id="#gridSystemModal">Agregar Cliente</h5>
					<button type="button" className="btn-close" 
						onClick={()=>setAddEmploye(false)}
					>
						<i className="fa-solid fa-xmark"></i>
					</button>
				</div>
				<div className="offcanvas-body">
                    <div className="container-fluid">
                        <div>
                        </div>
                        <form onClick={(e)=>handleSubmit(e)}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">NIT <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                </div>	
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">Direccion <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>	 */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Nombre<span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Apellido <span className="text-danger">*</span></label>
                                    <input type="password" className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div> */}
                                	
                                {/* <div className="col-xl-6 mb-3">
                                    <label className="form-label">Rol<span className="text-danger">*</span></label>
                                    <select className="default-select form-control">
                                        <option  data-display="Select">Seleccione un rol</option>
                                        <option value="html">Usuario</option>
                                        <option value="css">Administrador</option>
                                     
                                    </select>
                                </div> */}
                               
                                {/* <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput88" className="form-label">Telefono <span className="text-danger">*</span></label>
                                    <input type="number" className="form-control" id="exampleFormControlInput88" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput88" className="form-label">Titualcion<span className="text-danger">*</span></label>
                                    <input type="number" className="form-control" id="exampleFormControlInput88" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput99" className="form-label">Fecha de Nacimiento<span className="text-danger">*</span></label>                                    
                                    <DatePicker 
                                        className="form-control"
                                        selected={startDate} 
                                        onChange={(date) => setStartDate(date)} 
                                    />
                                </div> */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput10" className="form-label">Salario <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput10" placeholder="" />
                                </div>		
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                                <Link to={"#"} onClick={()=>setAddEmploye(false)} className="btn btn-danger light ms-1">Cancelar</Link>
                            </div>
                        </form>
                    </div>
				</div>
			</Offcanvas>     
        </>
    );
});

export default EmployeeOffcanvas;