import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';
export let idVentaRecuperado = null;
const tokenData = localStorage.getItem('userDetails');
const tokenParse = JSON.parse(tokenData);
const URI = 'http://localhost:3001/api/venta'
const VentaCreate1 = forwardRef((props, ref) => {
  
  const [montototal, setMontototal] = useState('')
  const [idcliente, setidCliente] = useState('')
  const [idpersona, setidPersona] = useState('')

  const [clientes, setClientes] = useState([]); //lista de clientes disponibles
  const [personas, setPersonas] = useState([]); // Lista de personas disponibles

  const [addVenta, setAddVenta] = useState(false);
  const navigate = useNavigate();

   const getCurrentDate = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  const [fecha, setFecha] = useState(getCurrentDate())

  useEffect(() => {
    // Obtener la lista de clientes disponibles al cargar el componente
    async function fetchClientes() {
      try {
        const res = await axios.get('http://localhost:3001/api/cliente'); // Cambia la URL según tu API
        setClientes(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de clientes:', error);
      }
    }

    // Obtener la lista de personas disponibles al cargar el componente
    async function fetchPersonas() {
      try {
        const res = await axios.get('http://localhost:3001/api/persona'); // Cambia la URL según tu API
        setPersonas(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de persona:', error);
      }
    }

    fetchClientes();
    fetchPersonas();
  }, []);

  useImperativeHandle(ref, () => ({
    showVentaModal() {
      setAddVenta(true);
    },
  }));

  
  
 //procedimietno para guardar los datos
  const guardar = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(URI, {
        Fecha:fecha,
        MontoTotal: 0,
        idCliente:idcliente,
        idPersona: tokenParse.idpersona,
      });
      idVentaRecuperado=response.data.idRegistroMov;
      props.reloadDetalle();
      setAddVenta(false);
    } catch (error) {
       console.error('Error al guardar el Venta:', error);
    }
  };

  return (
    <>
      <Offcanvas show={addVenta} onHide={() => setAddVenta(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Venta</h5>
          <button type="button" className="btn-close" onClick={() => setAddVenta(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="fecha" className="form-label">Fecha<span className="text-danger">*</span></label>
                  <input type="date" className="form-control" placeholder="" value={fecha} onChange={(e) => setFecha(e.target.value)} required readOnly/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="cliente" className="form-label">ID Cliente<span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={idcliente}
                    onChange={(e) => setidCliente(e.target.value)}
                    required
                  >
                    <option value="">Selecciona al Cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.idCliente} value={cliente.idCliente}>
                        {cliente.idCliente} - {cliente.Nombre} - Nit {cliente.Nit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="persona" className="form-label">Vendedor<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={tokenParse.displayName} onChange={(e) => setidPersona(e.target.value)}/>
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1" onClick={() => setAddVenta(false)}>Ingresar Venta</button>
                <button type="button" className="btn btn-danger light ms-1" onClick={() => setAddVenta(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});
export default VentaCreate1;