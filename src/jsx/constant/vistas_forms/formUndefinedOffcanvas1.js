import React, { useState, forwardRef, useImperativeHandle  } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"; // Asegúrate de importar los estilos CSS


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
                                    <label htmlFor="exampleFormControlInput1" className="form-label">textBox<span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" />
                                </div>	

                                <div className="col-xl-6 mb-3">
                                <label htmlFor="exampleFormControlSelect1" className="form-label">checkBox 1<span className="text-danger">*</span></label>
                                <select className="form-select" id="exampleFormControlSelect1">
                                    <option value="opcion1">Opción 1</option>
                                    <option value="opcion2">Opción 2</option>
                                    <option value="opcion3">Opción 3</option>
                                </select>
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">checkBox 2<span className="text-danger">*</span></label>
                                    <select className="default-select form-control">
                                        <option  data-display="Select">Seleccionar</option>
                                        <option value="html">Usuario</option>
                                        <option value="css">Administrador</option>
                                    </select>
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Calendar/datePiker<span className="text-danger">*</span></label>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                    />
                                </div>
                               
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput88" className="form-label">numericUpDown<span className="text-danger">*</span></label>
                                    <input type="number" className="form-control" id="exampleFormControlInput88" placeholder="" />
                                </div>

                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                                <button type="button" className="btn btn-warning ms-1">Editar</button>
                                <button type="button" className="btn btn-danger ms-1">Eliminar</button>
                                <Link to={"#"} onClick={() => setAddEmploye(false)} className="btn btn-secondary ms-1">Cancelar</Link>
                                <button type="button" className="btn btn-danger ms-1">otro</button>
                            </div>
                        </form>
                    </div>
				</div>
			</Offcanvas>     
        </>
    );
});

export default EmployeeOffcanvas;