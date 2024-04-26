import {FC, useState} from "react";
import * as sha256 from "js-sha256";
import './Login.css'


interface SingUpProps {
    setPage: (value: string) => void
}

const SingUp: FC<SingUpProps> = ({setPage}: SingUpProps) => {
    const [usr, setUsr] = useState("");
    const [email, setEmail] = useState("");
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");



    return (
        <div className="login-container">
            <form>
                <input className="username" type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)}
                       required/>
                <br/>
                <input className="username" type="text" placeholder="Username" onChange={(e) => setUsr(e.target.value)}
                       required/>
                <br/>
                <input className="password" type="password" placeholder="Password"
                       onChange={(e) => setPwd1(e.target.value)} required/>
                <br/>
                <input className="password" type="password" placeholder="Repeat Password"
                       onChange={(e) => setPwd2(e.target.value)} required/>
                <br/>
                <div className="login-buttons-container">
                    <button className="signup-button" onClick={(e) => {
                        e.preventDefault();
                        if (pwd1 === pwd2) {
                            const password: string = sha256.sha256(pwd1);
                            fetch("http://localhost:8080/Progetto_Tweb/singup", {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    "email": email,
                                    "username": usr,
                                    "pwd": password
                                }),
                            })
                                .then((value) => value.json())
                                .then((data) => {
                                    console.log(data)
                                })
                                .catch((e) => {console.error(e)})
                        }else {
                            console.log("Error password dismatch")
                        }
                    }}>Sign up
                    </button>
                </div>
            </form>
            <p>Already registered?</p>
            <button className="login-button" onClick={() => {
                setPage("login")
            }}>Login
            </button>
        </div>
    )
}
export default SingUp;