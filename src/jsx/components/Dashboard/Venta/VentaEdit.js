import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VentaCreate from '../../../constant/VentaCreate';

const URI = 'http://localhost:3001/api/venta';

const CompVentaEdit = () => {
  const [fecha, setFecha] = useState('');
  const [montototal, setMontototal] = useState('');
  const [idcliente, setidCliente] = useState('');
  const [idPersona, setIdPersona] = useState(''); // Cambiado de CUI a idPersona
  const [clientes, setClientes] = useState([]);
  const [personas, setPersonas] = useState([]); // Lista de personas disponibles
  const { Idventa } = useParams();
  const navigate = useNavigate();
  const elemento = useRef();

  const Actualizar = async (e) => {
    e.preventDefault();
    await axios.put(`${URI}/${Idventa}`, {
      Fecha: fecha,
      MontoTotal: montototal,
      idCliente: idcliente,
      idPersona: idPersona, // Cambiado de CUI a idPersona
    });
    navigate('/venta');
  };

  useEffect(() => {
    getVentaByID();
    fetchClientes();
    fetchPersonas(); // Obtener la lista de personas disponibles al cargar el componente
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/cliente');
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener la lista de clientes:', error);
    }
  };

  const fetchPersonas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/persona');
      setPersonas(res.data);
    } catch (error) {
      console.error('Error al obtener la lista de personas:', error);
    }
  };

  const getVentaByID = async () => {
    const res = await axios.get(`${URI}/${Idventa}`);
    setFecha(res.data.Fecha);
    setMontototal(res.data.MontoTotal);
    setidCliente(res.data.idCliente);
    setIdPersona(res.data.idPersona); // Cambiado de CUI a idPersona
  };

  return (
    <>
      <div>
        <h3>Editar Elemento de Venta</h3>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={Actualizar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="fecha" className="form-label">
                    Fecha<span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    placeholder=""
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="montototal" className="form-label">
                    Monto Total<span className="text-danger">*</span>{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder=""
                    value={montototal}
                    onChange={(e) => setMontototal(e.target.value)}
                    required
                  />
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="idcliente" className="form-label">
                    ID Cliente<span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={idcliente}
                    onChange={(e) => setidCliente(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un Cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.idCliente} value={cliente.idCliente}>
                        {cliente.idCliente} - {cliente.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="idPersona" className="form-label">
                    ID Persona<span className="text-danger">*</span>{" "}
                  </label>
                  <select
                    className="form-select"
                    value={idPersona}
                    onChange={(e) => setIdPersona(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una Persona</option>
                    {personas.map((persona) => (
                      <option key={persona.idPersona} value={persona.idPersona}>
                        {persona.idPersona} - {persona.Nombres}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <VentaCreate
        ref={elemento}
        Title="Add Inventario"
        reloadDetalle={() => {}}
      />
    </>
  );
};

export default CompVentaEdit;
