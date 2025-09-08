import db from "../DB/database.js"

import { DataTypes } from "sequelize";

const ClientModel = db.define('cliente', {
    idCliente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    Nombre: { type: DataTypes.STRING },
    Nit: { type: DataTypes.STRING },
    Telefono: { type: DataTypes.STRING },
    Estado: { type: DataTypes.BOOLEAN }
}, { tableName: 'cliente' });


export default ClientModel