import {FC, useEffect, useState} from "react";
import './filminfo.css'
import React from "react";

interface ViewI {
    view: string,
    preView: string
}
interface FilmPropsI {
    cod: number,
    setView: (value: ViewI) => void,
    view: ViewI
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
    const [hoverWatch, setHoverWatch] = useState(false);
    const [hoverLike, setHoverLike] = useState(false);

    const handleWatchMouseEnter = () => {
        setHoverWatch(true);
    };
    const handleWatchMouseLeave = () => {
        setHoverWatch(false);
    };
    const handleLikeMouseEnter = () => {
        setHoverLike(true);
    };
    const handleLikeMouseLeave = () => {
        setHoverLike(false);
    };

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
                        const imageSrc = value.image !== 'bnVsbA==' ? `data:image/jpeg;base64,${value.image}` : 'src/assets/profile-placeholder-cropped.png'; // why not working?
                        return (
                            <>
                                <div className={"actor-container"} key={a[0]}>
                                    <img src={imageSrc} onClick={() => {
                                        //code to show actor's info
                                        props.setView({'view':'actor?'+value.id, 'preView':props.view.view})
                                    }} alt='Actor'/>
                                    <p><b>{value.name}</b> <br/>as<br/><b>{a[1]}</b></p>
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
                const value: CreditsDataI = await CastInfo(cod);

                const directorPromisesByDepartment: Record<string, Promise<JSX.Element>[]> = {};

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
                const imageSrc = directorDetails.image !== 'bnVsbA==' ? `data:image/jpeg;base64,${directorDetails.image}` : 'src/assets/profile-placeholder-cropped.png'; // why not working?
                return (
                    <>
                        <div className="director-container" key={directorData[0]}>
                            <img src={imageSrc} alt="Director"
                                 onClick={()=>{
                                 props.setView({'view':'director?'+directorDetails.id, 'preView':props.view.view})
                                //code to show info of actor or director
                            }}/>
                            <p>
                                <b>{directorDetails.name}</b>
                                <br/>as<br/>
                                <b>{directorData[1]}</b> {/* Accessing role from the JSON structure */}
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
            <div className={'film-info-container'}>
                <div className={'previous-page'}>
                    <button onClick={() => {
                        props.setView({'view': props.view.preView, 'preView': props.view.view})
                    }}>
                        <img className='icon' src='src/assets/arrow-left-solid.svg'
                             title={'Go back'}/>
                    </button>
                </div>
                <div className={'main-info'}>
                    <img className={'big-poster'} src={`data:image/jpeg;base64,${FilmInfo.cover}`}/>
                    <div className={'details'}>
                        <p id={'title'}>{FilmInfo.name}</p>
                        <p id={'year'}>{FilmInfo.publicRelease}</p>
                        <p id={'plot'}>{FilmInfo.desc}</p>
                        <div className={'watch-like-edit'}>
                            <img id={'watch'} className={'interact'}
                                 src={hoverWatch ? 'src/assets/green-eye-solid.svg' : 'src/assets/eye-regular.svg'}
                                 onMouseEnter={handleWatchMouseEnter}
                                 onMouseLeave={handleWatchMouseLeave}
                            />
                            <img id={'like'} className={'interact'}
                                 src={hoverLike ? 'src/assets/red-heart-solid.svg' : 'src/assets/heart-regular.svg'}
                                 onMouseEnter={handleLikeMouseEnter}
                                 onMouseLeave={handleLikeMouseLeave}
                            />
                            {sessionStorage.getItem('role') === 'true' ?
                                (<img id={'edit'} src={'src/assets/pen-solid.svg'}
                                  onClick={() => {
                                    props.setView({'view': 'modify-Film?' + props.cod, 'preView': props.view.view})
                                }}/>):(<></>)
                            }
                        </div>
                    </div>
                </div>
                <div className={'cast-box'}>
                    <p id={'cast'}>Cast</p>
                    <div className={'actor-list'}>
                        {ActorList}
                    </div>
                </div>
                <div className={'film-crew-box'}>
                    {isLoading ? ( // Conditionally render loading state
                            <p> Director List is Loading...</p>
                        ) : (
                        <>
                                <p id={'crew'}>Film crew</p>
                                {Object.entries(DirectorList).map(([department, directorList]) => (
                                    <div className={'department'} key={department}>
                                        <hr/>
                                        <p className={'department-name'}>{department}</p>
                                        <div className={'department-list'}>
                                            {directorList.map((director, index) => (
                                                <React.Fragment key={index}>
                                                    {director}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </>
                    )}
                </div>
            </div>
    </>
};


export default FilmInfo;