import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  Detalle_FacturaModel = db.define('detalle_factura', {
    IdDetalle: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    Cantidad: { type: DataTypes.NUMBER},
    subTotal: { type: DataTypes.DECIMAL },
    Idventa: { type: DataTypes.NUMBER },
    IdInventario:{ type: DataTypes.NUMBER },
    IDLote:{ type: DataTypes.NUMBER } 
 }, { tableName: 'detalle_factura' }); 
 

export default  Detalle_FacturaModel