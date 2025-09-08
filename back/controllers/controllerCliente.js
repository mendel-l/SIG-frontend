import ClientModel from "../Models/ClientMode.js";
import {registerMovi} from "./controllerAuditoria.js"
const tableName="cliente";
export const getAllClients = async (req, res) => {
    try {
        const clients = await ClientModel.findAll();
        res.json(clients);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getClient = async (req, res) => {
    try {
        const [client] = await ClientModel.findAll({
            where: { idCliente: req.params.idCliente }
        });
        if(!client)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        res.json(client);
    } catch (error) {
        res.json({ message: error.message });
    }
}

// Create Client
export const createClient = async (req, res) => {
    try {
        const [client] = await ClientModel.findAll({
            where: { Nit: req.body.Nit }
        });
        if(client)
        {
            return res.json({ message: "Datos Duplicados: Ya Hay Un Registro Con Este NIT" });
        }
        await ClientModel.create(req.body);
        
            //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------
            await ClientModel.findOne({
                order: [['idCliente', 'DESC']] 
            }).then((ultimoRegistro) => {
                let idRegistroMov;
                if (ultimoRegistro) {
                    idRegistroMov = ultimoRegistro.idCliente;
                    registerMovi(tableName, idRegistroMov, 1, 1);   
                } else {
                    console.log('No se encontraron registros en la tabla Clientes.');
                }

                console.log( "message: Auditoria registrada");
            }).catch((error) => {
                console.error('Error al registrar auditoria', error);
            });
            //----------------------- FIN ----------------------------------------------------------------------------------

        res.json({
            "message": "Registro creado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const updateClient = async (req, res) => {
    try {
        const [client] = await ClientModel.findAll({
            where: { idCliente: req.params.idCliente }
        });
        if(!client)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        await ClientModel.update(req.body, {
            where: { idCliente: req.params.idCliente }
        });
        //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------

        await registerMovi(tableName, req.params.idCliente, 1, 2);

        //----------------------- FIN ----------------------------------------------------------------------------------
        res.json({
            "message": "Registro actualizado correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const deleteClient = async (req, res) => {
    try {
        const [client] = await ClientModel.findAll({
            where: { idCliente: req.params.idCliente }
        });
        if(!client)
        {
            return res.status(404).json({ message: "Cliente no Registrado" });
        }
        await ClientModel.destroy({
            where: {
                idCliente: req.params.idCliente
            }
        });
        //--------------------- PARA LA AUDITORIA ----------------------------------------------------------------

        await registerMovi(tableName, req.params.idCliente, 1, 3);

        //----------------------- FIN ----------------------------------------------------------------------------------
        res.json({
            "message": "El registro se borró correctamente"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}
