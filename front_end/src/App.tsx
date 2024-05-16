import Form from "./login/Form.tsx";
import {Films} from "./film/FilmList.tsx"
import {useEffect, useState} from "react";
import {TopBar} from "./TopBar/TopBar.tsx";
import {UserPage} from "./userSection/UserPage.tsx"
import FilmInfo from "./film/FilmInfo.tsx";
import './css/App.css'
import CastMemberInfo from "./cast/CastMemberInfo.tsx";
import FilmModify from "./film/FilmModify.tsx";
import CastMemberModify from "./cast/CastMemberModify.tsx";

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
                    <p style={{display: 'none'}}>{view.view}</p>
                    <TopBar setLogged={setLogged} view={view} setView={setView}/>
                    {view.view === "films" && <Films key={view.view} url={''} setView={setView} view={view}/>}
                    {view.view === "user" && <UserPage key={view.view} view={view} setView={setView}/>}
                    {view.view.startsWith('film?') && <FilmInfo key={view.view} cod={parseInt(view.view.split('?')[1])} setView={setView} view={view}/>}
                    {view.view.startsWith('actor?') && <CastMemberInfo key={view.view} id={parseInt(view.view.split('?')[1])} section={'actor'} setView={setView} view={view}/>}
                    {view.view.startsWith('director?') && <CastMemberInfo key={view.view} id={parseInt(view.view.split('?')[1])} section={'director'} setView={setView} view={view}/>}
                    {view.view.startsWith('modify-Film') && <FilmModify key={view.view} cod={parseInt(view.view.split('?')[1])} setView={setView} view={view}/>}
                    {view.view.startsWith('modify-member') && <CastMemberModify key={view.view} id={parseInt(view.view.split('?')[1])} section={view.view.includes('actor') ? 'actor':'director'} setView={setView} view={view}/>}
                </>
                )}
        </>
    )
}

export default App


/*

    TODO of mari:
    - remove a member from a film (glass pane)
    - glass pane for more info for actor (char) and for films (role, dep)
 */