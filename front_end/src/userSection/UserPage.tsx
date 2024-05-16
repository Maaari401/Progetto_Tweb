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
        <div className="userpage-container">
            <div className={"section-bar"}>
                <img src={option === 'FilmWatched' ? 'src/assets/green-eye-solid.svg' : 'src/assets/eye-regular.svg'}
                     onClick={() => {setOption("FilmWatched")}} alt={'FilmWatched'}></img>
                <img src={option === 'FilmLiked' ? 'src/assets/red-heart-solid.svg' : 'src/assets/heart-regular.svg'}
                     onClick={() => {setOption("FilmLiked")}} alt={'FilmLiked'}></img>
                {sessionStorage.getItem("role") === "true" && (
                    <>
                        <img src={option === 'newActor' ? 'src/assets/star-solid.svg' : 'src/assets/star-regular.svg'}
                             onClick={() => {setOption("newActor");}} alt={'NewActor'} title={'Add new actor'}></img>
                        <img src={option === 'newDirector' ? 'src/assets/orange-video-solid.svg' : 'src/assets/video-solid.svg'}
                             onClick={() => {setOption("newDirector");}} alt={'NewDirector'} title={'Add new film worker'}></img>
                        <img src={option === 'newFilm' ? 'src/assets/orange-film-solid.svg' : 'src/assets/film-solid.svg'}
                             onClick={() => {setOption("newFilm");}} alt={'NewFilm'} title={'Add new film'}></img>
                    </>
                )}
            </div>
            {option === 'FilmWatched' && <Films url={'http://localhost:8080/Progetto_Tweb/user/filmWatched?user_id='+sessionStorage.getItem('id')} setView={props.setView} view={props.view}/>}
            {option === 'FilmLiked' && <Films url={'http://localhost:8080/Progetto_Tweb/user/filmLiked?user_id='+sessionStorage.getItem('id')} setView={props.setView} view={props.view}/>}
            {option === 'newFilm' && <NewFilm view={props.view} setView={props.setView}/>}
            {option === 'newActor' && <NewMember view={props.view} setView={props.setView} member={'actor'}/>}
            {option === 'newDirector' && <NewMember view={props.view} setView={props.setView} member={'director'}/>}
        </div>
    )
}



