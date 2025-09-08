import LoteModel from "../Models/LoteModel.js";
import { registerMovi } from "./controllerAuditoria.js";
import sequelize from '../DB/database.js';
const tableName = "lote";

export const getAllLotes = async (req, res) => {
    try {
        const lotes = await LoteModel.findAll();
        res.json(lotes);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllInner = async (req, res) => {
    try {
        const query = `
        SELECT lote.*,proveedor.Nombre as Proveedor,medicamento.Nombre as Medicamento FROM lote
        INNER JOIN proveedor
        on proveedor.IDProveedor=lote.IDProveedor
        INNER JOIN medicamento
        on medicamento.idMedicamento=lote.idMedicamento
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getLote = async (req, res) => {
    try {
        const [lote] = await LoteModel.findAll({
            where: { IDLote: req.params.IDLote }
        });
        if(!lote)
        {
            return res.status(404).json({ message: "Lote no Registrado" });
        }
        res.json(lote);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllLotesById = async (req, res) => {
    try {
        const lotes = await LoteModel.findAll({
            where: { idMedicamento: req.params.idMedicamento }
        });
        if(!lotes)
        {
            return res.status(404).json({ message: "No exiten Lotes Para el Medicamento" });
        }
        res.json(lotes);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createLote = async (req, res) => {
    try {
        const nuevoLote = await LoteModel.create(req.body);
        const idRegistroMov = nuevoLote.IDLote;

            await LoteModel.findOne({
                order: [['IDLote', 'DESC']]
            }).then((ultimoRegistro) => {
                let idRegistroMov;
                if (ultimoRegistro) {
                    idRegistroMov = ultimoRegistro.IDLote;
                    registerMovi(tableName, idRegistroMov, 1, 1);
                } else {
                    console.log('No se encontraron registros en la tabla lote.');
                }

                console.log("message: Auditoria registrada");
            }).catch((error) => {
                console.error('Error al registrar auditoria', error);
            });

        res.json({
            message: "Registro Creado Exitosamente",
            ID: "ID Lote: "+idRegistroMov
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateLote = async (req, res) => {
    try {
        const [lote] = await LoteModel.findAll({
            where: { IDLote: req.params.IDLote }
        });
        if(!lote)
        {
            return res.status(404).json({ message: "Lote no Registrado" });
        }
        await LoteModel.update(req.body, {
            where: { IDLote: req.params.IDLote }
        });

        await registerMovi(tableName, req.params.IDLote, 1, 2);

        res.json({
            "message": "Registro actualizado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteLote = async (req, res) => {
    try {
        const [lote] = await LoteModel.findAll({
            where: { IDLote: req.params.IDLote }
        });
        if(!lote)
        {
            return res.status(404).json({ message: "Lote no Registrado" });
        }
        await LoteModel.destroy({
            where: {
                IDLote: req.params.IDLote
            }
        });

        await registerMovi(tableName, req.params.IDLote, 1, 3);

        res.json({
            "message": "El registro se borró correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getSumLotes = async (req, res) => {
    try {
        const idMedicamento = req.params.idMedicamento;

        const lotes = await LoteModel.findAll({
            where: { idMedicamento: idMedicamento }
        });

        let totalCantidadDisponible = 0;
        lotes.forEach((lote) => {
            totalCantidadDisponible += lote.cantidadDisponible;
        });

        res.json({ totalCantidadDisponible });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateLotsExpired = async (req, res) => {
    try {
        const query = `
            UPDATE lote SET Estado= 0 
            WHERE DATEDIFF(Fecha_Vencimiento, NOW()) < 0 
            AND Estado = true
        `;
        const [results] = await sequelize.query(query);
        console.log("Lotes Desactivados: " + results.affectedRows);
        res.json("Lotes Desactivados: " + results.affectedRows);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllLotesActive = async (req, res) => {
    try {
        const lotes = await LoteModel.findAll({
            where: { Estado: true }
        });
        res.json(lotes);
    } catch (error) {
        res.json({ message: error.message });
    }
}