import express from 'express'
import { getAllProveedores, getProveedor, createProveedor, updateProveedor, deleteProveedor,getAllProveedoresActive } from '../controllers/controllerProveedor.js'

const ProveedorRoute = express.Router()

ProveedorRoute.get('/', getAllProveedores)
ProveedorRoute.get('/active', getAllProveedoresActive)
ProveedorRoute.get('/:IDProveedor', getProveedor)
ProveedorRoute.post('/', createProveedor)
ProveedorRoute.put('/:IDProveedor', updateProveedor)
ProveedorRoute.delete('/:IDProveedor', deleteProveedor)

export default ProveedorRoute
