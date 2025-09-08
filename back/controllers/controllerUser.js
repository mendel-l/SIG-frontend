import userModel from "../Models/userModel.js";
import {registerIn} from "./controllerEntradas.js";

export const validateLogin = async (req, res) => {
    const { Usuario, Contraseña } = req.body;
    try {
        // Busca un usuario con el nombre de usuario proporcionado
        const usuarioObj = await userModel.findOne({
            where: { Usuario: Usuario }
        });

        if (!usuarioObj) {
            // Usuario no encontrado, ya no seigue con la ejecucuion de las otras lineas
            return res.send('Autenticación fallida');
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        if (usuarioObj.Contraseña === Contraseña) {
            await console.log(registerIn(usuarioObj.IDUsuarios));
            return res.send('Validacion Exitosa');
            //return res.redirect('/dashboard');;
        } else {
            return res.send('Autenticación fallida');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error en la autenticación');
    }
}

