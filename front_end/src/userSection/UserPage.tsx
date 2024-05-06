import './userPage.css'
import {useEffect, useState} from "react";

export const UserPage = () => {
    const [option, setOption] = useState("")
    const [FilmToShow, setFilmToShow] = useState<JSX.Element[]>()

    useEffect(() => {
        console.log("value->"+option)
        setFilmToShow(undefined)
    }, [option]);

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
                <p>{FilmToShow}</p>
            </div>
        </>
    )
}



