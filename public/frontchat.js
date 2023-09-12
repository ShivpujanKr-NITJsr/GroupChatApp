
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
            getAllChat();
        }).catch(err=>{
            console.log(err)
        })
})



const getAllChat=()=>{

    const purl=url+'/user/allchat';
    
    axios.get(purl)
        .then(res=>{
            const parent=document.getElementById('chatting');
            parent.innerHTML=''
            for(let i=0;i<res.data.length;i++){
                const p=document.createElement('p');
                p.textContent=res.data[i].msg;
                parent.appendChild(p)

            }
        }).catch(err=>{
            console.log(err)
        })
}
document.addEventListener('DOMContentLoaded',getAllChat);