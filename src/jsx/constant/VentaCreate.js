import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';
import {idVentaRecuperado} from './VentaCreate1.js';
export let loteSelect = null;
const URI = 'http://localhost:3001/api/detalle_factura'
const URI2 = 'http://localhost:3001/api/inventario/descargar/'
//Creacion DETALLE FACTURA
const VentaCreate = forwardRef((props, ref) => {
  const [cantidad, setCantidad] = useState('')
  const [subtotal, setsubTotal] = useState('')
  const [idventa, setIdventa] = useState('')
  const [idinventario, setIdInventario] = useState('');
  
  const [idlote, setIDLote] = useState('');// para la ruta + nombre lotes
  const [loteId, idMedicamento] = useState('');// para la ruta + nombre

  const [ventas, setVentas] = useState([]);           //lista de ventas disponibles
  const [inventarios, setInventarios] = useState([]); //Lista de inventarios disponibles
  const [lotes, setLotes] = useState([]);             //Lista de lotes disponibles
  const [medicamentos, setMedicamentos] = useState([]); // Lista de medicamentos disponibles

  const [addDetalle, setAddDetalle] = useState(false);
  const navigate = useNavigate();

  const [idMedicamentoSeleccionado, setIdMedicamentoSeleccionado] = useState(null);
  const [precioVentaSeleccionado, setPrecioVentaSeleccionado] = useState(null);
  useEffect(() => {
    async function fetchVentas() { //obtiene la lista de ventas
      try {
        const res = await axios.get('http://localhost:3001/api/venta');
        setVentas(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de ventas:', error);
      }
    }

    async function fetchInventarios() { //obtiene la lista de inventarios
      try {
        const res = await axios.get('http://localhost:3001/api/inventario/getInvInnerMed');
        setInventarios(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de inventarios:', error);
      }
    }

    async function fetchLotes() { //obtiene la lista de lotes
      try {
        const res = await axios.get('http://localhost:3001/api/lote'); // Cambia la URL según tu API
        setLotes(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de lotes:', error);
      }
    }

    // Obtener la lista de medicamentos disponibles al cargar el componente
    async function fetchMedicamentos() {
      try {
        const res = await axios.get('http://localhost:3001/api/medicamento'); // Cambia la URL según tu API
        setMedicamentos(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de medicamentos:', error);
      }
    }

    fetchVentas();
    fetchInventarios();
    fetchLotes();
    fetchMedicamentos();
  }, []);

  useImperativeHandle(ref, () => ({
    showDetalleModal() {
      setAddDetalle(true);
    },
  }));

 //procedimietno para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();

    try {      
      const response2 = await axios.put(URI2+idlote+"/"+cantidad);

      const response = await axios.post(URI, {
        Cantidad:cantidad,
        subTotal:response2.data.resultado,
        Idventa:idVentaRecuperado,
        IdInventario:idinventario,
        IDLote: idlote
      });
      loteSelect=idlote;
      props.reloadDetalle();
      setAddDetalle(false);
    } catch (error) {
       console.error('Error al guardar el Detalle:', error);
    }
  };

  return (
    <>
      <Offcanvas show={addDetalle} onHide={() => setAddDetalle(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Producto</h5>
          <button type="button" className="btn-close" onClick={() => setAddDetalle(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
              <div className="col-xl-6 mb-3">
                  <label htmlFor="inventario" className="form-label">Inventario<span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={idinventario} // para el id + nombre
                    onChange={(e) => {
                      setIdInventario(e.target.value);
                      const inventarioSeleccionado = inventarios.find((inv) => inv.IdInventario === parseInt(e.target.value, 10));
                      const idMedicamento = inventarioSeleccionado ? inventarioSeleccionado.idMedicamento : null;
                      const precioVenta = inventarioSeleccionado ? inventarioSeleccionado.PrecioVenta : null;
                      setIdMedicamentoSeleccionado(idMedicamento);
                      setPrecioVentaSeleccionado(precioVenta);
                    }} // para el id + nombre
                    required
                  >
                    <option value="">Selecciona el Producto</option>
                    {inventarios
                    .map((inventario) => (
                      <option key={inventario.IdInventario} value={inventario.IdInventario} >
                        {inventario.idMedicamento} - {inventario.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="lote" className="form-label">Lote<span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={idlote} // para el id + nombre
                    onChange={(e) => setIDLote(e.target.value)} // para el id + nombre
                    onClick={(e)=>{}}
                    required
                  >
                    <option value="">Selecciona un lote</option>
                    {lotes   
                    .filter((lote) => lote.idMedicamento === idMedicamentoSeleccionado)                 
                    .map((lote) => (
                      <option key={lote.IDLote} value={lote.IDLote}>
                        {lote.IDLote} - Disponible({lote.cantidadDisponible}) - Vence {lote.Fecha_Vencimiento}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad<span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="subtotal" className="form-label">Sub Total<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={precioVentaSeleccionado*cantidad} required readOnly/>
                </div>
                {/* <div className="col-xl-6 mb-3">
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
                 */}
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">Agregar Producto</button>
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddDetalle(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});
export default VentaCreate;