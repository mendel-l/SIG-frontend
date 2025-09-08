import express from 'express'
import { getAllClients, getClient, createClient, updateClient, deleteClient } from '../controllers/controllerCliente.js'

const ClientRoute = express.Router()

ClientRoute.get('/', getAllClients)
ClientRoute.get('/:idCliente', getClient)
ClientRoute.post('/', createClient)
ClientRoute.put('/:idCliente', updateClient)
ClientRoute.delete('/:idCliente', deleteClient)

export default ClientRoute
