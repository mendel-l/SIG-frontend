import db from '../DB/database.js';

export const obtenerDatos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM cliente');
    res.json(result);
  } catch (err) {
    console.error('Error al obtener datos de la base de datos: ' + err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
};
