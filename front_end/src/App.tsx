import Login from "./login/Login.tsx";
import {Films} from "./film/FilmList.tsx"
import {useState} from "react";

function App(){
    const [logged, setLogged] = useState(false)
    return (
        <>
            <Login logged={logged} setLogged={setLogged}/>
            {(logged && <Films/>)}
        </>
    )
}

export default App