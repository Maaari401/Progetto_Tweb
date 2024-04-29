import Form from "./login/Form.tsx";
import {Films} from "./film/FilmList.tsx"
import {useEffect, useState} from "react";
import {TopBar} from "./TopBar/TopBar.tsx";
import {UserPage} from "./userSection/UserPage.tsx"
import FilmInfo from "./film/FilmInfo.tsx";
import './css/App.css'

function App(){
    const [logged, setLogged] = useState(false)
    const [view, setView] = useState("films")


    useEffect(() => {
        if(sessionStorage.getItem("token") !== null && sessionStorage.getItem('token') !== undefined) setLogged(true)
    }, []);

    return (
        <>
            {(!logged && <Form logged={logged} setLogged={setLogged}/>)}
            {(logged &&
                <>
                    <TopBar setLogged={setLogged} view={view} setView={setView}/>
                    {view === "films" && <Films setView={setView}/>}
                    {view === "user" && <UserPage/>}
                    {view.startsWith('film?') && <FilmInfo cod={parseInt(view.split('?')[1])} setView={setView}/>}
                </>
                )}
        </>
    )
}

export default App