import {FC, useState} from "react";
import * as sha256 from "js-sha256";
import './Login.css'

interface loginI {
    operation: string;
    token: string;
    success: boolean;
    auth: boolean;
    errorMessage: string;
}

interface logI {
    logged: boolean,
    setLogged: (value: boolean) => void,
    setPage: (value: string) => void
}

const Login: FC<logI> = (props) => {
    const [usr, setUsr] = useState("");
    const [pwd, setPwd] = useState("");

    return (
        <div className="login-container">
            <form>
                <input className="username" type="text" placeholder="Username" onChange={(e) => setPwd(e.target.value)}
                       required/>
                <br/>
                <input className="password" type="password" placeholder="Password"
                       onChange={(e) => setUsr(e.target.value)} required/>
                <br/>
                <div className="login-buttons-container">
                    <button className="login-button" onClick={(e) => {
                        e.preventDefault();
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
                            .then((data: loginI) => {
                                if(data.success) {
                                    sessionStorage.setItem("token", data.token)
                                    sessionStorage.setItem("role", String(data.auth))
                                    props.setLogged(true)
                                }else{
                                    props.setLogged(false)
                                    const successMessage = document.getElementById('return-status');
                                    if (successMessage) {
                                        successMessage.innerText = `${data.errorMessage}`;
                                    }
                                }
                            });

                    }}>Login
                    </button>

                </div>
            </form>
            <p style={{color: 'red'}} id='return-status'></p>
            <p>Not yet registered?</p>
            <button className="login-button" onClick={() => {
                props.setPage("singup")
            }}>Sign Up
            </button>
        </div>
    )
}
export default Login;