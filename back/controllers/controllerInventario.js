import InventarioModel from "../Models/InventarioModel.js";
import LoteModel from "../Models/LoteModel.js";
import { registerMovi } from "./controllerAuditoria.js";
import sequelize from '../DB/database.js';
const tableName = "inventario";

export const getAllInventarios = async (req, res) => {
    try {
        const inventarios = await InventarioModel.findAll();
        res.json(inventarios);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getInvInnerMed = async (req, res) => {
    try {
        const query = `
            SELECT inventario.IdInventario,inventario.idMedicamento,inventario.PrecioVenta,medicamento.Nombre
            FROM inventario
            INNER JOIN medicamento
            ON inventario.idMedicamento=medicamento.idMedicamento
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getInventario = async (req, res) => {
    try {
        const [inventario] = await InventarioModel.findAll({
            where: { IdInventario: req.params.IdInventario }
        });
        if(!inventario)
        {
            return res.status(404).json({ message: "Elemento en Inventario no Registrado" });
        }
        res.json(inventario);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const createInventario = async (req, res) => {
    try {
        const [inventario] = await InventarioModel.findAll({
            where: { idMedicamento: req.body.idMedicamento }
        });
        if(inventario)
        {
            return res.json({ message: "El medicamento Ya tiene un Registro en Inventario" });
        }
        const nuevoInventario = await InventarioModel.create(req.body);
        const idRegistroMov = nuevoInventario.IdInventario;

            await InventarioModel.findOne({
                order: [['IdInventario', 'DESC']]
            }).then((ultimoRegistro) => {
                let idRegistroMov;
                if (ultimoRegistro) {
                    idRegistroMov = ultimoRegistro.IdInventario;
                    registerMovi(tableName, idRegistroMov, 1, 1);
                } else {
                    console.log('No se encontraron registros en la tabla inventario.');
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

export const updateInventario = async (req, res) => {
    try {
        const [inventario] = await InventarioModel.findAll({
            where: { IdInventario: req.params.IdInventario }
        });
        if(!inventario)
        {
            return res.status(404).json({ message: "Elemento en Inventario no Registrado" });
        }
        await InventarioModel.update(req.body, {
            where: { IdInventario: req.params.IdInventario }
        });

        await registerMovi(tableName, req.params.IdInventario, 1, 2);

        res.json({
            "message": "Registro actualizado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteInventario = async (req, res) => {
    try {
        const [inventario] = await InventarioModel.findAll({
            where: { IdInventario: req.params.IdInventario }
        });
        if(!inventario)
        {
            return res.status(404).json({ message: "Elemento en Inventario no Registrado" });
        }
        await InventarioModel.destroy({
            where: {
                IdInventario: req.params.IdInventario
            }
        });

        await registerMovi(tableName, req.params.IdInventario, 1, 3);

        res.json({
            "message": "El registro se borró correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const descargarInventario = async (req, res) => {
    try {
        const total = parseInt(req.params.total);
        const lote = await LoteModel.findByPk(req.params.IDLote);
            if (!lote) {
                return res.status(404).json({ message: "Lote no encontrado" });
            }
        const inventario = await InventarioModel.findOne({where: { idMedicamento: lote.idMedicamento }});
            if (!inventario) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

        lote.cantidadDisponible -= total;
        lote.save();
        inventario.CantidadDisponible -= total;
        inventario.save();

        const precioVenta = inventario.PrecioVenta;
        const resultado = total * precioVenta;
       
        // await registerMovi(tableName, req.params.IdInventario, 1, 2);
        res.json({
            message: "Producto descargado correctamente",
            resultado: resultado
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const cargarInventario = async (req, res) => {
    try {
        const total = parseInt(req.params.total);
        const lote = await LoteModel.findByPk(req.params.IDLote);
            if (!lote) {
                return res.status(404).json({ message: "Lote no encontrado" });
            }
        const inventario = await InventarioModel.findOne({where: { idMedicamento: lote.idMedicamento }});
            if (!inventario) {
                return res.status(404).json({ message: "Producto no encontrado" });
            }

        lote.cantidadDisponible += total;
        lote.save();
        inventario.CantidadDisponible += total;
        inventario.save();

        const precioVenta = inventario.PrecioVenta;
        const resultado = total * precioVenta;
       
        // await registerMovi(tableName, req.params.IdInventario, 1, 2);
        res.json({
            message: "Producto cargado correctamente",
            resultado: resultado
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAllInventariosActive = async (req, res) => {
    try {
        const inventarios = await InventarioModel.findAll({
            where: { Estado: true }
        });
        res.json(inventarios);
    } catch (error) {
        res.json({ message: error.message });
    }
}