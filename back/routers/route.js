import express from 'express';
const router = express.Router();
import * as Controller from '../controllers/controlador.js'; 

router.get('/obtener-datos', Controller.obtenerDatos);

export default router;
