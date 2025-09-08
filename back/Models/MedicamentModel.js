import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const  MedicamentModel = db.define('medicamento', {
    idMedicamento: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
    },
    
    Nombre: { type: DataTypes.STRING },
    Descripcion: { type: DataTypes.STRING },
    Sustancias: { type: DataTypes.STRING },
    casaFarmaceutica: { type: DataTypes.STRING },
    Estado: { type: DataTypes.BOOLEAN }
 }, { tableName: 'medicamento' }); 
 

export default  MedicamentModel