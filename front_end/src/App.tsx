import Login from "./login/Login.tsx";
import {Films} from "./film/Film.tsx"
import {useState} from "react";


function App(){
    const [username, setUsername] = useState("")
    return (
        <>
            <Login setUsername={setUsername}/>
            <Films username={{username}}/>
        </>
    )
}

export default App