import Detalle_FacturaModel from "../Models/Detalle_FacturaModel.js";
import { registerMovi } from "./controllerAuditoria.js";
const tableName = "detalle_factura";
import sequelize from '../DB/database.js';

export const getAllDetalles = async (req, res) => {
    try {
        const detalles = await Detalle_FacturaModel.findAll();
        res.json(detalles);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getDetalle = async (req, res) => {
    try {
        const [detalle] = await Detalle_FacturaModel.findAll({
            where: { idDetalle: req.params.idDetalle }
        });
        if(!detalle)
        {
            return res.status(404).json({ message: "Detalle no Registrado" });
        }
        res.json(detalle);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getDetallesByIdVenta = async (req, res) => {
    try {
        const { IdVenta } = req.params;
        const query = `
            SELECT det.IdDetalle,med.Nombre,inv.PrecioVenta,det.Cantidad,det.subTotal 
            FROM detalle_factura as det
            INNER JOIN inventario as inv ON det.IdInventario = inv.IdInventario
            INNER JOIN medicamento as med ON inv.idMedicamento = med.idMedicamento 
            WHERE det.Idventa = :IdVenta
        `;
        const results = await sequelize.query(query,{
            replacements: { IdVenta },
            type: sequelize.QueryTypes.SELECT
        });
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getDetalleTemp = async (req, res) => {
    try {
        const { IdVenta } = req.params;
        const query = `
            SELECT det.IdDetalle,med.Nombre,inv.PrecioVenta,det.Cantidad,det.subTotal 
            FROM detalle_factura as det
            INNER JOIN inventario as inv ON det.IdInventario = inv.IdInventario
            INNER JOIN medicamento as med ON inv.idMedicamento = med.idMedicamento 
            WHERE det.Idventa = :IdVenta
        `;
        const results = await sequelize.query(query,{
            replacements: { IdVenta },
            type: sequelize.QueryTypes.SELECT
        });
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createDetalle = async (req, res) => {
    try {
        const nuevoDetalle = await Detalle_FacturaModel.create(req.body);
        const idRegistroMov = nuevoDetalle.IdDetalle;

            await Detalle_FacturaModel.findOne({
                order: [['IdDetalle', 'DESC']]
            }).then((ultimoRegistro) => {
                let idRegistroMov;
                if (ultimoRegistro) {
                    idRegistroMov = ultimoRegistro.IdDetalle;
                    registerMovi(tableName, idRegistroMov, 1, 1);
                } else {
                    console.log('No se encontraron registros en la tabla detalle_factura.');
                }

                console.log("message: Auditoria registrada");
            }).catch((error) => {
                console.error('Error al registrar auditoria', error);
            });

        res.json({
            "message": "Registro Creado Exitosamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateDetalle = async (req, res) => {
    try {
        const [detalle] = await Detalle_FacturaModel.findAll({
            where: { IdDetalle: req.params.idDetalle }
        });
        if(!detalle)
        {
            return res.status(404).json({ message: "Detalle no Registrado" });
        }
        await Detalle_FacturaModel.update(req.body, {
            where: { IdDetalle: req.params.idDetalle }
        });

        await registerMovi(tableName, req.params.idDetalle, 1, 2);

        res.json({
            "message": "Registro actualizado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteDetalle = async (req, res) => {
    try {
        const [detalle] = await Detalle_FacturaModel.findAll({
            where: { idDetalle: req.params.idDetalle }
        });
        if(!detalle)
        {
            return res.status(404).json({ message: "Detalle no Registrado" });
        }
        await Detalle_FacturaModel.destroy({
            where: {
                idDetalle: req.params.idDetalle
            }
        });

        await registerMovi(tableName, req.params.idDetalle, 1, 3);

        res.json({
            "message": "El registro se borró correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}
