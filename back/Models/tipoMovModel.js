import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  tipoMovModel = db.define('tipomovimiento', {
    idTipoMovimiento : { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    Movimiento: { type: DataTypes.STRING },
    Descripcion: { type: DataTypes.STRING }
 }, { tableName: 'tipomovimiento' }); 
 

export default  tipoMovModel