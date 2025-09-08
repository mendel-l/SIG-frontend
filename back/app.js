import express from 'express';
import cors from 'cors';
import routerCliente from './routers/routerClientes.js';
import Rolrouter from './routers/routesRol.js';
import Medicamentroute from './routers/Medicamentroute.js';
import ClientRoute from './routers/routerClientes.js';
import ProveedorRoute from './routers/routerProveedor.js'
import routerPersona from './routers/routerPersona.js'
import routerTipoMov from './routers/routerTipoMov.js'
import routerUser from './routers/routerUser.js'
import VentaRouter from './routers/routerVenta.js';
import LoteRouter from './routers/routerLote.js';
import InventarioRouter from './routers/routerInventario.js';
import Detalle_FacturaRouter from './routers/routerDetalle_Factura.js';
import routeUSRV from './routers/routeUSRVC.js';
import routerReports from './routers/routerReports.js';

import db from './DB/database.js';

const app = express();
app.use(cors());
app.use(express.json());

// las apis para los cruds
// crear convencion para que solo empiezen con minusculas
// buscar libreria que recibe las palabras que empiezan con Mayusculas
app.use('/api/clientes', routerCliente);
app.use('/api/proveedores',  ProveedorRoute);
app.use('/api/rol', Rolrouter);
app.use('/api/medicamento', Medicamentroute);
app.use('/api/cliente', ClientRoute);
app.use('/api/persona', routerPersona);
app.use('/api/tipoMov', routerTipoMov);
app.use('/api/user', routerUser);
app.use('/api/venta', VentaRouter);
app.use('/api/lote', LoteRouter);
app.use('/api/inventario', InventarioRouter);
app.use('/api/detalle_factura', Detalle_FacturaRouter);
app.use('/api/Usrv', routeUSRV);
app.use('/api/reports', routerReports);



///Reportes
// Ventas desde fecha especifica hasta actual
// Cantidad de Prouctos desechados hasta actual
// 
// 
// 
// 
// 
// 











// Conexion a la DB
const startServer = async () => {
  try {
    await db.authenticate();
    console.log('Conexion exitosa a la DB');
    
    app.listen(3001, () => {
      console.log('Server UP running in http://localhost:3001/');
    });
  } catch (error) {
    console.log('Error de conexion a la DB:', error.message);
  }
};

startServer();
