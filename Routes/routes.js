
const express=require('express');

const authorization=require('../Utils/auth')

const router=express.Router();

const controllers=require('../Controllers/controllers')

router.post('/user/signup',controllers.signUp);

router.post('/user/login',controllers.login)

// router.post('/user/personalmessage',authorization,controllers.personalMsg)

// ------------------// router.get('/user/allchat',controllers.allChat)

router.get('/user/allchat/:lid',controllers.allChat)

router.post('/user/creategroup',authorization,controllers.createGroup)

router.post('/user/getallgroup',authorization,controllers.getAllGroup)

router.post('/user/group/allchat/:id',authorization,controllers.getAllChats)

router.post('/user/personalmessage/:id',authorization,controllers.groupPersonalMsg)
//http://65.2.75.54:3000/user/group/share/a61fb2f1-1071-406c-a0a9-77440622bc82
router.get('/user/group/share/:uid',controllers.joiningLink)

router.post('/user/group/joining',controllers.joining)

router.post('/user/group/alluser/:gid',authorization,controllers.allAdminNotAdmin)

router.post('/user/group/remove/:gid',authorization,controllers.removeUserFromGroup)

router.post('/user/group/makeadmin/:gid',authorization,controllers.makeUserAdmin)

router.post('/user/group/removeadmin/:gid',authorization,controllers.removeUserFromAdmin)
// router.post('/user/group/:gid',authorization,controllers.)

router.post('/user/allnotuser/:gid',authorization,controllers.getAllNotUser)

router.post('/user/group/:gid',controllers.directAdd)

module.exports=router
