import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  ProveedorModel = db.define('proveedor', {
    IDProveedor: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    Nombre: { type: DataTypes.STRING },
    Direccion: { type: DataTypes.STRING },
    Telefono: { type: DataTypes.STRING},
    Descripcion: { type: DataTypes.STRING},
    Estado: { type: DataTypes.BOOLEAN }
 }, { tableName: 'proveedor' }); 
 

export default  ProveedorModel