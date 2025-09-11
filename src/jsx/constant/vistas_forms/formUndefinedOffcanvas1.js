import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from "react-datepicker";
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/slices/uiSlice';

import "react-datepicker/dist/react-datepicker.css";


const GenericFormOffcanvas = forwardRef((props, ref) => {
    const [addEmploye, setAddEmploye] = useState(false);
    const dispatch = useDispatch();
    const nav = useNavigate();
    
    // Configuración de React Hook Form
    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            textBox: '',
            select1: '',
            select2: '',
            datePicker: new Date(),
            numericInput: 0
        }
    });
    
    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddEmploye(true);
        },
        hideModal() {
            setAddEmploye(false);
        }
    }));
    
    const onSubmit = (data) => {
        console.log('Form data:', data);
        dispatch(addNotification({
            message: 'Formulario enviado correctamente',
            type: 'success'
        }));
        // Aquí puedes hacer la petición al backend
        // Ejemplo: dispatch(createUser(data));
        setAddEmploye(false);
        reset();
    };
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="textBox" className="form-label">TextBox<span className="text-danger">*</span></label>
                                    <Controller
                                        name="textBox"
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) => (
                                            <input 
                                                {...field}
                                                type="text" 
                                                className={`form-control ${errors.textBox ? 'is-invalid' : ''}`}
                                                placeholder="Ingrese texto"
                                            />
                                        )}
                                    />
                                    {errors.textBox && (
                                        <div className="invalid-feedback">{errors.textBox.message}</div>
                                    )}
                                </div>	

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="select1" className="form-label">Select 1<span className="text-danger">*</span></label>
                                    <Controller
                                        name="select1"
                                        control={control}
                                        rules={{ required: 'Seleccione una opción' }}
                                        render={({ field }) => (
                                            <select 
                                                {...field}
                                                className={`form-select ${errors.select1 ? 'is-invalid' : ''}`}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="opcion1">Opción 1</option>
                                                <option value="opcion2">Opción 2</option>
                                                <option value="opcion3">Opción 3</option>
                                            </select>
                                        )}
                                    />
                                    {errors.select1 && (
                                        <div className="invalid-feedback">{errors.select1.message}</div>
                                    )}
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="select2" className="form-label">Select 2<span className="text-danger">*</span></label>
                                    <Controller
                                        name="select2"
                                        control={control}
                                        rules={{ required: 'Seleccione una opción' }}
                                        render={({ field }) => (
                                            <select 
                                                {...field}
                                                className={`form-select ${errors.select2 ? 'is-invalid' : ''}`}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="usuario">Usuario</option>
                                                <option value="administrador">Administrador</option>
                                            </select>
                                        )}
                                    />
                                    {errors.select2 && (
                                        <div className="invalid-feedback">{errors.select2.message}</div>
                                    )}
                                </div>

                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="datePicker" className="form-label">DatePicker<span className="text-danger">*</span></label>
                                    <Controller
                                        name="datePicker"
                                        control={control}
                                        rules={{ required: 'Seleccione una fecha' }}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                className={`form-control ${errors.datePicker ? 'is-invalid' : ''}`}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        )}
                                    />
                                    {errors.datePicker && (
                                        <div className="invalid-feedback">{errors.datePicker.message}</div>
                                    )}
                                </div>
                               
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="numericInput" className="form-label">Numeric Input<span className="text-danger">*</span></label>
                                    <Controller
                                        name="numericInput"
                                        control={control}
                                        rules={{ 
                                            required: 'Este campo es requerido',
                                            min: { value: 0, message: 'El valor debe ser mayor a 0' }
                                        }}
                                        render={({ field }) => (
                                            <input 
                                                {...field}
                                                type="number" 
                                                className={`form-control ${errors.numericInput ? 'is-invalid' : ''}`}
                                                placeholder="0"
                                            />
                                        )}
                                    />
                                    {errors.numericInput && (
                                        <div className="invalid-feedback">{errors.numericInput.message}</div>
                                    )}
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

export default GenericFormOffcanvas;