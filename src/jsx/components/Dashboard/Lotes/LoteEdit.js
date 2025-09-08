import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const URI = 'http://localhost:3001/api/lote';

const LoteEdit = () => {
  const [preciosComp, setPrecioCompra] = useState('');
  const [fechaIng, setFecha_Ingreso] = useState('');
  const [fechaVen, setFecha_Vencimiento] = useState('');
  const [cantComp, setCantidadCompra] = useState('');
  const [cantDis, setcantidadDisponible] = useState('');
  const [IDprov, setIDProveedor] = useState('');
  const [IDmedi, setidMedicamento] = useState('');
  const [estado, setEstado] = useState('');
  const [medicamentos, setMedicamentos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const { IdLote } = useParams();
  const navigate = useNavigate();

  const Actualizar = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${URI}/${IdLote}`, {
        PrecioCompra: preciosComp,
        Fecha_Ingreso: fechaIng,
        Fecha_Vencimiento: fechaVen,
        CantidadCompra: cantComp,
        cantidadDisponible: cantDis,
        IDProveedor: IDprov,
        idMedicamento: IDmedi,
        Estado: estado,
      });
      navigate('/lote'); // Ver bien que sea la ruta para F5 automatico :D
    } catch (error) {
      console.error('Error al actualizar el lote:', error);
    }
  };

  useEffect(() => {
    getLoteByID();

    async function fetchMedicamentos() {
      try {
        const res = await axios.get('http://localhost:3001/api/medicamento');
        setMedicamentos(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de medicamentos:', error);
      }
    }

    async function fetchProveedores() {
      try {
        const res = await axios.get('http://localhost:3001/api/proveedores');
        setProveedores(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de proveedores:', error);
      }
    }

    fetchMedicamentos();
    fetchProveedores();
  }, []);

  const getLoteByID = async () => {
    try {
      const res = await axios.get(`${URI}/${IdLote}`);
      setPrecioCompra(res.data.PrecioCompra);
      setFecha_Ingreso(res.data.Fecha_Ingreso);
      setFecha_Vencimiento(res.data.Fecha_Vencimiento);
      setCantidadCompra(res.data.CantidadCompra);
      setcantidadDisponible(res.data.cantidadDisponible);
      setIDProveedor(res.data.IDProveedor);
      setidMedicamento(res.data.idMedicamento);
      setEstado(res.data.Estado);
    } catch (error) {
      console.error('Error al obtener el lote:', error);
    }
  };

  return (
    <div>
      <h3>Editar Lote</h3>
      <div className="offcanvas-body">
        <div className="container-fluid">
          <form onSubmit={Actualizar}>
            <div className="row">
              <div className="col-xl-6 mb-3">
                <label htmlFor="precioCompra" className="form-label">Precio de Compra<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={preciosComp} onChange={(e) => setPrecioCompra(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="fechaIngreso" className="form-label">Fecha de Ingreso<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={fechaIng} onChange={(e) => setFecha_Ingreso(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="fechaVencimiento" className="form-label">Fecha de Vencimiento<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={fechaVen} onChange={(e) => setFecha_Vencimiento(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="cantidadCompra" className="form-label">Cantidad de Compra<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={cantComp} onChange={(e) => setCantidadCompra(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="cantidadDisponible" className="form-label">Cantidad Disponible<span className="text-danger">*</span></label>
                <input type="text" className="form-control" placeholder="" value={cantDis} onChange={(e) => setcantidadDisponible(e.target.value)} required />
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="IDProveedor" className="form-label">ID Proveedor<span className="text-danger">*</span></label>
                <select className="form-select" value={IDprov} onChange={(e) => setIDProveedor(e.target.value)} required>
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.IDProveedor} value={proveedor.IDProveedor}>
                      {proveedor.IDProveedor} - {proveedor.Nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-xl-6 mb-3">
                <label htmlFor="IDMedicamento" className="form-label">ID Medicamento<span className="text-danger">*</span></label>
                <select className="form-select" value={IDmedi} onChange={(e) => setidMedicamento(e.target.value)} required>
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
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary me-1">Actualizar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoteEdit;

