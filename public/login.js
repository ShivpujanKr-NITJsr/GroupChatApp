const url='http://127.0.0.1:3000'

function check(event){
    event.preventDefault();

    const email=event.target.name.email;
    const password=event.target.name.password;

    const obj={email,password};

    const gurl=url+'/user/login';
    // alert('i am js')
    axios.get(gurl,{Headers:obj})
        .then(res=>{
            console.log(res);

        }).catch(err=>{
            console.log(err)
        })
    
}