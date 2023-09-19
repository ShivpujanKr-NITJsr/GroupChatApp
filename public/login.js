const url='http://127.0.0.1:3000'

function check(event){
    event.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;

    const obj={email,password,signup:false};
    console.log(email)

    const gurl=url+'/user/loginsignup';
    // alert('i am js')
    axios.post(gurl,obj)
        .then(res=>{
            localStorage.clear()
            localStorage.setItem('token',res.data.token);
            const form=document.getElementById('form');
            form.action='./frontchat.html'
            form.method='get'
            alert(res.data.message)
            form.submit()
            
            
        }).catch(err=>{
            console.log(err)
            alert(`something went wrong,${err.message}`)
        })
    
}