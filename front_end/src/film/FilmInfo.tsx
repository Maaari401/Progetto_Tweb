import {FC, useEffect, useState} from "react";
import './filminfo.css'

interface FilmPropsI {
    cod: number
    setView: (value: string) => void
}
interface FilmDataI {
    cod: number,
    name: string,
    rate: number,
    publicRelease: string,
    cover: string,
    desc: string,
}
interface CreditsDataI{
    actors: ActorBaseI[],
    cast: CastBaseI[]
}
interface ActorBaseI{
    id: number,
    character: string
}
interface CastBaseI{
    id: number,
    role: string,
    departmant: string
}

const FilmInfo: FC<FilmPropsI> = (props) =>{
    const [FilmInfo, setFilmInfo] = useState<FilmDataI>({cod: 0, desc: "", cover: "", name: "", rate: 0, publicRelease: ""});
    //const [actorList, setActorList] = useState<JSX.Element[]>()

    useEffect(() => {

        const fetchFilmData = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as FilmDataI;
            setFilmInfo(value)
        }
        const fetchFilmCast= async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film/credits?cod=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as CreditsDataI;
            console.log(value)
        }


        fetchFilmData(props.cod)
        fetchFilmCast(props.cod)
        //fetchFilmDirector(props.cod)
    }, []);

    return (<>
            <div>
                <div className={'image-container'}><img className={'centered-image'}
                                                        src={`data:image/jpeg;base64,${FilmInfo.cover}`}/></div>
                <p>Movie name: {FilmInfo.name}</p>
                <p>Description: {FilmInfo.desc}</p>
                <p>release date: {FilmInfo.publicRelease}</p>
            </div>

            <div className={'actorList'}>

            </div>
            <button onClick={() => {
                props.setView("films")
            }
            }>BACK
            </button>

        </>
    )
};


export default FilmInfo;