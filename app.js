const express = require('express')
const bcrypt = require('bcrypt')
const http=require('http')


const socketIo = require('socket.io');
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config();
const { User, personalMsg, Group, Admin } = require('./Models/models')
const sequelize = require('./Utils/databasecon')
const route = require('./Routes/routes');
// const authorization = require('./Utils/auth');
const AWS=require('aws-sdk')

//          multer for file parsing as buffer
const multer=require('multer')
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

User.hasMany(personalMsg)
personalMsg.belongsTo(User)
User.belongsToMany(Group, { through: 'usergroup' })
Group.belongsToMany(User, { through: 'usergroup' })
Group.hasMany(personalMsg);
personalMsg.belongsTo(Group)

User.hasMany(Admin)
Admin.belongsTo(User)
Group.hasMany(Admin);
Admin.belongsTo(Group)

const app = express();

// const server = require('http').createServer(app);
// const io = require('socket.io')(server,
//   {
//     cors: {
//       origin: ['http://127.0.0.1:3000']
//     }
//   }
// );

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.use('/user/filesharing/:token',upload.single('file'),(req,res,next)=>{
  req.body.token=req.params.token;
  next()
})

app.use('/', route)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);


  
  socket.on('userjoined',()=>{
    console.log('userjoined')
    io.emit('userjoined')
  })
  socket.on('userremovedfromgroup',()=>{
    console.log('userremovedfromgroup')
    io.emit('userremovedfromgroup')
  })
  socket.on('madeadmin',()=>{
    io.emit('madeadmin')
  })
  socket.on('removedfromadmin',()=>{
    io.emit('removedfromadmin')
  })
  socket.on('usermessaged',()=>{
    io.emit('usermessaged')
  })
  socket.on('superadminadded',()=>{
    io.emit('superadminadded')
  })
  // socket.on('groupcreated',()=>{
  //   socket.emit('groupcreated')
  // })

});

// ... your routes and other code ...

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

sequelize.sync({ alter: true }).then(() => {
  server.listen(3000)
  // app.listen(3000)
}).catch(err => {
  console.log(err)
})

