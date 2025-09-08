import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const VentaModel = db.define('venta', {
    Idventa: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    Fecha: { type: DataTypes.DATE},
    MontoTotal: { type: DataTypes.NUMBER },
    idCliente: { type: DataTypes.NUMBER },
    idPersona:{ type: DataTypes.NUMBER }  
 }, { tableName: 'venta' }); 
 

export default  VentaModel