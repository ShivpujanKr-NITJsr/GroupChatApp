const {User,personalMsg,Group}=require('../Models/models')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Sequelize = require('sequelize');
const {v4:uuidv4}=require('uuid')

const fs=require('fs')
const path=require('path')
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

                bcrypt.hash(password,10,(err,hash)=>{
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

exports.login=(req,res,next)=>{
    // console.log(req)
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({where:{email:email}})
        .then(resu=>{
            if(resu!=null){

                bcrypt.compare(password,resu.password,(err,result)=>{
                    if(result==true){
                        const token=jwt.sign(resu.id,process.env.jwt_key)
                        res.json({token:token,message:'User login successful',success:true})
                    }else{
                        res.status(401).json({ success: false, message: 'User not authorized' })
                    }
                })
            }else{
                res.status(404).json({ success: false, message: 'User not found' })
            }
        }).catch(err=>console.log(err))
}

exports.personalMsg=(req,res,next)=>{
    const uid=req.iduse
    personalMsg.create({userId:uid,msg:req.body.chatmsg})
        .then(result=>{
            res.status(200).json({message:'chat is in now database',success:true})
        }).catch(err=>{
            console.log(err)
            res.status(500).json({message:'something went wrong',success:false})
        })
}

exports.groupPersonalMsg=(req,res,next)=>{
    const uid=req.iduse;
    const gid=req.params.id;

    personalMsg.create({userId:uid,msg:req.body.chatmsg,groupId:gid})
        .then(result=>{
            res.status(200).json({message:'chat is in now database',success:true})
        }).catch(err=>{
            console.log(err)
            res.status(500).json({message:'something went wrong',success:false})
        })
}

exports.allChat=(req,res,next)=>{

    const lid=req.params.lid;
    personalMsg.findAll({where:{id: {
        [Sequelize.Op.gt]:lid,
      }}})
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            console.log(err)
        })
}

exports.createGroup=async (req,res,next)=>{

    const uid=req.iduse

    const uuid=uuidv4()

    try{
        const user=await User.findOne({where:{id:uid}})

        const group=await user.createGroup({name:req.body.groupname,uuid:uuid});

        await user.addGroup(group)
    
        res.json(group)
    }catch(err){
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }
    
}

exports.getAllGroup=async (req,res,next)=>{
    
    const uid=req.iduse;
    try{
        const user=await User.findOne({where:{id:uid}})

        const group=await user.getGroups()
    
        res.json(group)
    }catch(err){
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }
    
}

exports.getAllChats=async (req,res,next)=>{
    const gid=req.params.id;

    try{
        const chats=await personalMsg.findAll({where:{groupId:gid}})
        // console.log(chats)
        res.json(chats)
    }catch(err){
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }
    
}

exports.joiningLink=(req,res,next)=>{
    const uid=req.params.uid;

    const dirurl=path.join(__dirname,'..','public','joingroup.html')

    try{

        let data=fs.readFileSync(dirurl,'utf-8');

        data=data.replace('<%=name%>',uid)

        res.send(data)
    }catch(err){
        console.log(err)
    }
    
}

exports.joining=async (req,res,next)=>{
    const uid=req.body.uuid;
    const email=req.body.email;
    const password=req.body.password;

    // console.log(req.body)
    const grp= await Group.findOne({where:{uuid:uid}})

    if(grp==null){
        res.status(404).json({message:'unauthorized access'})
    }
    let found;
    try{
        const user=await User.findOne({where:{email:email}})
        
        bcrypt.compare(password,user.password,async (err,result)=>{
            // console.log(err)
            if(result==true){
    
                // user.addGroup
                const u=await user.getGroups({where:{uuid:uid}})
                // console.log(u,'i am here for u')
                // const u=await Group.findOne({where:{[Sequelize.Op.and]:{uuid:uid,userId:user.id}}})
                if(u!=null && u.length>0){
                    const token=jwt.sign(user.id,process.env.jwt_key)
                    res.json({message:'already in the group',success:true,token:token})
                }else{
                    await grp.addUser(user)
                    const token=jwt.sign(user.id,process.env.jwt_key)
                    res.json({message:'joined the group',success:true,token:token})
                }
                
            }else {
                res.json({ message: 'Password is wrong', success: false });
            }
        })
    }catch(err){
        console.log(err)
    }
    
   
}
    

  
