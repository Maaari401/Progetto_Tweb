import {FC, useState} from "react";
import './Login.css'
import Login from "./Login.tsx";
import SingUp from "./Sing-up.tsx";


interface logI {
    logged: boolean;
    setLogged: (value: boolean) => void;
}

const Form: FC<logI> = ({logged,setLogged}) => {

    const [page, setPage] = useState("login")

    return (

        <div className="form-container">
            <h1>FakerBoxD</h1>
            {page === "login" ? (
                    <Login logged={logged} setLogged={setLogged} setPage={setPage}/>
                ) : (
                    <SingUp setPage={setPage}/>
                )}
        </div>
    )
}
export default Form;