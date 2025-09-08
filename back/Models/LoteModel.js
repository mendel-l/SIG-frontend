import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const LoteModel = db.define('lote', {
    IDLote: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    PrecioCompra: { type: DataTypes.NUMBER},
    Fecha_Ingreso: { type: DataTypes.DATE },
    Fecha_Vencimiento: { type: DataTypes.DATE },
    CantidadCompra:{ type: DataTypes.NUMBER } , 
    cantidadDisponible:{ type: DataTypes.NUMBER } ,
    IDProveedor: { type: DataTypes.NUMBER },
    idMedicamento:{ type: DataTypes.NUMBER } ,
    Estado:{ type: DataTypes.BOOLEAN }  
 }, { tableName: 'lote' }); 
 

export default  LoteModel