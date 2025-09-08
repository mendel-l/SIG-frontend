import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  controlInModel = db.define('controlentradas', {
    IDControl: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    IDUsuarios: { type: DataTypes.INTEGER },
    FechaIn: { type: DataTypes.DATE },
    HoraIn: { type: DataTypes.TIME },
    Estado: { type: DataTypes.BOOLEAN },
    FechaOut: { type: DataTypes.DATE },
    HoraOut: { type: DataTypes.TIME }
 }, { tableName: 'controlentradas' }); 
 

export default  controlInModel