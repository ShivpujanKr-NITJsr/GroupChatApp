const jwt=require('jsonwebtoken')

const authorization=(req,res,next)=>{
    const token=req.body.token;

    jwt.verify(token,process.env.jwt_key,(err,id)=>{
        if(err){
            res.status(500).json({success:false})
        }
        req.iduse=id;
        next()
    })
}

module.exports=authorization