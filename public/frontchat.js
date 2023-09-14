
const url='http://127.0.0.1:3000'
document.getElementById('bt').addEventListener('click',(event)=>{
    const chatmsg=document.getElementById('chats').value.trim()
    let grid;
    if(chatmsg==''){
        alert('blank there is nothing to sent')
        
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
            console.log(res);
            if(res.data.success==true){
                // alert(res.data.message)
                console.log('successfully saved in db')
            }else{
                // alert(res.data.message)
                console.log('not saved in db')
            }

            document.getElementById('chats').value=''
            // getAllWithLs();
            getAllChats(JSON.parse(localStorage.getItem('currentG')))
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

const getAllGroup=()=>{
    const purl=url+'/user/getallgroup';

    axios.post(purl,{token:localStorage.getItem('token')})
        .then(res=>{
            const parent=document.getElementById('groupname')
            parent.innerHTML=''
            for(let i=0;i<res.data.length;i++){
                const child=document.createElement('div');
                child.style='border:2px solid red;'
                child.textContent=res.data[i].name;

                child.addEventListener('click',()=>{
                    localStorage.setItem('currentG',JSON.stringify(res.data[i]))
                    getAllChats(res.data[i])
                })
                parent.appendChild(child)
            }
        })
}

const getAllChats=(group)=>{
    const head=document.getElementById('ro');
    head.innerHTML=`<div style="height: 45px; background-color: rgb(255, 225, 127);overflow: auto;width:540px;" id="chattinghead"></div> <button id="sharelink">share</button>`
    const chathead=document.getElementById('chattinghead');
    chathead.style.color='blue'
    chathead.style.textAlign='center'
    chathead.innerHTML=`<h3>${group.name}</h3>`;
    const share=document.getElementById('sharelink');
    share.addEventListener('click',()=>{
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
            alert("Web Share API is not supported in this browser.");
        }
    })
    const purl=url+`/user/group/allchat/${group.id}`
    axios.get(purl)
        .then(res=>{
            show(res.data)
        }).catch(err=>{
            console.log(err)
        })
}

function show(data){

    // console.log('i am in data show')
    if(data.length>10){
        let d=[];
        for(let i=data.length-10;i<data.length;i++){
            d.push(data[i]);
        }
        data=d;
    }
    const parent=document.getElementById('chatting');
    parent.innerHTML=''
    for(let i=0;i<data.length;i++){
        const p=document.createElement('p');
        p.textContent=data[i].userId+' : '+data[i].msg;
        parent.appendChild(p)

    }
}

document.addEventListener('DOMContentLoaded',()=>{
    // getAllWithLs()
    getAllGroup()
    // console.log(localStorage.getItem('currentG'))
    if(localStorage.getItem('currentG')){
        getAllChats(JSON.parse(localStorage.getItem('currentG')))
    }
}
);

setInterval(()=>{
    if(localStorage.getItem('currentG')){
        getAllChats(JSON.parse(localStorage.getItem('currentG')))
    }
},1000)


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

