import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  InventarioModel = db.define('inventario', {
    IdInventario : { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    CantidadDisponible: { type: DataTypes.NUMBER},
    PrecioVenta: { type: DataTypes.DECIMAL},
    idMedicamento: { type: DataTypes.NUMBER },
    Estado:{ type: DataTypes.BOOLEAN } 
 }, { tableName: 'inventario' }); 
 

export default  InventarioModel