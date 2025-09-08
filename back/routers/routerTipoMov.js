import express from 'express'
import { getAllTipoMov, createTipoMov, updateTipoMov, deleteTipoMov} from '../controllers/controllerTipoMov.js'

const routerTipoMov = express.Router()

routerTipoMov.get('/', getAllTipoMov)
routerTipoMov.post('/', createTipoMov)
routerTipoMov.put('/:idTipoMovimiento', updateTipoMov)
routerTipoMov.delete('/:idTipoMovimiento', deleteTipoMov)

export default routerTipoMov
