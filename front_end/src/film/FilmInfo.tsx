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
    actor: ActorBaseI[],
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
interface MemberI{
    id: number,
    name: string,
    date_birth: string,
    desc: string,
    image: string
}
const FilmInfo: FC<FilmPropsI> = (props) =>{
    const [FilmInfo, setFilmInfo] = useState<FilmDataI>({cod: 0, desc: "", cover: "", name: "", rate: 0, publicRelease: ""});
    const [actorList, setActorList] = useState<JSX.Element[]>()

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
        /*const fetchFilmCast= async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film/credits?cod=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as CreditsDataI;
            console.log(value)
            const actorPromises: Promise<JSX.Element>[] = value.actors.map((a) => {
                return fetch('http://localhost:8080/Progetto_Tweb/actor?id=' + a.id, {
                    method: 'GET',
                    headers: {
                        "token": `tok $${sessionStorage.getItem("token")}`
                    }
                })
                    .then(response => response.json())
                    .then((value: MemberI) => {
                        return (
                            <>
                                <img src={`data:image/jpeg;base64,${value.image}`}/>
                                <p>{value.name} <b>as</b> {a.character}</p>
                            </>
                        );
                    });
            });
            console.log(actorPromises)

            Promise.all(actorPromises)
                .then(ActorElist => {
                    console.log(ActorElist);
                    setActorList(ActorElist);
                })
                .catch((e) => {
                   console.error(e)
                });


        }*/
        const CastInfo = async (cod: number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film/credits?cod=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            return await response.json();
        }
        const fetchFilmCast = async (cod: number) =>{
            const value: CreditsDataI = await CastInfo(cod);
            const actorPromises: Promise<JSX.Element>[] = value.actor.map((a) => {
                return fetch('http://localhost:8080/Progetto_Tweb/actor?id=' + a[0], {
                    method: 'GET',
                    headers: {
                        "token": `tok $${sessionStorage.getItem("token")}`
                    }
                })
                    .then(response => response.json())
                    .then((value: MemberI) => {
                        return (
                            <>
                                <div className={"actor_container"} key={a[0]}>
                                    <img src={`data:image/jpeg;base64,${value.image}`}/>
                                    <p>{value.name} <br/><b>as</b> <br/>{a[1]}</p>
                                </div>
                            </>
                        );
                    });
            });

            Promise.all(actorPromises)
                .then(ActorElist => {
                    setActorList(ActorElist);
                })
                .catch((error) => {
                    console.error("Error fetching actors:", error);
                });
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
                {actorList}
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