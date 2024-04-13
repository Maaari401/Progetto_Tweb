import {FC, useState} from "react";
import * as sha256 from "js-sha256";
interface loginI{
    operation: string,
    token: string,
    success: boolean,
    error: boolean,
    errorMessage:string
}
interface logI{
    logged: boolean;
    setLogged: (value: boolean) => void;
}

const Login: FC<logI> = ({logged,setLogged}) => {
    const [pwd, setPwd] = useState("");
    const [usr, setUsr] = useState("");

    //const [logged, setLogged] = useState(false);
    return (<form>
        <input className="username" type="text" onChange={e => setPwd(e.target.value)} required/>
        <input className="password" type="password" onChange={e => setUsr(e.target.value)} required/>
        {!logged ? (<button onClick={e => {
            e.preventDefault();
            //console.log("login for: "+usr+" "+pwd);
            const password: string = sha256.sha256(pwd);
            fetch("http://localhost:8080/Progetto_Tweb_war/login", {
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
                })

        }}>Login</button>) : (<button onClick={e => {
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
        }}>Logout</button>)}</form>)
}
export default Login;