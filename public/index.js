
const url='http://127.0.0.1:3000'



function checking(event){
    
    event.preventDefault()
    const name=document.getElementById('username').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const phone=document.getElementById('phone').value;

    if(phone.length!=10){
        alert('please enter 10 digit of phone number')
        // document.getElementById('form').reset()
        return false;
    }
    else{
        const obj={name,email,phone,password};
        // name.value=''
        //     email.value='';password.value='';
        console.log('i am ')
        const purl=url+'/user/signup'
        console.log(purl)
        axios.post(`http://127.0.0.1:3000/user/signup`,obj)
            .then((res)=>{
                if(res.data.msg==='ok'){
                    alert('user created,now you can login')
                    document.getElementById('form').reset()
               
                    return true;

                }else{
                    alert('user already exists')
                    return false;
                }
                
                
            }).catch(err=>{
                alert('something went wrong');
                console.log(err)
                return false;
            })

    }
    

}