import controlInModel from "../Models/controlInModel.js";

export const registerIn = async (idUser) => {
    let currentDateHour = new Date();
    let year = currentDateHour.getFullYear();
    let month = currentDateHour.getMonth() + 1;
    let day = currentDateHour.getDate();
    let dateNow = `${year}-${month}-${day}`;
    let hour = currentDateHour.getHours();
    let minuts = currentDateHour.getMinutes();
    let seconds = currentDateHour.getSeconds();
    let hourNow = `${hour}:${minuts}:${seconds}`;
    try {
        await controlInModel.create({
            FechaIn: dateNow,
            HoraIn: hourNow,
            IDUsuarios: idUser,
            Estado: true
        });
        console.log("Registro Creado Exitosamente");
    } catch (error) {
        console.log(error.message);
    }
}

export const registerOut = async (req, res) => {

    try {
        const {localId} = req.body; //BUSCAR INVESTIGAR forma de obtener el ID del usuario que cierra sesión
        //console.log("Contenido de req.body: " + JSON.stringify(req.body));
        let currentDateHour = new Date();
        let year = currentDateHour.getFullYear();
        let month = currentDateHour.getMonth() + 1; // Corrige aquí, utiliza getMonth() y suma 1
        let day = currentDateHour.getDate(); // Corrige aquí, utiliza getDate()
        let dateNow = `${year}-${month}-${day}`;
        let hour = currentDateHour.getHours();
        let minuts = currentDateHour.getMinutes();
        let seconds = currentDateHour.getSeconds();
        let hourNow = `${hour}:${minuts}:${seconds}`;

        await controlInModel.update(
            { FechaOut: dateNow, 
              HoraOut: hourNow, 
              Estado: false },
            { where: { IDUsuarios: localId, Estado: true} }
        );

        console.log("Cierre de sesión registrado");
        return res.send('Cierre de sesión exitoso');
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Error al cerrar sesión');
    }
}