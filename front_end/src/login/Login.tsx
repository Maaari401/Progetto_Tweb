import {FC, useState} from "react";
import * as sha256 from "js-sha256";
import './Login.css'

interface loginI {
    operation: string;
    token: string;
    success: boolean;
    error: boolean;
    errorMessage: string;
}

interface logI {
    logged: boolean;
    setLogged: (value: boolean) => void;
}

const Login: FC<logI> = ({logged,setLogged}) => {
    const [usr, setUsr] = useState("");
    const [pwd, setPwd] = useState("");

    return (
        <div className="login-container">
            <form>
                <input className="username" type="text" placeholder="Username" onChange={(e) => setPwd(e.target.value)} required/>
                <br/>
                <input className="password" type="password" placeholder="Password" onChange={(e) => setUsr(e.target.value)} required/>
                <br/>
                <div className="login-buttons-container">
                    {!logged ? (<button className="login-button" onClick={(e) => {
                        e.preventDefault();
                        //console.log("login for: "+usr+" "+pwd);
                        const password: string = sha256.sha256(pwd);
                        fetch("http://localhost:8080/Progetto_Tweb/login", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "username": usr,
                                "password": password
                            }),
                        })
                            .then((value) => value.json())
                            .then((data: loginI)=> {
                                setLogged(true)
                                //console.log(data)
                                sessionStorage.setItem("token", data.token)
                            });

                    }}>Login</button>) : (<button className="login-button" onClick={e => {
                        e.preventDefault();
                        fetch("http://localhost:8080/Progetto_Tweb_war/logout",{
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'token': 'tok $'+sessionStorage.getItem('token')
                            }}
                    )
                        .then(value => value.json())
                        .then(()=> {
                            setLogged(false);
                            sessionStorage.removeItem("token");
                        })
                    }}>Logout</button>)}
                    <button className="signup-button">Sign up</button>
                </div>
            </form>
        </div>
    )
}
export default Login;