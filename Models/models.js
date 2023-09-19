
const sequelize=require('../Utils/databasecon');

const Sequelize=require('sequelize')

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:Sequelize.STRING,
    email:Sequelize.STRING,
    phone:Sequelize.STRING,
    password:Sequelize.STRING
})

const personalMsg=sequelize.define('personalmsg',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    msg:Sequelize.STRING,
    type:Sequelize.STRING
})

const Group=sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:Sequelize.STRING,
    uuid:{
        type:Sequelize.STRING
    }
})

const Admin=sequelize.define('admin',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    // groupname:Sequelize.STRING
    isadmin:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})



module.exports={User,personalMsg,Group,Admin}