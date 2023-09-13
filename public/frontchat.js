
const url='http://127.0.0.1:3000'
document.getElementById('bt').addEventListener('click',(event)=>{
    const chatmsg=document.getElementById('chats').value
    if(chatmsg==''){
        alert('blank there is nothing to sent')
        return;
    }
    const purl=url+'/user/personalmessage'
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
            getAllWithLs();
        }).catch(err=>{
            console.log(err)
        })
})


const getAllWithLs=()=>{
    let chats=JSON.parse(localStorage.getItem('chatmsg'))

    
    if(chats){
        const lid=chats[chats.length-1].id;

        const purl=url+`/user/allchat/${lid}`
        axios.get(purl)
            .then(res=>{
                chats=chats.concat(res.data)
                localStorage.setItem('chatmsg',JSON.stringify(chats))
                show(chats)
            }).catch(err=>{
                console.log(err)
            })
    }else{
        const purl=url+`/user/allchat/0`
        axios.get(purl)
            .then(res=>{
                chats=res.data
                localStorage.setItem('chatmsg',JSON.stringify(chats))
                show(chats)
            }).catch(err=>{
                console.log(err)
            })
    }
}

function show(data){
    const parent=document.getElementById('chatting');
    parent.innerHTML=''
    for(let i=0;i<data.length;i++){
        const p=document.createElement('p');
        p.textContent=data[i].userId+' : '+data[i].msg;
        parent.appendChild(p)

    }
}

document.addEventListener('DOMContentLoaded',getAllWithLs);

setTimeInterval(()=>{
    getAllWithLs()
},1000)