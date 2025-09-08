import express from 'express'
import { getAllRoles, getRole,createRole,updateRole,deleteRole} from '../controllers/controllerRol.js'

const Rolrouter = express.Router()

Rolrouter.get('/', getAllRoles)
Rolrouter.get('/:idRol', getRole)
Rolrouter.post('/', createRole)
Rolrouter.put('/:idRol', updateRole)
Rolrouter.delete('/:idRol', deleteRole)


export default Rolrouter