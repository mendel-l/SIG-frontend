import LoteModel from "../Models/LoteModel.js";
import sequelize from '../DB/database.js';

export const getExpiredLots= async (req, res) => {
    try {
        const query = `
            SELECT l.IDLote,l.CantidadCompra,l.cantidadDisponible,l.PrecioCompra,p.Nombre as Proveedor,m.Nombre as Medicamento,l.Fecha_Ingreso,l.Fecha_Vencimiento,l.Estado  FROM lote as l
            INNER JOIN proveedor as p
            on l.IDProveedor=p.IDProveedor
            INNER JOIN medicamento as m
            on l.idMedicamento=m.idMedicamento
            WHERE Fecha_Vencimiento<now()
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getSalesInner= async (req, res) => {
    try {
        const query = `
            SELECT v.Idventa,v.MontoTotal,c.Nombre as NombreCliente,c.Nit as NitCliente,
            p.Nombres as NombreVendedor,p.CUI as CuiVendedor, v.Fecha
            FROM venta as v
            INNER JOIN cliente as c
            on v.idCliente=c.idCliente
            INNER JOIN persona as p
            on v.idPersona = p.idPersona
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getMoneySoldMonth= async (req, res) => {
    try {
        const query = `
            SELECT
            EXTRACT(YEAR FROM Fecha) AS año,
            EXTRACT(MONTH FROM Fecha) AS mes,
            SUM(MontoTotal) AS Vendido
            FROM venta
            GROUP BY EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha)
            ORDER BY EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha)
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getMoneySoldWEEK= async (req, res) => {
    try {
        const query = `
            SELECT
            EXTRACT(YEAR FROM Fecha) AS AÑO,
            EXTRACT(MONTH FROM Fecha) AS MES,
            FLOOR((DAY(Fecha) - 1) / 7) + 1 AS SEMANA_DEL_MES,
            SUM(MontoTotal) AS Vendido
            FROM venta
            GROUP BY EXTRACT(YEAR FROM Fecha), EXTRACT(MONTH FROM Fecha), SEMANA_DEL_MES
            ORDER BY EXTRACT(YEAR FROM Fecha), EXTRACT(MONTH FROM Fecha), SEMANA_DEL_MES    
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getMoneySoldDAY= async (req, res) => {
    try {
        const query = `
            SELECT
            EXTRACT(YEAR FROM Fecha) AS AÑO,
            EXTRACT(MONTH FROM Fecha) AS MES,
            EXTRACT(DAY FROM Fecha) AS DIA,
            SUM(MontoTotal) AS Vendido
            FROM venta
            GROUP BY EXTRACT(YEAR FROM Fecha), EXTRACT(MONTH FROM Fecha),EXTRACT(DAY FROM Fecha)
            ORDER BY EXTRACT(YEAR FROM Fecha), EXTRACT(MONTH FROM Fecha),EXTRACT(DAY FROM Fecha)
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getOrderSellersMorSales= async (req, res) => {
    try {
        const query = `
            SELECT
            persona.Nombres,
            persona.CUI,
            COUNT(*) AS ventasTotales,
            SUM(venta.MontoTotal) AS montoTotalGenerado
            FROM venta
            INNER JOIN persona ON venta.idPersona = persona.idPersona
            GROUP BY persona.idPersona
            ORDER BY ventasTotales DESC
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getSellersMorSalesMonth= async (req, res) => {
    try {
        const query = `
            SELECT
            EXTRACT(YEAR FROM venta.Fecha) AS Año,
            EXTRACT(MONTH FROM venta.Fecha) AS Mes,
            persona.Nombres,
            persona.CUI,
            COUNT(*) AS VentasTotales,
            SUM(venta.MontoTotal) AS MontoTotalGenerado
            FROM venta
            INNER JOIN persona ON venta.idPersona = persona.idPersona
            GROUP BY Año, Mes, venta.idPersona
            ORDER BY Año DESC, Mes DESC, VentasTotales DESC
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getOrderClientsMorSales= async (req, res) => {
    try {
        const query = `
            SELECT cliente.Nombre, cliente.Nit,
            COUNT(*) AS comprasTotales
            FROM venta
            INNER JOIN cliente ON venta.idCliente = cliente.idCliente
            GROUP BY cliente.idCliente
            ORDER BY comprasTotales DESC
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getClientsMorSalesMonth= async (req, res) => {
    try {
        const query = `
            SELECT
            EXTRACT(YEAR FROM venta.Fecha) AS Año,
            EXTRACT(MONTH FROM venta.Fecha) AS Mes,
            cliente.Nombre,
            cliente.Nit,
            COUNT(*) AS ComprasTotales
            FROM venta
            INNER JOIN cliente ON venta.idCliente = cliente.idCliente
            GROUP BY Año, Mes, venta.idCliente
            ORDER BY Año DESC, Mes DESC, ComprasTotales DESC    
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getAuditoriaInner= async (req, res) => {
    try {
        const query = `
            SELECT au.IdAuditoria,us.Usuario as UsuarioModificador,
            per.Nombres as PersonaModificador, au.nombreTablaMov as TablaTrabajada, 
            au.idRegistroMov as RegistroTrabajado, tip.Movimiento as Accion
            From auditoria as au
            INNER JOIN usuario as us
            on au.IDUsuarios=us.IDUsuarios
            INNER JOIN tipomovimiento as tip
            on au.idTipoMovimiento=tip.idTipoMovimiento
            INNER JOIN persona as per
            on per.idPersona=us.idPersona    
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getLoginControl= async (req, res) => {
    try {
        const query = `
            SELECT con.IDControl,p.Nombres,us.Usuario,
            con.FechaIn,con.FechaOut,con.Estado,con.FechaOut,con.HoraOut 
            From controlentradas as con
            INNER JOIN usuario as us
            on us.IDUsuarios=con.IDUsuarios
            INNER JOIN persona as p
            ON us.idPersona = p.idPersona 
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getLoteSoonExpire= async (req, res) => {
    try {
        const query = `
            SELECT l.IDLote, l.cantidadDisponible, m.Nombre as Medicamento, l.Fecha_Vencimiento
            FROM lote as l
            INNER JOIN proveedor as p on l.IDProveedor = p.IDProveedor
            INNER JOIN medicamento as m on l.idMedicamento = m.idMedicamento
            WHERE DATEDIFF(l.Fecha_Vencimiento, NOW()) <= 7 AND l.Estado = true
        `;
        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        res.json({ message: error.message });
    }
}