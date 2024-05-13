import './userPage.css'
import {useState} from "react";
import {NewFilm} from '../insertNew/NewFilm.tsx'
import {NewMember} from "../insertNew/NewMember.tsx";
import {Films} from "../film/FilmList.tsx"

interface ViewI {
    view: string,
    preView: string
}

interface UserPageProps {
    view: ViewI,
    setView: (value: ViewI) => void
}

export const UserPage = (props: UserPageProps) => {
    const [option, setOption] = useState("FilmWatched")

    return (
        <>
            <div className={"section"}>
                <ul className="selection-menu">
                    <li className={option === "FilmWatched" ? "Active" : ""}
                        onClick={()=>{setOption("FilmWatched")}}>
                            Film Watched</li>
                    <li className={option === "FilmLiked" ? "Active" : ""}
                        onClick={()=>{setOption("FilmLiked")}}>
                            Film Liked</li>
                    {sessionStorage.getItem("role") === "true" && (

                        <>
                            <li className={option === "newActor" ? "Active" : ""}
                                onClick={() => {
                                    setOption("newActor");
                                }}>
                                new Actor
                            </li>
                            <li className={option === "newDirector" ? "Active" : ""}
                                onClick={() => {
                                    setOption("newDirector");
                                }}>
                                new Director
                            </li>
                            <li className={option === "newFilm" ? "Active" : ""}
                                onClick={() => {
                                    setOption("newFilm")
                                }}>
                                new Film
                            </li>
                        </>


                    )}
                </ul>
            </div>
            <div className={'values'}>
                {option === 'FilmWatched' && <Films url={'http://localhost:8080/Progetto_Tweb/user/filmWatched?user_id='+sessionStorage.getItem('id')} setView={props.setView} view={props.view}/>}
                {option === 'FilmLiked' && <Films url={'http://localhost:8080/Progetto_Tweb/user/filmLiked?user_id='+sessionStorage.getItem('id')} setView={props.setView} view={props.view}/>}
                {option === 'newFilm' && <NewFilm view={props.view} setView={props.setView}/>}
                {option === 'newActor' && <NewMember view={props.view} setView={props.setView} member={'actor'}/>}
                {option === 'newDirector' && <NewMember view={props.view} setView={props.setView} member={'director'}/>}

            </div>
        </>
    )
}



