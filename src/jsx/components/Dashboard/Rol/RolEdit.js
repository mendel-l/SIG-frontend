import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

const URI = 'http://localhost:3001/api/rol'

const CompEditarRol = () => {
    const [rol, setRol] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [vproveedores, setvProveedores] = useState('');
    const [vmedicamentos, setvMedicamentos] = useState('');
    const [vinventario, setvInventario] = useState('');
    const [vcliente, setvCliente] = useState('');
    const [vrol, setvRol] = useState('');
    const [vlote, setvLote] = useState('');
    const [vusuario, setvUsuario] = useState('');
    const [vventa, setvVenta] = useState('');
    const [vpersona, setvPersona] = useState('');
    const [vreportes, setvReportes] = useState('');
    const {idRol} = useParams();
    const navigate = useNavigate();

    //procedimietno para Actualizar
    const Actualizar = async (e) => {
        e.preventDefault();
        await axios.put(`${URI}/${idRol}`,{
            Rol:rol,
            Descripcion: descripcion,
            vProveedores: vproveedores,
            vMedicamentos: vmedicamentos,
            vInventario: vinventario,
            vCliente: vcliente,
            vRol: vrol,
            vLote: vlote,
            vUsuario: vusuario,
            vVenta: vventa,
            vPersona: vpersona,
            vReportes: vreportes
        })
        navigate('/rol');
    };

    useEffect(()=>{
        getRolByID();
    },[])

    const getRolByID = async () =>{
      const res = await axios.get(`${URI}/${idRol}`); 
        setRol(res.data.Rol);
        setDescripcion(res.data.Descripcion);
        setvProveedores(res.data.vproveedores);
        setvMedicamentos(res.data.vmedicamentos);
        setvInventario(res.data.vinventario);
        setvCliente(res.data.vcliente);
        setvRol(res.data.vrol);
        setvLote(res.data.vlote);
        setvUsuario(res.data.vusuario);
        setvVenta(res.data.vventa);
        setvPersona(res.data.vpersona);
        setvReportes(res.data.vreportes);
    }

    return( 
        <div>
            <h3>Editar Rol</h3>   
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={Actualizar}>
              <div className="row">
              <div className="col-xl-6 mb-3">
                  <label htmlFor="rol" className="form-label">Rol<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={rol} onChange={(e) => setRol(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripcion<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" placeholder="" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="proveedores" className="form-label">Proveedores<span className="text-danger">*</span></label>
                  <select className="form-select" value={vproveedores} onChange={(e) => setvProveedores(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="medicamentos" className="form-label">Medicamentos<span className="text-danger">*</span></label>
                  <select className="form-select" value={vmedicamentos} onChange={(e) => setvMedicamentos(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="inventario" className="form-label">Inventario<span className="text-danger">*</span></label>
                  <select className="form-select" value={vinventario} onChange={(e) => setvInventario(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="cliente" className="form-label">Cliente<span className="text-danger">*</span></label>
                  <select className="form-select" value={vcliente} onChange={(e) => setvCliente(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="rol" className="form-label">Rol<span className="text-danger">*</span></label>
                  <select className="form-select" value={vrol} onChange={(e) => setvRol(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="lote" className="form-label">Lote<span className="text-danger">*</span></label>
                  <select className="form-select" value={vlote} onChange={(e) => setvLote(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario<span className="text-danger">*</span></label>
                  <select className="form-select" value={vusuario} onChange={(e) => setvUsuario(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="venta" className="form-label">Venta<span className="text-danger">*</span></label>
                  <select className="form-select" value={vventa} onChange={(e) => setvVenta(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="persona" className="form-label">Persona<span className="text-danger">*</span></label>
                  <select className="form-select" value={vpersona} onChange={(e) => setvPersona(e.target.value)} required>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="reportes" className="form-label">Reportes<span className="text-danger">*</span></label>
                  <select className="form-select" value={vreportes} onChange={(e) => setvReportes(e.target.value)} required>
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
    )
}

export default CompEditarRol