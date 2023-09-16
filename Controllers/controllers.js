const { User, personalMsg, Group, Admin } = require('../Models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize');
const { v4: uuidv4 } = require('uuid')

const fs = require('fs')
const path = require('path');
const sequelize = require('../Utils/databasecon');
exports.signUp = (req, res, next) => {
    // console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    User.findOne({ where: { email: email } })
        .then(result => {
            if (result != null) {
                res.status(200).json({ msg: 'already exists' })
            } else {

                bcrypt.hash(password, 10, (err, hash) => {
                    User.create({ name, email, phone, password: hash })
                        .then(resul => {
                            res.status(200).json({ msg: 'ok', message: 'user created successfully' })
                        }).catch(err => {
                            throw new Error(err)
                        })
                })

            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ message: 'something went wrong' })
        })


}

exports.login = (req, res, next) => {
    // console.log(req)
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } })
        .then(resu => {
            if (resu != null) {

                bcrypt.compare(password, resu.password, (err, result) => {
                    if (result == true) {
                        const token = jwt.sign(resu.id, process.env.jwt_key)
                        res.json({ token: token, message: 'User login successful', success: true })
                    } else {
                        res.status(401).json({ success: false, message: 'User not authorized' })
                    }
                })
            } else {
                res.status(404).json({ success: false, message: 'User not found' })
            }
        }).catch(err => console.log(err))
}

exports.personalMsg = (req, res, next) => {
    const uid = req.iduse
    personalMsg.create({ userId: uid, msg: req.body.chatmsg })
        .then(result => {
            res.status(200).json({ message: 'chat is in now database', success: true })
        }).catch(err => {
            console.log(err)
            res.status(500).json({ message: 'something went wrong', success: false })
        })
}

exports.groupPersonalMsg = (req, res, next) => {
    const uid = req.iduse;
    const gid = req.params.id;

    personalMsg.create({ userId: uid, msg: req.body.chatmsg, groupId: gid })
        .then(result => {
            res.status(200).json({ message: 'chat is in now database', success: true })
        }).catch(err => {
            console.log(err)
            res.status(500).json({ message: 'something went wrong', success: false })
        })
}

exports.allChat = (req, res, next) => {

    const lid = req.params.lid;
    personalMsg.findAll({
        where: {
            id: {
                [Sequelize.Op.gt]: lid,
            }
        }
    })
        .then(result => {
            res.json(result)
        }).catch(err => {
            console.log(err)
        })
}

exports.createGroup = async (req, res, next) => {

    const uid = req.iduse

    const uuid = uuidv4()

    try {
        const user = await User.findOne({ where: { id: uid } })

        const group = await user.createGroup({ name: req.body.groupname, uuid: uuid });

        await user.addGroup(group)

        const admin = await user.createAdmin({ isadmin: true })

        await user.addAdmin(admin);

        await group.addAdmin(admin);
        res.json(group)
    } catch (err) {
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }

}

exports.getAllGroup = async (req, res, next) => {

    const uid = req.iduse;
    try {
        const user = await User.findOne({ where: { id: uid } })

        const group = await user.getGroups()

        res.json(group)
    } catch (err) {
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }

}

exports.getAllChats = async (req, res, next) => {
    const gid = req.params.id;
    const mainuser = req.iduse

    try {
        const chats = await personalMsg.findAll({
            where: { groupId: gid },
            include: [
                {
                    model: User,
                    attributes: ['name'],
                    // as: 'user',
                }
            ],
            order: [['createdAt', 'ASC']],
        })
        const updated = chats.map(chat => {
            if (chat.userId == mainuser) {
                chat.user.name = 'You '
            }
            return chat;
        })

        // chats.forEach(chat => {
        //     const userName = chat.user ? chat.user.name : 'Unknown User';
        //     console.log(`Message: ${chat.msg}, User: ${userName}`);
        // });

        // res.json(chats)
        res.json(updated)
    } catch (err) {
        console.log(err)
        // res.satus(500).json({success:false,message:'something went wrong'})
    }

}

exports.joiningLink = (req, res, next) => {
    const uid = req.params.uid;

    const dirurl = path.join(__dirname, '..', 'public', 'joingroup.html')

    try {

        let data = fs.readFileSync(dirurl, 'utf-8');

        data = data.replace('<%=name%>', uid)

        res.send(data)
    } catch (err) {
        console.log(err)
    }

}

exports.joining = async (req, res, next) => {
    const uid = req.body.uuid;
    const email = req.body.email;
    const password = req.body.password;

    // console.log(req.body)
    const grp = await Group.findOne({ where: { uuid: uid } })

    if (grp == null) {
        res.status(404).json({ message: 'unauthorized access' })
    }
    let found;
    try {
        const user = await User.findOne({ where: { email: email } })

        if (user != null) {
            bcrypt.compare(password, user.password, async (err, result) => {
                // console.log(err)
                if (result == true) {

                    // user.addGroup
                    const u = await user.getGroups({ where: { uuid: uid } })
                    // console.log(u,'i am here for u')
                    // const u=await Group.findOne({where:{[Sequelize.Op.and]:{uuid:uid,userId:user.id}}})
                    if (u != null && u.length > 0) {
                        const token = jwt.sign(user.id, process.env.jwt_key)
                        res.json({ message: 'already in the group', success: true, token: token })
                    } else {
                        await grp.addUser(user)
                        const token = jwt.sign(user.id, process.env.jwt_key)
                        res.json({ message: 'joined the group', success: true, token: token })
                    }

                } else {
                    res.json({ message: 'Password is wrong', success: false, msg: 'try' });
                }
            })
        } else {
            res.json({ message: 'user does not exist', success: false })
        }

    } catch (err) {
        console.log(err)
        res.status(404).json({ message: 'user does not exist' })
    }


}

exports.allAdminNotAdmin = async (req, res, next) => {

    try {
        const gid = req.params.gid;



        const users = await User.findAll({
            include: [{
                model: Group,
                where: { id: gid },
            }]
        })

        const useri = req.iduse
        // console.log('useri ',useri)
        const proUsers = await Promise.all(users.map(async (user) => {
            if (user.id == useri) {
                user.name = 'You'
                // console.log(user)
            }
            const us = await user.getAdmins({ where: { groupId: gid } });
            if (us.length > 0) {
                user.dataValues.admin = 'admin';
            } else {
                user.dataValues.admin = '';
            }
            return user;
        }));
        // const alluser=await users.map(async user=>{
        //     const isadmin=(user.Admin!=null)
        //     // console.log(user.getAdmins())
        //     const us=await user.getAdmins({where:{groupId:gid}})
        //     if(us.length>0){
        //         user.dataValues.admin='admin'
        //     }else{
        //         user.dataValues.admin=''
        //     }
        //     // user.dataValues.admin=isadmin? 'admin':'';
        //     return user

        // })
        res.json(proUsers)

        // res.json(alluser)
        // }).catch(err=>{
        //     console.log(err)
        // })
    } catch (err) {
        console.log(err)
    }

}

exports.removeUserFromGroup = async (req, res, next) => {
    const removerid = req.iduse;
    const t = await sequelize.transaction()

    const grid = req.body.gid;

    const client = req.body.uid;

    const isadm = await Admin.findOne({ where: { groupId: grid, userId: removerid } })
    if (isadm.isadmin) {
        try {
            const adm = await Admin.findOne({ where: { groupId: grid, userId: client } })

            const user = await User.findOne({ where: { id: client } })
            // console.log('usering ',user)
            if (adm) {
                // await user.removeAdmins({where:{groupId:grid},transaction:t})
                await adm.destroy({ where: { groupId: grid }, transaction: t })
            }
            // const gu=await user.getGroups({where:{id:grid}})
            // console.log('group ',gu )
            if (user) {
                await user.removeGroup(grid, { transaction: t })

                // console.log('321 line')
                await t.commit()
                // console.log('323 line')
                res.json({ message: 'removed from admin and group ', success: true })
            }

        } catch (err) {
            await t.rollback();
            console.log(err)
            res.status(500).json({ message: 'something went wrong' })
        }

    } else {
        res.status(404).json({ message: 'remover is not admin or user does not exist', success: false })
    }
}


exports.removeUserFromAdmin = async (req, res, next) => {
    const removerid = req.iduse;
    // const t=await sequelize.transaction()

    const grid = req.body.gid;

    const client = req.body.uid;

    // console.log('345 line')
    const isadm = await Admin.findOne({ where: { groupId: grid, userId: removerid } })
    if (isadm.isadmin) {
        try {
            // const adm=await Admin.findOne({where:{groupId:grid,userId:client}})

            // console.log('352 line')
            // const user=await User.findOne({where:{id:client}})
            // if(user.Admin){
            // await user.removeAdmins(grid)
            await Admin.destroy({ where: { userId: client, groupId: grid } })

            // console.log('356 line')
            res.json({ message: 'removed from admin', success: true })
            // }else{
            //     res.json({message:'already not an admin',success:true})
            // }


        } catch (err) {

            res.status(500).json({ message: 'somethingwent wrong' })
        }

    } else {
        res.status(404).json({ message: 'remover is not admin or user does not exist', success: false })
    }
}

exports.makeUserAdmin = async (req, res, next) => {
    const removerid = req.iduse;

    const grid = req.body.gid;

    const client = req.body.uid;

    const isadm = await Admin.findOne({ where: { groupId: grid, userId: removerid } })
    if (isadm.isadmin) {
        try {

            const user = await User.findOne({ where: { id: client } })


            await user.createAdmin({ isadmin: true, userId: user.id, groupId: grid })

            res.json({ message: 'removed from group', success: true })
        } catch (err) {
            res.status(500).json({ message: 'somethingwent wrong' })
        }

    } else {
        res.status(404).json({ message: 'remover is not admin or user does not exist', success: false })
    }
}

exports.getAllNotUser = async (req, res, next) => {

    const gid = req.params.gid;
    try {
        const group = await Group.findByPk(gid)

        if (group) {
            // const users=await User.findAll({
            //     include:{
            //         model:Group,

            //     },
            //     where:{id:{[Sequelize.Op.not]:gid}},
            //     required:false,
            // })
            // console.log(users)
            // res.json(users)


            // const users = await User.findAll();
            // const obj=[]
            // const usersNotInGroup=await Promise.all(users.filter(async use=>{
            //     const ok=await use.getGroups(gid)
            //     // console.log(use.dataValues)
            //     // const useri=use.dataValues.id;
            //     if(ok.length==0 || ok){
            //         // console.log(ok)
            //         // obj.push(use)
            //         return use;
            //     }else{

            //         return null;

            //     }
            // }))

            // const users = await User.findAll();
            // const usersNotInGroup = await Promise.all(users.filter(async (user) => {
            //     const groups = await user.getGroups();
            //     if (groups.length === 0) {
            //         return user;
            //     } else {
            //         return null;
            //     }
            // }));

            const usersNotInGroup=await User.findAll({
                include:{
                  model:Group,
                  where:{id:gid },
                  required:false, 
                },
                where:{
                  '$Groups.id$':null, 
                },
              });

            //   console.log(usersNotInGroup)
              res.json(usersNotInGroup);
        } else {
            res.status(404).json({ message: 'group does not exist' })
        }
    } catch (err) {
        console.log(err)
    }
}

exports.directAdd=async (req,res,next)=>{
    try{
        const grid=req.params.gid;
        const uid=req.body.id
        // console.log(req.body)
        const user=await User.findByPk(uid);
        const group=await Group.findByPk(grid)
    
        const added=await user.addGroup(group)
    
        res.json({message:'user added',success:true})
    }catch(err){
        console.log(err)
    }
    
}