import express from 'express'
import {getExpiredLots,getSalesInner,getMoneySoldMonth,getMoneySoldDAY,getMoneySoldWEEK,getOrderSellersMorSales,
    getSellersMorSalesMonth,getOrderClientsMorSales,getClientsMorSalesMonth,getAuditoriaInner, getLoginControl, getLoteSoonExpire} 
from '../controllers/controllerReports.js'

const routerReports = express.Router()

routerReports.get('/getExpiredLots', getExpiredLots) //lotes expirados                                           --ya
routerReports.get('/getSalesInner', getSalesInner) // ventas, pero sin llaves primarias, ya con datos           --ya
routerReports.get('/getMoneySoldMonth', getMoneySoldMonth)//dinero vendido mes                                  --ya
routerReports.get('/getMoneySoldDAY', getMoneySoldDAY)// dinero vendido dia                                     --ya
routerReports.get('/getMoneySoldWEEK', getMoneySoldWEEK)//dinero vendido semana                                 --ya
routerReports.get('/getOrderSellersMorSales', getOrderSellersMorSales) //vendedores ordenados con mas ventas   
routerReports.get('/getSellersMorSalesMonth', getSellersMorSalesMonth) // vendedoers con masvetnas mes         
routerReports.get('/getOrderClientsMorSales', getOrderClientsMorSales) // clientes ordenados con mas compras
routerReports.get('/getClientsMorSalesMonth', getClientsMorSalesMonth) //clientes con mas compras mes           --ya
routerReports.get('/getAuditoriaInner', getAuditoriaInner) //Auditoria                                          --ya
routerReports.get('/getLoginControl', getLoginControl) //control entradas y salidas AQUI ESTADO TAMBIIIIEN      --ya
routerReports.get('/getLoteSoonExpire', getLoteSoonExpire) //Lotes cercanos a vencer (1 semana)                 --no

export default routerReports
