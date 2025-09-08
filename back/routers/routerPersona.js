import express from 'express'
import { getAllPersons, createPerson, updatePerson, deletePerson,getAllPersonsActive,getoneP,getAllInner} from '../controllers/controllerPersona.js'

const routerPersona = express.Router()

routerPersona.get('/', getAllPersons)
routerPersona.get('/getAllInner', getAllInner)
routerPersona.get('/active', getAllPersonsActive)
routerPersona.post('/', createPerson)
routerPersona.put('/:IdPersona', updatePerson)
routerPersona.get('/:IdPersona', getoneP)
routerPersona.delete('/:CUI', deletePerson)

export default routerPersona
