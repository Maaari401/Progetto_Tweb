import Form from "./login/Form.tsx";
import {Films} from "./film/FilmList.tsx"
import {useState} from "react";
import {TopBar} from "./TopBar/TopBar.tsx";
import './css/App.css'

function App(){
    const [logged, setLogged] = useState(false)
    return (
        <>
            {(!logged && <Form logged={logged} setLogged={setLogged}/>)}
            {(logged &&
                <>
                    <TopBar setLogged={setLogged}/>
                    <Films/>
                </>
                )}
        </>
    )
}

export default App