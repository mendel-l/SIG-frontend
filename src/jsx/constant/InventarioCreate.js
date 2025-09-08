import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/inventario';

const InventarioCreate = forwardRef((props, ref) => {
  const [cantidadDis, setCantidadDisponible] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [medicamentoId, setMedicamentoId] = useState('');// para la ruta + nombre
  const [estado, setEstado] = useState('');
  const [medicamentos, setMedicamentos] = useState([]); // Lista de medicamentos disponibles

  const [addInventario, setAddInventario] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la lista de medicamentos disponibles al cargar el componente
    async function fetchMedicamentos() {
      try {
        const res = await axios.get('http://localhost:3001/api/medicamento/getNotAppearInventory'); // Cambia la URL según tu API
        setMedicamentos(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de medicamentos:', error);
      }
    }

    fetchMedicamentos();
  }, []);

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddInventario(true);
    },
  }));

  // Procedimiento para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();

    try {
      // Convertir el valor de estado a booleano
      const estadoBooleano = estado === "1" ? true : false;
      // Enviar los datos al servidor
      const disponible = await axios.get('http://localhost:3001/api/lote/getSumLotes/'+medicamentoId);
      console.log(disponible.data.totalCantidadDisponible);
      await axios.post(URI, {
        CantidadDisponible: disponible.data.totalCantidadDisponible,
        PrecioVenta: precioVenta,
        idMedicamento: medicamentoId,
        Estado: estado,
      });
      

      // Recargar la lista de inventario en la página principal
      props.reloadInventario();

      setAddInventario(false);
    } catch (error) {
      console.error('Error al guardar el inventario:', error);
    }
  };

  return (
    <>
      <Offcanvas show={addInventario} onHide={() => setAddInventario(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Elemento de Inventario</h5>
          <button type="button" className="btn-close" onClick={() => setAddInventario(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                {/* <div className="col-xl-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Cantidad Disponible<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={cantidadDis} onChange={(e) => setCantidadDisponible(e.target.value)} required />
                </div> */}
                <div className="col-xl-6 mb-3">
                  <label htmlFor="descripcion" className="form-label">Precio de Venta<span className="text-danger">*</span> </label>
                  <input type="text" className="form-control" placeholder="" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="sustancias" className="form-label">Medicamento<span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={medicamentoId} // para el id + nombre
                    onChange={(e) => setMedicamentoId(e.target.value)} // para el id + nombre
                    required
                  >
                    <option value="">Selecciona un medicamento</option>
                    {medicamentos.map((medicamento) => (
                      <option key={medicamento.idMedicamento} value={medicamento.idMedicamento}>
                        {medicamento.idMedicamento} - {medicamento.Nombre}
                      </option>
                    ))}
                  </select>
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
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddInventario(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default InventarioCreate;
