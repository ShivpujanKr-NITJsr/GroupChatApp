const Sequelize=require('sequelize');


const sequelize=new Sequelize(process.env.db_name,process.env.db_user,process.env.db_pass,{
    host:process.env.db_host,
    dialect:'mysql',
    logging: false,
},
)


module.exports=sequelize;