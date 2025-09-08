import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const userModel = db.define('usuario', {
    IDUsuarios: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    Usuario:    { type: DataTypes.STRING },
    Contraseña: { type: DataTypes.STRING },
    CUI:        { type: DataTypes.INTEGER },
    Estado:     { type: DataTypes.BOOLEAN }
 }, { tableName: 'usuario' }); 
 

export default  userModel