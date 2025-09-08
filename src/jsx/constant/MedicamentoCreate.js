import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/medicamento'; // Cambiamos la URL a la de medicamentos

const MedicamentoCreate = forwardRef((props, ref) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [sustancias, setSustancias] = useState('');
  const [casafarma, setcasaFarmaceutica] = useState('');
  const [estado, setEstado] = useState('');

  const [addMedicamento, setAddMedicamento] = useState(false);
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddMedicamento(true);
    },
  }));

  // Procedimiento para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();

    try {
      // Convertir el valor de estado a booleano
      const estadoBooleano = estado === "1" ? true : false;
      // Enviar los datos al servidor
      await axios.post(URI, {
        Nombre: nombre,
        Descripcion: descripcion,
        Sustancias: sustancias,
        casaFarmaceutica: casafarma,
        Estado: estado
      });

      // Recargar la lista de medicamentos en la página principal
      //al darle al boton guardar no hay necesidad de recargar la pagina para mostrar el nuevo medicamento
      props.reloadMedicamentos(); // Debes crear una función similar para recargar los medicamentos.

      // Cerrar el modal después de guardar los datos
      setAddMedicamento(false);

    } catch (error) {
      console.error('Error al guardar el medicamento:', error);
    }
  };

return (
  <>
    <Offcanvas show={addMedicamento} onHide={() => setAddMedicamento(false)} className="offcanvas-end customeoff" placement="end">
      <div className="offcanvas-header">
        <h5 className="modal-title" id="#gridSystemModal">Agregar Medicamento</h5>
        <button type="button" className="btn-close" onClick={() => setAddMedicamento(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <form onSubmit={guardar}>
            <div className="row">
              <div className="col-xl-6 mb-3">
                <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción<span className="text-danger">*</span> </label>
                <input type="text" className="form-control" placeholder="" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="sustancias" className="form-label">Sustancias<span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" placeholder="" value={sustancias} onChange={(e) => setSustancias(e.target.value)} required/>
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="casafarma" className="form-label">Casa Farmaceutica<span className="text-danger">*</span>
                </label>
                <input type="text" className="form-control" placeholder="" value={casafarma} onChange={(e) => setcasaFarmaceutica(e.target.value)} required/>
              </div>
              <div className="col-xl-6 mb-3">
                  <label htmlFor="estado" className="form-label">Estado<span className="text-danger">*</span></label>
                  <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                  </select>
              </div>

            </div>
            <div>
              <button type="submit" className="btn btn-primary me-1">Guardar</button>
              <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddMedicamento(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </Offcanvas>
  </>
);
});

export default MedicamentoCreate;