import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import axios from 'axios';

const URI = 'http://localhost:3001/api/lote';

const LoteCreate = forwardRef((props, ref) => {
  const [preciosComp, setPrecioCompra] = useState('');
  const [fechaIng, setFecha_Ingreso] = useState('');
  const [fechaVen, setFecha_Vencimiento] = useState('');
  const [cantComp, setCantidadCompra] = useState('');
  const [cantDis, setcantidadDisponible] = useState('');
  const [IDprov, setIDProveedor] = useState('');
  const [IDmedi, setidMedicamento] = useState('');
  const [estado, setEstado] = useState('');
  const [medicamentos, setMedicamentos] = useState([]); // Lista de medicamentos disponibles
  const [proveedores, setProveedores] = useState([]); // Lista de medicamentos disponibles

  const [addLote, setAddLote] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMedicamentos() {
      try {
        const res = await axios.get('http://localhost:3001/api/medicamento/active');
        setMedicamentos(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de medicamentos:', error);
      }
    }

    async function fetchProveedores() {
      try {
        const res = await axios.get('http://localhost:3001/api/proveedores/active');
        setProveedores(res.data);
      } catch (error) {
        console.error('Error al obtener la lista de proveedores:', error);
      }
    }

    fetchMedicamentos();
    fetchProveedores();
  }, []);


  useImperativeHandle(ref, () => ({
    showLoteModal() {
      setAddLote(true);
    },
  }));

  const guardar = async (e) => {
    e.preventDefault();

    try {
      await axios.post(URI, {
        PrecioCompra: preciosComp,
        Fecha_Ingreso: fechaIng,
        Fecha_Vencimiento: fechaVen,
        CantidadCompra: cantComp,
        cantidadDisponible: cantComp,
        IDProveedor: IDprov,
        idMedicamento: IDmedi,
        Estado: estado,
      });

      props.reloadLotes();

      setAddLote(false);
    } catch (error) {
      console.error('Error al guardar el lote:', error);
    }
  };

  //para limpiar el modal al darle cancelar al boton
  const limpiarFormulario = () => {
    // Restablecer los estados al valor inicial
    setPrecioCompra('');
    setFecha_Ingreso('');
    setFecha_Vencimiento('');
    setCantidadCompra('');
    setcantidadDisponible('');
    setIDProveedor('');
    setidMedicamento('');
    setEstado('');
  };

  return (
    <>
  <Offcanvas show={addLote} onHide={() => setAddLote(false)} className="offcanvas-end customeoff" placement="end">
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">Agregar Lote</h5>
          <button type="button" className="btn-close" onClick={() => setAddLote(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={guardar}>
              <div className="row">
              <div className="col-xl-6 mb-3">
                  <label htmlFor="precioCompra" className="form-label">Precio de Compra<span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text">Q</span>
                    <input type="text" className="form-control" placeholder="" value={preciosComp} onChange={(e) => setPrecioCompra(e.target.value.replace(/\D/, ''))} required />
                  </div>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="fecha" className="form-label">Fecha de Ingreso<span className="text-danger">*</span></label>
                  <input type="date" className="form-control" placeholder="" value={fechaIng} onChange={(e) => setFecha_Ingreso(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="fecha" className="form-label">Fecha de Vencimiento<span className="text-danger">*</span></label>
                  <input type="date" className="form-control" placeholder="" value={fechaVen} onChange={(e) => setFecha_Vencimiento(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="cantidadCompra" className="form-label">Cantidad de Compra<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={cantComp} onChange={(e) => setCantidadCompra(e.target.value.replace(/\D/, ''))} required />
                </div>
                {/* <div className="col-xl-6 mb-3">
                  <label htmlFor="cantidadDisponible" className="form-label">Cantidad Disponible<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={cantDis} onChange={(e) => setcantidadDisponible(e.target.value.replace(/\D/, ''))} required />
                </div> */}
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
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-primary me-1">Guardar</button>
                <button type="button" className="btn btn-danger light ms-1" onClick={() => { setAddLote(false); limpiarFormulario(); }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>
    </>
  );
});

export default LoteCreate;
