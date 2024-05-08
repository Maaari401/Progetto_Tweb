import Form from "./login/Form.tsx";
import {Films} from "./film/FilmList.tsx"
import {useEffect, useState} from "react";
import {TopBar} from "./TopBar/TopBar.tsx";
import {UserPage} from "./userSection/UserPage.tsx"
import FilmInfo from "./film/FilmInfo.tsx";
import './css/App.css'
import CastMemberInfo from "./cast/CastMemberInfo.tsx";
import FilmModify from "./film/FilmModify.tsx";

interface ViewI {
    view: string,
    preView: string
}

function App(){
    const [logged, setLogged] = useState(false)
    const [view, setView] = useState<ViewI>({'view':'films','preView':'films'})

    useEffect(() => {
        if(sessionStorage.getItem("token") !== null && sessionStorage.getItem('token') !== undefined) setLogged(true)
    }, []);

    return (
        <>
            {(!logged && <Form logged={logged} setLogged={setLogged}/>)}
            {(logged &&
                <>

                    <TopBar setLogged={setLogged} view={view} setView={setView}/>
                    {view.view === "films" && <Films setView={setView} view={view}/>}
                    {view.view === "user" && <UserPage/>}
                    {view.view.startsWith('film?') && <FilmInfo cod={parseInt(view.view.split('?')[1])} setView={setView} view={view}/>}
                    {view.view.startsWith('actor?') && <CastMemberInfo id={parseInt(view.view.split('?')[1])} section={'actor'} setView={setView} view={view}/>}
                    {view.view.startsWith('director?') && <CastMemberInfo id={parseInt(view.view.split('?')[1])} section={'director'} setView={setView} view={view}/>}
                    {view.view.startsWith('modify-Film') && <FilmModify cod={parseInt(view.view.split('?')[1])} setView={setView} view={view}/>}
                </>
                )}
        </>
    )
}

export default App