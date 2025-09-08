import {Sequelize} from 'sequelize'
const db=new Sequelize ('pfinal software','root','',{
    host:'localhost',
    dialect:'mysql'
})

export default db