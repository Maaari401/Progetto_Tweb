import {FC, useState} from "react";
import * as sha256 from "js-sha256";
interface loginI{
    operation: string,
    username: string,
    success: boolean,
    error: boolean,
    errorMessage:string
}

interface loginPropsI{
    setUsername: (username: string) => void
}
const Login: FC<loginPropsI> = ({setUsername}) => {
    const [pwd, setPwd] = useState("");
    const [usr, setUsr] = useState("");

    const [logged, setLogged] = useState(false);
    return (<form>
        <input className="username" type="text" onChange={e => setPwd(e.target.value)} required/>
        <input className="password" type="password" onChange={e => setUsername(e.target.value)} required/>
        {!logged ? (<button onClick={e => {
            e.preventDefault();
            console.log("login for: "+usr+" "+pwd);
            const password: string = sha256.sha256(pwd);
            const data = {setUsr, password};
            fetch("http://localhost:8080/Progetto_Tweb_war/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((value) => console.log(value.json()))
                .then(()=>setLogged(true))

        }}>Submit</button>) : (<button onClick={e => {
            e.preventDefault();
            fetch("http://localhost:8080/Progetto_Tweb_war/logout")
                .then(value => value.json())
                .then((json: loginI) => console.log(json))
                .then(()=>setLogged(false))
        }}>logout</button>)}</form>)
}
export default Login;