import auditoriaModel from "../Models/auditoriaModel.js";

export const registerMovi = async (tablaMov,registroMov,idUser,idTipoMov) => {
    let currentDateHour = new Date();
        let year = currentDateHour.getFullYear();
        let month = currentDateHour.getMonth() + 1; // Corrige aquí, utiliza getMonth() y suma 1
        let day = currentDateHour.getDate(); // Corrige aquí, utiliza getDate()
        let dateNow = `${year}-${month}-${day}`;
        let hour = currentDateHour.getHours();
        let minuts = currentDateHour.getMinutes();
        let seconds = currentDateHour.getSeconds();
        let hourNow = `${hour}:${minuts}:${seconds}`;
    try {
        await auditoriaModel.create({
            Fecha: dateNow,
            Hora: hourNow,
            nombreTablaMov: tablaMov,
            idRegistroMov: registroMov,
            IDUsuarios : idUser,
            idTipoMovimiento: idTipoMov // 1-Registro, 2-actualizacion, 3-eliminacion
        });
        console.log("Registro Creado Exitosamente");
    } catch (error) {
        console.log(error.message);
    }
}