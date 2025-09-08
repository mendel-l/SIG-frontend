import express from 'express'
import { getAllMedicaments, getMedicament, createMedicament, updateMedicament, deleteMedicament, getNotAppearInventory, desactivateExpired,
    getAllMedicamentsActive } 
from '../controllers/controllerMedicament.js'

const Medicamentroute = express.Router()

Medicamentroute.get('/', getAllMedicaments)
Medicamentroute.get('/active', getAllMedicamentsActive)
Medicamentroute.get('/getNotAppearInventory', getNotAppearInventory) //Esto para comboBox medicamento de ingresar nuevo inventario
Medicamentroute.get('/:idMedicamento', getMedicament)
Medicamentroute.post('/', createMedicament)
Medicamentroute.put('/deactivateExpired', desactivateExpired)
Medicamentroute.put('/:idMedicamento', updateMedicament)
Medicamentroute.delete('/:idMedicamento', deleteMedicament)

export default Medicamentroute
