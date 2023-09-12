
const express=require('express');

const authorization=require('../Utils/auth')

const router=express.Router();

const controllers=require('../Controllers/controllers')

router.post('/user/signup',controllers.signUp);

router.post('/user/login',controllers.login)

router.post('/user/personalmessage',authorization,controllers.personalMsg)

module.exports=router
