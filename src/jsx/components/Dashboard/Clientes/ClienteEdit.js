import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

const URI = 'http://localhost:3001/api/cliente'

const CompEditarCliente = () => {
    const [nombre, setNombre] = useState('')
    const [nit, setNit] = useState('')
    const [telefono, setTelefono] = useState('')
    const [estado, setEstado] = useState('')
    const {idCliente} = useParams()

    const navigate = useNavigate();
    //procedimietno para Actualizar
    const Actualizar = async (e) => {
        e.preventDefault()
        await axios.put(URI+'/'+idCliente,{
            Nombre:nombre,
            Nit:nit,
            Telefono:telefono,
            Estado:estado,
        })
        navigate('/cliente')
    }

    useEffect(()=>{
        getClienteByID()
    },[])

    const getClienteByID = async () =>{
        const res = await axios.get(URI+'/'+idCliente)  
        setNombre(res.data.Nombre)
        setNit(res.data.Nit)
        setTelefono(res.data.Telefono)
        setEstado(res.data.Estado)
    }

    return( 
        <div>
            <h3>Editar Cliente</h3>   
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={Actualizar}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre<span className="text-danger">*</span></label>
                  <input type="text" className="form-control" placeholder="" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="nit" className="form-label">Nit<span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" placeholder="" value={nit} onChange={(e) => setNit(e.target.value)} required/>
                </div>
                <div className="col-xl-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono<span className="text-danger">*</span></label>
                  <input type="number" className="form-control" placeholder="" value={telefono} onChange={(e) => setTelefono(e.target.value)} required/>
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

export default CompEditarCliente