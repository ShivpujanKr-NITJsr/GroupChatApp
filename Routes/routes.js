
const express=require('express');

const router=express.Router();

const controllers=require('../Controllers/controllers')

router.post('/user/signup',controllers.signUp);



module.exports=router
