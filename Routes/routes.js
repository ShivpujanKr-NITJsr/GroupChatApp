
const express=require('express');

const authorization=require('../Utils/auth')

const router=express.Router();

const controllers=require('../Controllers/controllers')

router.post('/user/signup',controllers.signUp);

router.post('/user/login',controllers.login)

router.post('/user/personalmessage',authorization,controllers.personalMsg)

// router.get('/user/allchat',controllers.allChat)

router.get('/user/allchat/:lid',controllers.allChat)

router.post('/user/creategroup',authorization,controllers.createGroup)

router.post('/user/getallgroup',authorization,controllers.getAllGroup)

router.get('/user/group/allchat/:id',controllers.getAllChats)

router.post('/user/personalmessage/:id',authorization,controllers.groupPersonalMsg)
//http://127.0.0.1:3000/user/group/share/a61fb2f1-1071-406c-a0a9-77440622bc82
router.get('/user/group/share/:uid',controllers.joiningLink)

router.post('/user/group/joining',controllers.joining)

module.exports=router
