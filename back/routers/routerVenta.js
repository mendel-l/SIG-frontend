import express from 'express'
import { getAllVentas, getVenta, createVenta, updateVenta, deleteVenta,ultimoRegistro } from '../controllers/controllerVenta.js'

const VentaRouter = express.Router()

VentaRouter.get('/', getAllVentas)
VentaRouter.get('/ultimoRegistro', ultimoRegistro)
VentaRouter.get('/:Idventa', getVenta)
VentaRouter.post('/', createVenta)
VentaRouter.put('/:Idventa', updateVenta)
VentaRouter.delete('/:Idventa', deleteVenta)


export default VentaRouter
