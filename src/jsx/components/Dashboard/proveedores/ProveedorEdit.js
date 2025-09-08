import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

const URI = 'http://localhost:3001/api/proveedores'

const CompEditarProveedor = () => {
    const [nombre, setNombre] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [estado, setEstado] = useState('')
    const {IDProveedor} = useParams()

    const navigate = useNavigate();
    //procedimietno para Actualizar
    const Actualizar = async (e) => {
        e.preventDefault()
        await axios.put(URI+'/'+IDProveedor,{
            Nombre:nombre,
            Direccion:direccion,
            Telefono:telefono,
            Descripcion:descripcion,
            Estado:estado,
        })
        navigate('/proveedor')
    }

    useEffect(()=>{
        getProveedorByID()
    },[])

    const getProveedorByID = async () =>{
        const res = await axios.get(URI+'/'+IDProveedor)  
        setNombre(res.data.Nombre)
        setDireccion(res.data.Direccion)
        setTelefono(res.data.Telefono)
        setDescripcion(res.data.Descripcion)
        setEstado(res.data.Estado)
    }

    return( 
        <div>
            <h3>Editar Proveedor</h3>   
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={Actualizar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" placeholder="" value={direccion} onChange={(e) => setDireccion(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono<span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="" value={telefono} onChange={(e) => setTelefono(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción<span className="text-danger">*</span> </label>
                  <input type="text" className="form-control" placeholder="" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required/>
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
    )
}

export default CompEditarProveedor