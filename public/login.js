const url='http://127.0.0.1:3000'

function check(event){
    event.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const obj={email,password};
    console.log(email)

    const gurl=url+'/user/login';
    // alert('i am js')
    axios.post(gurl,obj)
        .then(res=>{
            localStorage.setItem('token',res.data.token);
            alert(res.data.message)
            
        }).catch(err=>{
            console.log(err)
            alert('something went wrong')
        })
    
}