import './userPage.css'
import {useState} from "react";
import {NewFilm} from '../insertNew/NewFilm.tsx'
import {NewMember} from "../insertNew/NewMember.tsx";

export const UserPage = () => {
    const [option, setOption] = useState("")

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
                {option === 'newFilm' && <NewFilm/>}
                {option === 'newActor' && <NewMember member={'actor'}/>}
                {option === 'newDirector' && <NewMember member={'director'}/>}

            </div>
        </>
    )
}



