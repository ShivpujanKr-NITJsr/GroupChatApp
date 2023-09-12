
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
                alert(res.data.message)
            }else{
                alert(res.data.message)
            }

            document.getElementById('chats').value=''
        }).catch(err=>{
            console.log(err)
        })
})