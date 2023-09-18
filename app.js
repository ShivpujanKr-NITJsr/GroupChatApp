const express = require('express')
const bcrypt = require('bcrypt')
const http=require('http')

const socketIo = require('socket.io');
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config();
const { User, personalMsg, Group, Admin } = require('./Models/models')
const sequelize = require('./Utils/databasecon')
const route = require('./Routes/routes')

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
app.use('/', route)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle events when messages are sent
  // socket.on('new message', (data) => {
  //   // Broadcast the message to all connected clients
  //   io.emit('new message', {
  //     username: socket.username,
  //     message: data,
  //   });
  // });

  // Add more event handlers for your application as needed

  // Handle disconnection
  // socket.on('disconnect', () => {
  //   console.log('Client disconnected:', socket.id);
  //   io.emit('user disconnected', { userId: socket.id });
  // });
  

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

