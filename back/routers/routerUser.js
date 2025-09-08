import express from 'express'
import {validateLogin} from '../controllers/controllerUser.js'
import {registerOut} from '../controllers/controllerEntradas.js'

const routerUser = express.Router()

routerUser.post('/login', validateLogin)
routerUser.post('/logout', registerOut)
// routerPersona.post('/', createPerson)
// routerPersona.put('/:CUI', updatePerson)
// routerPersona.delete('/:CUI', deletePerson)

export default routerUser
