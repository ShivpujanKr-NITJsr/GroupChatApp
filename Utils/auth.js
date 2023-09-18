const jwt=require('jsonwebtoken')

const {User,personalMsg,Group,Admin}=require('../Models/models')
const authorization=(req,res,next)=>{
    const token=req.body.token;

    jwt.verify(token,process.env.jwt_key,async (err,id)=>{
        if(err){
            res.status(500).json({success:false})
        }else{
            req.iduse=id;
            const user=await User.findByPk(id);
            req.user=user;
            next()
        }
        
    })
}

module.exports=authorization