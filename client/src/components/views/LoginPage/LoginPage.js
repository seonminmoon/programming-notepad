import { Axios } from 'axios'
import React, { useState } from 'react'

function LoginPage() {

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault(); // 이걸 하는 이유: 안쓰면 매번 page refresh가 됨. 이걸 막기 위함

        let body = { 
            email: Email, // test1@nver.com
            password: Password // 12345
        }
        console.log(body);

        //TypeError: axios__WEBPACK_IMPORTED_MODULE_0__.Axios.post is not a function 오류 발생
        Axios.post('/login', body).then((res)=> {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}}>



            <form style={{display: 'flex', flexDirection:'column'}} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}/>
                
                <button>
                    Login
                </button>
            </form>




        </div>
    )
}

export default LoginPage