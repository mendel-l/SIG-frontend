import tipoMovModel from "../Models/tipoMovModel.js";
import { registerMovi } from "./controllerAuditoria.js"
const tableName = "tipomovimiento";

export const getAllTipoMov = async (req, res) => {
    try {
        const tipoMov = await tipoMovModel.findAll();
        res.json(tipoMov);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createTipoMov = async (req, res) => {
    try {
        await tipoMovModel.create(req.body);

        //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------
        await tipoMovModel.findOne({
            order: [['idTipoMovimiento', 'DESC']]
        }).then((ultimoRegistro) => {
            let idRegistroMov;
            if (ultimoRegistro) {
                idRegistroMov = ultimoRegistro.idTipoMovimiento;
                registerMovi(tableName, idRegistroMov, 1, 1);
            } else {
                console.log('No se encontraron registros en la tabla TipoMovimiento.');
            }

            console.log("message Auditoria registrada");
        }).catch((error) => {
            console.error('Error al registrar auditoria', error);
        });
        //----------------------- FIN ----------------------------------------------------------------------------------

        res.json({
            "message": "Registro Creado Exitosamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}


export const updateTipoMov = async (req, res) => {
    try {
        await tipoMovModel.update(req.body, {
            where: { idTipoMovimiento: req.params.idTipoMovimiento }
        });
        await registerMovi(tableName, req.params.idTipoMovimiento, 1, 2);
        res.json({
            "message": "Registro Actualizado Exitosamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteTipoMov = async (req, res) => {
    try {
        await tipoMovModel.destroy({
            where: {
                idTipoMovimiento: req.params.idTipoMovimiento
            }
        });
        await registerMovi(tableName, req.params.idTipoMovimiento, 1, 3);
        res.json({
            "message": "Registro Eliminado Exitosamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}