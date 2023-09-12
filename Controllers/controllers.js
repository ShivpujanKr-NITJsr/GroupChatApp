const User=require('../Models/models')
const bcrypt=require('bcrypt')

exports.signUp=(req,res,next)=>{
    // console.log(req.body);
    const name=req.body.name;
    const email=req.body.email;
    const phone=req.body.phone;
    const password=req.body.password;

    User.findOne({where:{email:email}})
        .then(result=>{
            if(result!=null){
                res.status(200).json({msg:'already exists'})
            }else{

                bcrypt.hash(password,(err,hash)=>{
                    User.create({name,email,phone,password:hash})
                        .then(resul=>{
                            res.status(200).json({msg:'ok',message:'user created successfully'})
                        }).catch(err=>{
                            throw new Error(err)
                        })
                })
                
            }
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message:'something went wrong'})
        })

    
}