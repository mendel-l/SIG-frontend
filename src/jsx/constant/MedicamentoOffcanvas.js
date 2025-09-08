import React, { useState, forwardRef, useImperativeHandle  } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import DatePicker from "react-datepicker";

const MedicamentoOffcanvas =forwardRef((props, ref) => {
    const [startDate, setStartDate] = useState(new Date());
    const [addMedicamento , setAddMedicamento] = useState(false);
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddMedicamento(true)
        }    
    }));
    const nav = useNavigate();
    const handleSubmit=(e)=>{
        e.preventDefault();
        nav("#");
    }
    return (
        <>
            <Offcanvas show={addMedicamento} onHide={setAddMedicamento} className="offcanvas-end customeoff" placement='end'>
				<div className="offcanvas-header">
					<h5 className="modal-title" id="#gridSystemModal">Agregar Medicamento</h5>
					<button type="button" className="btn-close" 
						onClick={()=>setAddMedicamento(false)}
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
                                    <label htmlFor="exampleFormControlInput3" className="form-label">NombreMed<span className="text-danger">*</span></label>
                                    <input type="email" className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                {/* Direccion */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Direccion<span className="text-danger">*</span></label>
                                    <input type="direccion" className="form-control" id="DireccionProveedor" placeholder="" />
                                </div>
                                {/* Telefono */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Telefono<span className="text-danger">*</span></label>
                                    <input type="number" className="form-control" id="TelefonoProveedor" placeholder="" />
                                </div>
                                {/* Descripcion */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Descripcion<span className="text-danger">*</span></label>
                                    <input type="descripcion" className="form-control" id="DescripcionProveedor" placeholder="" />
                                </div>
                                {/* Estado */}
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Estado<span className="text-danger">*</span></label>
                                    <input type="bit" className="form-control" id="EstadoProveedor" placeholder="" />
                                </div>	
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                                <Link to={"#"} onClick={()=>setAddMedicamento(false)} className="btn btn-danger light ms-1">Cancelar</Link>
                            </div>
                        </form>
                    </div>
				</div>
			</Offcanvas>     
        </>
    );
});

export default MedicamentoOffcanvas;