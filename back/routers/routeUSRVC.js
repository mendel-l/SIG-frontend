import express from 'express';
import { createUSRV,loginUser,getAllUsers,getUserInnerP,updateU} from '../controllers/controllerUSRVC.js';
import {registerOut} from '../controllers/controllerEntradas.js'

const usrvroute = express.Router();

usrvroute.post('/', createUSRV);
usrvroute.post('/login', loginUser);
usrvroute.post('/logout', registerOut)
usrvroute.get('/getAll', getAllUsers);
usrvroute.get('/IP', getUserInnerP);
usrvroute.put('/:IDUsuarios', updateU);


export default usrvroute
