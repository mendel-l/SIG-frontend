import ProveedorModel from "../Models/ProveedoresModel.js";
import { registerMovi } from "./controllerAuditoria.js";
const tableName = "proveedor"; // NOMBRE DE TABLA PARA LA AUDITORIA

export const getAllProveedores = async (req, res) => {
    try {
        const proveedores = await ProveedorModel.findAll();
        res.json(proveedores);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getProveedor = async (req, res) => {
    try {
        const [proveedor] = await ProveedorModel.findAll({
            where: { IDProveedor: req.params.IDProveedor }
        });
        if(!proveedor)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        res.json(proveedor);
    } catch (error) {
        res.json({ message: error.message });
    }
}

// Create Proveedor
export const createProveedor = async (req, res) => {
    try {
        await ProveedorModel.create(req.body);

            //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------
            await ProveedorModel.findOne({
                order: [['IDProveedor', 'DESC']] // Ordena por la columna "IDProveedor" en orden descendente
            }).then((ultimoRegistro) => {
                let idRegistroMov;
                if (ultimoRegistro) {
                    // Si se encontró un registro, obtén su IDProveedor
                    idRegistroMov = ultimoRegistro.IDProveedor;
                    registerMovi(tableName, idRegistroMov, 1, 1); // El tercer parametro "1", dejemolo asi mientras como prueba, ese es el usuario que hizo la modificacion, dejemolo 1 mientras
                } else {
                    console.log('No se encontraron registros en la tabla proveedor.');
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

export const updateProveedor = async (req, res) => {
    try {
        const [verifyProveedor] = await ProveedorModel.findAll({
            where: { IDProveedor: req.params.IDProveedor }
        });
        if(!verifyProveedor)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        await ProveedorModel.update(req.body, {
            where: { IDProveedor: req.params.IDProveedor }
        });

        //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------

        await registerMovi(tableName, req.params.IDProveedor, 1, 2);

        //----------------------- FIN ----------------------------------------------------------------------------------

        res.json({
            "message": "Registro actualizado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteProveedor = async (req, res) => {
    try {
        const [verifyProveedor] = await ProveedorModel.findAll({
            where: { IDProveedor: req.params.IDProveedor }
        });
        if(!verifyProveedor)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        await ProveedorModel.destroy({
            where: {
                IDProveedor: req.params.IDProveedor
            }
        });

        //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------

        await registerMovi(tableName, req.params.IDProveedor, 1, 3);

        //----------------------- FIN ----------------------------------------------------------------------------------

        res.json({
            "message": "El registro se borró correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllProveedoresActive = async (req, res) => {
    try {
        const proveedores = await ProveedorModel.findAll({
            where: { Estado: true }
        });
        res.json(proveedores);
    } catch (error) {
        res.json({ message: error.message });
    }
}