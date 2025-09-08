import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const RolModel = db.define('rol', {
    idRol: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },Rol: { type: DataTypes.STRING },
    Descripcion: { type: DataTypes.STRING },
    vProveedores: { type: DataTypes.BOOLEAN },
    vMedicamentos: { type: DataTypes.BOOLEAN },
    vInventario: { type: DataTypes.BOOLEAN },
    vCliente: { type: DataTypes.BOOLEAN },
    vRol: { type: DataTypes.BOOLEAN },
    vLote: { type: DataTypes.BOOLEAN },
    vUsuario: { type: DataTypes.BOOLEAN },
    vVenta: { type: DataTypes.BOOLEAN },
    vPersona: { type: DataTypes.BOOLEAN },
    vReportes: { type: DataTypes.BOOLEAN },
   
 }, { tableName: 'rol' }); 
 

export default  RolModel