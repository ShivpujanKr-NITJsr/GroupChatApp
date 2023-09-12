
const express=require('express');

const router=express.Router();

const controllers=require('../Controllers/controllers')

router.post('/user/signup',controllers.signUp);

router.post('/user/login',controllers.login)

module.exports=router
