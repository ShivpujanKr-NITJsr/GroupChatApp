const express= require('express')

const bcrypt=require('bcrypt')

const path =require('path')

require('dotenv').config();

const User=require('./Models/models')

const sequelize=require('./Utils/databasecon')

const route=require('./Routes/routes')

const cors=require('cors')



sequelize.sync({alter:true})

const app=express();

app.use(express.static(path.join(__dirname,'public')))

app.use(express.json())

app.use(cors())

app.use('/',route)

app.listen(3000)