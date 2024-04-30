import {FC, useEffect, useState} from "react";
import './filminfo.css'
import React from "react";

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
    crew: CrewDataI[]
}
interface ActorBaseI{
    id: number,
    character: string
}
interface CrewDataI {
    [department: string]: CastBaseI[];
}

interface CastBaseI{
    id: number,
    role: string,
    department: string
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
    const [ActorList, setActorList] = useState<JSX.Element[]>()
    const [DirectorList, setDirectorList] = useState<Record<string, JSX.Element[]>>()
    const [isLoading, setIsLoading] = useState(true)


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

        const fetchFilmActors = async (cod: number) =>{
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

        const fetchFilmDirectors = async (cod: number) => {
            try {
                const value: CreditsDataI = await CastInfo(cod); // Assuming CastInfo is a function that fetches credits data

                const directorPromisesByDepartment: Record<string, Promise<JSX.Element>[]> = {};

                // Iterate over the departments and their crew members
                for (const department in value.crew) {
                    const crewList = value.crew[department];
                    directorPromisesByDepartment[department] = crewList.map((directorData: string[]) => {
                        return fetchDirectorDetails(directorData);
                    });
                }

                // Resolve promises for each department separately
                const directorListsByDepartment: Record<string, JSX.Element[]> = {};
                for (const department in directorPromisesByDepartment) {
                    directorListsByDepartment[department] = await Promise.all(directorPromisesByDepartment[department]);
                }
                console.log(directorListsByDepartment)
                // Set director lists for each department
                setDirectorList(directorListsByDepartment);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching credits data:", error);
            }
        };

        const fetchDirectorDetails = async (directorData: string[]): Promise<JSX.Element> => {
            try {
                const response = await fetch(`http://localhost:8080/Progetto_Tweb/director?id=${directorData[0]}`, {
                    method: 'GET',
                    headers: {
                        "token": `tok $${sessionStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch director details: HTTP status ${response.status}`);
                }

                const directorDetails: MemberI = await response.json();

                return (
                    <>
                        <div className="director_container" key={directorData[0]}>
                            <img src={`data:image/jpeg;base64,${directorDetails.image}`} alt="Director" />
                            <p>
                                {directorDetails.name}
                                <br /><b>as</b> <br />
                                {directorData[2]} {/* Accessing role from the JSON structure */}
                                <br /><b>in</b>
                                {directorData[1]} {/* Accessing department from the JSON structure */}
                            </p>
                        </div>
                    </>
                );
            } catch (error) {
                console.error("Error fetching director details:", error);
                return (
                    <>
                        <div key={directorData[0]}>
                            <p>Error Fetching</p>
                        </div>

                    </>
                ); // Return null for failed promises
            }
        };

        fetchFilmData(props.cod)
        fetchFilmActors(props.cod)
        fetchFilmDirectors(props.cod)
    }, []);

    return <>
            <div>
                <div className={'image-container'}><img className={'centered-image'}
                                                        src={`data:image/jpeg;base64,${FilmInfo.cover}`}/></div>
                <p>Movie name: {FilmInfo.name}</p>
                <p>Description: {FilmInfo.desc}</p>
                <p>release date: {FilmInfo.publicRelease}</p>
            </div>
            <div className={'actorList'}>
                Actor list:<br/>
                {ActorList}
            </div>
            <div className={'directorList'}>
                <br/>
                {isLoading ? ( // Conditionally render loading state
                        <p> Director List is Loading...</p>
                    ) : (
                    <>
                        <div className={'directorList'}>
                            Director list:<br/>
                            {Object.entries(DirectorList).map(([department, directorList]) => (
                                <div key={department}>
                                    <h2>{department}</h2>
                                    {directorList.map((director, index) => (
                                        <React.Fragment key={index}>
                                            {director}
                                        </React.Fragment>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        <button onClick={() => {
            props.setView("films")
        }
        }>BACK
        </button>

    </>
};


export default FilmInfo;