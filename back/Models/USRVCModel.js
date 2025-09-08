import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  USRVCModel = db.define('usuario', {
    IDUsuarios: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    Usuario: { type: DataTypes.STRING },
    Contraseña: { type: DataTypes.STRING },
    idPersona: { type: DataTypes.INTEGER },
    Estado: { type: DataTypes.NUMBER }
 }, { tableName: 'usuario' }); 
 

export default  USRVCModel