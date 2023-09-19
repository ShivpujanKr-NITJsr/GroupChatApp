
const url='http://127.0.0.1:3000'

const socket=io(url)



        // document.getElementById("openModalButton").addEventListener("click", function() {
        //     // Open the modal by navigating to the modal.html file
        //     window.location.href = "modal.html";
        // });
const closeButton = document.querySelector('.close-button');
const modal = document.querySelector('.modal');
closeButton.addEventListener('click', function () {
    modal.style.display = 'none';
    document.body.style.overflow = "auto"
});
document.getElementById('uploading').addEventListener('click',(e)=>{
    const fileForUpload=document.getElementById('storefile').files[0];
    // e.stopPropagation()
    // console.log(fileForUpload)
    if(!fileForUpload) {
        alert('no file choosen')
        return;
    }
    if(fileForUpload.size>'4000000'){
        alert('only size upto 3MB can be sent')
        return;
    }else{
        modal.style.display = 'none';
        document.body.style.overflow = "auto"
        const formdata=new FormData();
        formdata.append('file',fileForUpload);
        const token=localStorage.getItem('token');
        const grid=JSON.parse(localStorage.getItem('currentG')).id
        // formdata.append('token',token)
        formdata.append('grid',grid)
        // for(let key of formdata.entries()){
        //     console.log(key[0],key[1])
        // }
        axios.post(`/user/filesharing/${token}`,formdata,
            {headers: {
                'Content-Type': 'multipart/form-data', // Important to set the correct content type
                
            }})
            .then(result=>{
                // alert('file uploaded')
                
                socket.emit('usermessaged')
            }).catch(err=>{
                alert('something went wrong/ features disabled')
            })
    }
    // console.log(fileForUpload)
})
document.getElementById('selectfile').addEventListener('click',(e)=>{
    // window.location.href = "uploadfile.html";
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    

    // e.preventDefault()
    // console.log(e.target.files[0])

    // const div=document.createElement('div');
    // div.className='modal-body'
    // div.innerHTML=`<h5>Popover in a modal</h5>
    // <p>This <a href="#" role="button" class="btn btn-secondary popover-test" title="Popover title" data-content="Popover body content is set in this attribute.">button</a> triggers a popover on click.</p>
    // <hr>
    // <h5>Tooltips in a modal</h5>
    // <p><a href="#" class="tooltip-test" title="Tooltip">This link</a> and <a href="#" class="tooltip-test" title="Tooltip">that link</a> have tooltips on hover.</p>`
    // document.body.appendChild(div)
})

document.getElementById('bt').addEventListener('click',(event)=>{
    const chatmsg=document.getElementById('chats').value.trim()
    let grid;
    if(chatmsg==''){
        // alert('blank there is nothing to sent')
        document.getElementById('chats').focus()
        
        return;
    }
    if(!localStorage.getItem('currentG')){
        alert('join or open any group you want to chat')
        return;
    }
    grid=JSON.parse(localStorage.getItem('currentG')).id
    console.log(grid)
    let purl=url+`/user/personalmessage/${grid}`
    const obj={
        chatmsg,
        token:localStorage.getItem('token')
    }
    axios.post(purl,obj)
        .then(res=>{
            // console.log(res);
            // if(res.data.success==true){
            //     // alert(res.data.message)
            //     console.log('successfully saved in db')
            // }else{
            //     // alert(res.data.message)
            //     console.log('not saved in db')
            // }

            document.getElementById('chats').value=''
            // getAllWithLs();
            socket.emit('usermessaged')
            // getAllChats(JSON.parse(localStorage.getItem('currentG')))
        }).catch(err=>{
            alert('long text,not supported./internal server error')
            console.log('error',err)
        })
})

document.getElementById('creategroup').addEventListener('click',()=>{
    const purl=url+'/user/creategroup';
    const idg=document.getElementById('groupinput')
    // const divin=document.getElementById('groupinputs')
    idg.style.display='block'
    idg.focus();
    document.getElementById('creating').style.display='block'
    document.getElementById('creategroup').style.display='none'
    document.getElementById('creating').addEventListener('click',(e)=>{
        const groupname=idg.value.trim();
        idg.value=''
        if(groupname!=null && groupname.length>0){
            axios.post(purl,{groupname:groupname,token:localStorage.getItem('token')})
                .then(res=>{
                    alert('group created');
                    getAllGroup()
                }).catch(err=>{
                    console.log(err)
                })
        }else{
            alert('please enter group name')
        }
        idg.style.display='none';
        document.getElementById('creating').style.display='none'
        document.getElementById('creategroup').style.display='block'
    })

    
})

// let foundCurrent=false;
const getAllGroup=()=>{
    const purl=url+'/user/getallgroup/getallchat/5';

    let found=false;
    axios.post(purl,{token:localStorage.getItem('token'),getAllG:true})
        .then(res=>{
            
            const parent=document.getElementById('groupname')
            parent.innerHTML=''
            for(let i=0;i<res.data.length;i++){
                const child=document.createElement('div');
                child.style='border:2px solid red;'
                child.textContent=res.data[i].name;
                if(JSON.stringify(res.data[i])===localStorage.getItem('currentG')){
                    found=true;

                }
                child.addEventListener('click',()=>{
                    localStorage.setItem('currentG',JSON.stringify(res.data[i]))
                    getAllChats(res.data[i])
                })
                parent.appendChild(child)
            }

            if(!found){
                const named=JSON.parse(localStorage.getItem('currentG'))
                if(named){
                    
                    alert('Admin removed you from the group '+named.name)

                }
                
                // 
                localStorage.removeItem('currentG');
                document.getElementById('ro').innerHTML='';
                document.getElementById('chatting').innerHTML=''
            }
            
        }).catch(err=>console.log(err))
}

let maiadmincheck;

let AddModals;
function AddUserInTheGroup(e,group){
    
    if(AddModals){
        closed()
    }
    const purl=url+`/user/allnotuser/${group.id}`

    const obj={
        token:localStorage.getItem('token')
    }
    axios.post(purl,obj)
        .then(notuser=>{
            createAddModals(e,group,notuser.data)

            AddModals.style.display='block'
            e.stopPropagation()
        }).catch(err=>{
            console.log(err)
            alert('something went wrong '+'')
            alert('superadmin disabled this features for user security, still you can share link')
        })
    
}

function addUserIn(group,userobj){
    
    const purl=url+`/user/group/${group.id}`
    axios.post(purl,userobj)
        .then(result=>{
            socket.emit('superadminadded')
            getAllAdmin(group)
            alert(`${userobj.name} is added to ${group.name}`)
            
            
        }).catch(err=>{
            console.log(err)
            
        })
}

function createAddModals(e,group,notuser){
    AddModals=document.createElement('div')
    AddModals.style.width='190px';
    // AddModals.style.display='flex';
    // AddModals.style.flexDirection='row'
    AddModals.style.position='fixed'
    AddModals.style.left=(e.target.getBoundingClientRect().left-100)+'px'
    AddModals.style.top=e.target.getBoundingClientRect().bottom+'px'
    AddModals.style.zIndex='1'
    const input=document.createElement('input');
    input.name='useremail'
    input.id='987email'
    input.style.width='190px'
    input.placeholder='enter email to add in group'
    const dive=document.createElement('div');
    dive.style.display='flex'
    dive.style.flexDirection='column'
    AddModals.appendChild(dive)
    input.addEventListener('input',(eve)=>{
        AddModals.removeChild(dive)
        dive.innerHTML=''
        const emailhalf=document.getElementById('987email').value
        const emaillist=notuser.filter((obj)=>{
            // console.log(obj.email+' emah '+emailhalf)
            return obj.email.includes(emailhalf)
        });
        
      
        // console.log(emaillist)
        for(let i=0;i<emaillist.length;i++){
            const ue=document.createElement('p')
            const uem=emaillist[i].email
            // console.log('uem ',uem)
            ue.style.color='red'
            ue.classList.add('custom-cursor')
            ue.textContent=`${uem}`
            ue.addEventListener('click',()=>{
                addUserIn(group,emaillist[i])
            })
            dive.appendChild(ue)
        }
        AddModals.appendChild(dive);
        // console.log('change')
    })
    AddModals.appendChild(input)
    document.body.appendChild(AddModals)

    document.addEventListener('click',closingAddModals)
}

function closingAddModals(eve){
    // console.log(eve.target.name=='useremail')

    if(eve.target.name!=='useremail'){
        if(AddModals){
            document.body.removeChild(AddModals);
            AddModals=null; 
            document.removeEventListener('click',closingAddModals);
        }
    }
}
function closed(){
    if(AddModals){
        document.body.removeChild(AddModals);
        AddModals=null; 
        document.removeEventListener('click',closingAddModals);
    }
}

const getAllAdmin=(group)=>{
    
    const head=document.getElementById('adminhead');
    head.innerHTML=`<div style="height: 45px; background-color: rgb(255, 225, 127);overflow: auto;width:140px;" id="adminheader"></div> <button id="adduser" style='width:55px;'>Add</button>`

    const adminheader=document.getElementById('adminheader');
    adminheader.style.color='blue'
    adminheader.style.textAlign='center'
    adminheader.innerHTML=`<b>User of Group</b>`

    
    const adduser=document.getElementById('adduser');
    
    if(!group){
        head.innerHTML=''
        adminheader.innerHTML=''
        document.getElementById('listuser').innerHTML=''
        return ;
    }
    

    const purl=url+`/user/group/alluser/${group.id}`;

    const objectt={
        token:localStorage.getItem('token')
    }
    axios.post(purl,objectt)
        .then(result=>{
            const listuser=document.getElementById('listuser');
            listuser.innerHTML=''
            let adminUser;
            for(let i=0;i<result.data.length;i++){
                const child=document.createElement('p')
                child.textAlign='center'
                child.textContent=result.data[i].name+': '+result.data[i].admin;
                if(result.data[i].name=='You'){
                    maiadmincheck=result.data[i];
                    adminUser=result.data[i]
                }
                child.classList.add('custom-cursor')
                child.addEventListener('click',(e)=>{adminFunction(result.data[i],e)})
               

                listuser.appendChild(child)
            }
            adduser.addEventListener('click',(e)=>{
                if(adminUser.admin=='admin'){
                    AddUserInTheGroup(e,group)
                }else{
                    alert('you are not admin')
                }
                
            })
        }).catch(err=>{
            console.log(err)
        })
    
        

}
let modals;
function adminFunction(user,e){
    // console.log(e)
    if(user.name=='You'){
        return;
    }
    if(modals){
        closeModal()
    }
    createModals(user,e)

    modals.style.display = 'block';

    e.stopPropagation();
    // console.log(' i am in admin function')
    
    
    // div.innerHTML=`<span style='position:top'>&times</span>`

    
//     const token=localStorage.getItem('token')
//    const purl=url+`/user/group/${user.groups[0].id}`
//    const obj={
//     token:token
//    }

//    axios.post(purl,obj)
//     .then(res=>{

//     }).catch(err=>{
//         console.log(err)
//     })
}

function createModals(user,e){
    modals=document.createElement('div');


    modals.style.width='200px'
    modals.style.height='30px'
    modals.style.position='fixed'
    modals.style.zIndex='1';

    modals.style.left=e.target.getBoundingClientRect().left+'px'
    modals.style.top=e.target.getBoundingClientRect().bottom+'px'
    const main=document.createElement('button')
    main.style.width='200px'
    main.style.borderRadius='10px';
    main.style.backgroundColor='red'
    main.style.color='white';
    main.textContent=user.name;

    const contentdiv=document.createElement('div')
    contentdiv.style.backgroundColor='gray'
    contentdiv.style.borderRadius='5px'
    contentdiv.style.paddingLeft='5px'
    // contentdiv.classList.add('modal-content')
    const remove=document.createElement('p')
    remove.textContent='Remove from group'
    remove.style.margin='0px'
    remove.classList.add('custom-cursor')

    remove.addEventListener('click',(even)=>{
        functionalityRMRA(even,user,1)
        // socket.emit('userremovedfromgroup')
    })
    const makeAdmin=document.createElement('p')
    makeAdmin.textContent='make Admin'
    makeAdmin.style.margin='0px'
    makeAdmin.classList.add('custom-cursor')
    makeAdmin.addEventListener('click',(even)=>{
        functionalityRMRA(even,user,2)
        // socket.emit('madeadmin');
    })
    const removeAdmin=document.createElement('p')
    removeAdmin.textContent='Remove From Admin'
    removeAdmin.style.margin='0px'
    removeAdmin.classList.add('custom-cursor')
    removeAdmin.addEventListener('click',(even)=>{
        functionalityRMRA(even,user,3)
        // socket.emit('removedfromadmin')
    })
    contentdiv.appendChild(remove)
    contentdiv.appendChild(makeAdmin)
    contentdiv.appendChild(removeAdmin)
    modals.appendChild(main)
    modals.appendChild(contentdiv)

    document.body.appendChild(modals)

    document.addEventListener('click', closeModal);
}
function closeModal(){
    if(modals) {
    document.body.removeChild(modals);
    modals=null; 
    document.removeEventListener('click',closeModal);
    }
}

function functionalityRMRA(event,user,command){
    // console.log(user)
    if(maiadmincheck.admin==''){
        alert('you are not admin')
        return;
    }else{

        const obj={
            uid:user.id,gid:user.groups[0].id,token:localStorage.getItem('token')
        }

        if(command==1){
            // console.log(user.groups[0].id)
            removeUser(obj)
        }else if(command==2){
            if(user.admin=='admin'){
                alert('already admin')
            }else{
                makeAdminUser(obj)
            }
            
            // console.log(user.groups[0].id)
        }else if(command==3){
            // console.log(user.groups[0].id)
            removeFromAdminUser(obj)
        }
        
    }
    
}
function removeUser(obj){
    const purl=url+`/user/group/makeadmin/${obj.gid}`
    obj.removeuser=true
    axios.post(purl,obj)
        .then(res=>{
            socket.emit('userremovedfromgroup')
            alert('user removed from group')

            // getAllAdmin(JSON.parse(localStorage.getItem('currentG')));
        }).catch(err=>{
            console.log(err)
        })

}
function makeAdminUser(obj){
    obj.makead=true;
    const purl=url+`/user/group/makeadmin/${obj.gid}`
    axios.post(purl,obj)
        .then(res=>{
            socket.emit('madeadmin');
            // getAllAdmin(JSON.parse(localStorage.getItem('currentG')));
        }).catch(err=>{
            console.log(err)
        })
}
function removeFromAdminUser(obj){
    obj.makead=false;
    const purl=url+`/user/group/makeadmin/${obj.gid}`
    axios.post(purl,obj)
        .then(res=>{
            socket.emit('removedfromadmin')
            // getAllAdmin(JSON.parse(localStorage.getItem('currentG')));
        }).catch(err=>{
            console.log(err)
        })
}





const getAllChats=(group)=>{
    getAllAdmin(group)
    const head=document.getElementById('ro');
    head.innerHTML=`<div style="height: 45px; background-color: rgb(255, 225, 127);overflow: auto;width:540px;" id="chattinghead"></div> <button id="sharelink" style='width:52px'>share</button>`
    const chathead=document.getElementById('chattinghead');
    chathead.style.color='blue'
    chathead.style.textAlign='center'
    chathead.innerHTML=`<h3>${group.name}</h3>`;

    if(!group){
        head.innerHTML=''
        chathead.innerHTML=''
        return;
    }
    const share=document.getElementById('sharelink');
    share.addEventListener('click',async ()=>{
        const uuid=group.uuid;
        const purl=url+`/user/group/share/${uuid}`;
        if (navigator.share) { 
            navigator.share({
                title:"Group link",
                text:"join my group via this link!",
                url: purl
            })
            .then( ()=>{
                console.log("Link shared successfully");
            })
            .catch((error)=>{
                console.error("Error sharing link:", error);
            });
        }else{
            // alert("Web Share API is not supported in this browser.");

            // try{
            //     await navigator.clipboard.writeText(purl);
            //     alert('Link copied');
            // }catch(erro){
            //     console.log(erro)
            //     chats.value=purl;
            //     alert('Failed to copy link.link is in chatting input,please manually copy that');
            // }
            const tempInput=document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value=purl;
            tempInput.select();

            try {
                document.execCommand('copy');
                alert('Link copied');
            }catch(err) {
                document.getElementById('chats').value=purl;
                alert('Failed to copy link. Please select the link and press Ctrl+C (Cmd+C on Mac) to copy it manually.,link is in chat input');

            } finally{
                document.body.removeChild(tempInput);
            }
        }
    })
    const purl=url+`/user/getallgroup/getallchat/${group.id}`
    const objname={
        token:localStorage.getItem('token'),
        getAllG:false
    }
    axios.post(purl,objname)
        .then(res=>{
            // console.log(res.data.user)
            // socket.emit('add user',{
            //     user:res.data.user,
            //     groupid:group.id
            // })

            
            show(res.data)
            // socket.on('user joined',(data)=>{
            //     console.log(data)
            //     const p=document.createElement('p');
            //     // console.log(data[i].user.name, 'You')
            //     const dip=document.createElement('div')
            //     // dip.style.width='592px'
            //     p.style.margin='5px'
                
                
            //     p.classList.add('lefttext')
            //     p.style.color='black'
            //     p.textContent=`new user joined`;
                
            //     // dip.appendChild(p)
            //     document.getElementById('chatting').appendChild(p)
            // })

        }).catch(err=>{
            console.log(err)
        })
}

function show(data){

    // console.log('i am in data show')
    if(data.length>100){
        // let d=[];
        // for(let i=data.length-10;i<data.length;i++){
        //     d.push(data[i]);
        // }
        // data=d;
        data=data.slice(-100)
    }
    const parent=document.getElementById('chatting');
    parent.innerHTML=''
    parent.style.padding='5px'
    // let chan=true;
    for(let i=0;i<data.length;i++){
        const dip=document.createElement('div')
        if(data[i].type){
            let img;
            if(data[i].type==='image'){
                img=document.createElement('img');
                img.style.width='80%';
                img.style.height='auto';
                img.src=data[i].msg;
                img.alt='image'
                img.style.marginBottom='15px'
            }else if(data[i].type==='video'){
                img=document.createElement('video');
                img.style.width='80%';
                img.style.height='auto';
                img.src=data[i].msg;
                img.controls=true;img.style.marginBottom='15px'

            }else{
                img=document.createElement('a')
                img.href=data[i].msg;
                img.textContent=data[i].msg;
                img.style.width='80%';img.style.marginBottom='15px'
                img.style.wordWrap='break-word'
            }
            
            // console.log(data[i])



            dip.appendChild(img)
            parent.appendChild(dip)
            parent.scrollTop=parent.scrollHeight

        }else{
            const p=document.createElement('p');
            // console.log(data[i].user.name, 'You')
            
            // dip.style.width='592px'
            p.style.margin='5px'
            
            if(data[i].user.name.trim()==='You'){

                p.classList.add('righttext')
                p.style.color='black'
                p.innerHTML=`${data[i].msg} : <b>${data[i].user.name}</b>`;
            //    if(i>0){
            //         if(data[i].user.name.trim()==='You' &&
            //         data[i-1].user.name.trim()==='You'){
            //             const br=document.createElement('br')
            //             parent.appendChild(br)
            //         }
            //    }

            }else{
                p.classList.add('lefttext')
                p.style.color='black'
                p.innerHTML=`<b>${data[i].user.name}</b> : ${data[i].msg}`;
                // if(i>0){
                //     if(data[i].user.name.trim()===data[i-1].user.name.trim()){
                //         const br=document.createElement('br')
                //         parent.appendChild(br)
                //     }
                // }
            }
            // dip.style.paddingBottom='5px'
            dip.appendChild(p)
            parent.appendChild(dip)
            parent.scrollTop=parent.scrollHeight

        }
        
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    // getAllWithLs()
    if(!localStorage.getItem('token')){
        alert('something went wrong please login again')
        window.location.href='./login.html'
        return
    }
    getAllGroup()
    // console.log(localStorage.getItem('currentG'))
    if(localStorage.getItem('currentG')){
        getAllChats(JSON.parse(localStorage.getItem('currentG')))
    }
}
);

// const sock = io('http://127.0.0.1:3000');

// Add an event listener for the "new message" event


socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    getAllGroup()
    if(localStorage.getItem('currentG')){
        getAllChats(JSON.parse(localStorage.getItem('currentG')))
    }
});
    // Handle user joining the group

// socket.on('connect', () => {

//     socket.emit('userjoined');
// });
socket.on('userjoined',()=>{
    // alert('new user joined in')
    console.log('userjoined')
    if(localStorage.getItem('currentG')){
        const gr=JSON.parse(localStorage.getItem('currentG'))
        getAllAdmin(gr)
        
    }
})
socket.on('userremovedfromgroup',async ()=>{
    getAllGroup()
    
    setTimeout(()=>{
        if(localStorage.getItem('currentG')){
            getAllChats(JSON.parse(localStorage.getItem('currentG')))
            // getAllAdmin(JSON.parse(localStorage.getItem('currentG')));
        } 

        else{
            getAllChats('')
            // getAllAdmin('')
        }
    },2000)
    
    
})
socket.on('madeadmin',()=>{
    if(localStorage.getItem('currentG')){

        getAllAdmin(JSON.parse(localStorage.getItem('currentG')))
    }
})
socket.on('removedfromadmin',()=>{
    if(localStorage.getItem('currentG')){

        getAllAdmin(JSON.parse(localStorage.getItem('currentG')))
    }
})
socket.on('usermessaged',()=>{
    if(localStorage.getItem('currentG')){
        getAllChats(JSON.parse(localStorage.getItem('currentG')))
    }
})

socket.on('superadminadded',()=>{
    // const pr=new Promise((res,rej)=>{
    //     getAllGroup();
    //     res('ok')
    // })
    // pr.then()
    getAllGroup()
    if(localStorage.getItem('currentG')){
        getAllAdmin(JSON.parse(localStorage.getItem('currentG')))
    }
    
})
// socket.on('groupcreated',()=>{
//     getAllGroup()
//     // if(localStorage.getItem('currentG')){
//     //     getAllChats(JSON.parse(localStorage.getItem('currentG')))
//     // }
// })
    // ... Handle other events like user messages in the group ...
 
// setInterval( ()=>{
//     getAllGroup()
//     if(localStorage.getItem('currentG')){
//         getAllChats(JSON.parse(localStorage.getItem('currentG')))
//     }
// },1000)


// window.addEventListener('beforeunload', function (event) {
//     localStorage.clear();
// });

// const getAllWithLs=()=>{
//     let chats=JSON.parse(localStorage.getItem('chatmsg'))

    
//     if(chats){
//         const lid=chats[chats.length-1].id;

//         const purl=url+`/user/allchat/${lid}`
//         axios.get(purl)
//             .then(res=>{
//                 chats=chats.concat(res.data)
//                 localStorage.setItem('chatmsg',JSON.stringify(chats))
//                 show(chats)
//             }).catch(err=>{
//                 console.log(err)
//             })
//     }else{
//         const purl=url+`/user/allchat/0`
//         axios.get(purl)
//             .then(res=>{
//                 chats=res.data
//                 localStorage.setItem('chatmsg',JSON.stringify(chats))
//                 show(chats)
//             }).catch(err=>{
//                 console.log(err)
//             })
//     }
// }
