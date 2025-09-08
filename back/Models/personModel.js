import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  personModel = db.define('persona', {
    idPersona: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    CUI: { type: DataTypes.INTEGER },
    idRol: { type: DataTypes.INTEGER },
    Nombres: { type: DataTypes.STRING },
    FechaNacimiento: { type: DataTypes.DATE },
    Direccion: { type: DataTypes.STRING },
    Telefono: { type: DataTypes.SMALLINT },
    Salario: { type: DataTypes.DECIMAL },
    Titulacion: { type: DataTypes.STRING },
    Estado: { type: DataTypes.BOOLEAN }
 }, { tableName: 'persona' }); 
 

export default  personModel