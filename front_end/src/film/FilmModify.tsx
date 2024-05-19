import {ChangeEvent, FC, useEffect, useState} from "react";
import './filminfo.css'
import React from "react";
import ConfirmDelete from "../panes/ConfirmDelete.tsx";
import SpecifyRoles from "../panes/SpecifyRoles.tsx";
import Search from "../insertNew/searchBar/Search.tsx";

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
interface memberToDelete{
    id: number,
    section: string //actor || director
}
interface searchBarReturn{
    id: number,
    section: string
}

const FilmInfo: FC<FilmPropsI> = (props) =>{
    const [FilmInfo, setFilmInfo] = useState<FilmDataI>({cod: 0, desc: "", cover: "", name: "", rate: 0, publicRelease: ""});
    const [ActorList, setActorList] = useState<JSX.Element[]>()
    const [DirectorList, setDirectorList] = useState<Record<string, JSX.Element[]>>()
    const [isLoading, setIsLoading] = useState(true)
    const [hoverSave, setHoverSave] = useState(false);
    const [showRemovalConfirmation, setShowRemovalConfirmation] = useState(false);
    const [showSpecifyRoles, setShowSpecifyRoles] = useState(false);
    const [selectedMember, setSelectedMember] = useState<memberToDelete>({'id':-1,'section':'null'})

    const [codMember, setCodMember] = useState<searchBarReturn>({'id':-1,'section':'default'})



    const handleSaveMouseEnter = () => {
        setHoverSave(true);
    };
    const handleSaveMouseLeave = () => {
        setHoverSave(false);
    };


    const [filmName, setFilmName] = useState(FilmInfo.name);
    const [filmDesc, setFilmDesc] = useState(FilmInfo.desc);
    const [filmDate, setFilmDate] = useState(FilmInfo.publicRelease);
    const [filmImg, setFilmImg] = useState('')


    const [Result, setResult] = useState<boolean>(false);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(() => {
        const fetchFilmData = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as FilmDataI;
            setFilmImg(value.cover);
            setFilmName(value.name);
            setFilmDate(value.publicRelease);
            setFilmDesc(value.desc);
            setFilmInfo(value);
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
                        const imageSrc = value.image !== 'bnVsbA==' && value.image !== '' ? `data:image/jpeg;base64,${value.image}` : 'src/assets/profile-placeholder-cropped.png'; // why not working?
                        return (
                            <>
                                <div className={"actor-container"} key={a[0]}>
                                    <img src={imageSrc} title={'Remove from cast'} onClick={() => {
                                        setSelectedMember({'id': value.id, 'section': 'actor'});
                                        setShowRemovalConfirmation(true)
                                    }
                                    } alt='Actor'/>
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
                //console.log(directorListsByDepartment)
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
                const imageSrc = directorDetails.image !== 'bnVsbA==' && directorDetails.image !== ''? `data:image/jpeg;base64,${directorDetails.image}` : 'src/assets/profile-placeholder-cropped.png';

                return (
                    <>
                        <div className="director-container" key={directorData[0]}>
                            <img src={imageSrc} alt="Director" title={'Remove from crew'}
                                 onClick={() => {
                                     setSelectedMember({'id': directorDetails.id, 'section': 'director'});
                                     setShowRemovalConfirmation(true)
                                 }}/>
                            <p>
                                <b>{directorDetails.name}</b>
                                <br/>as<br/>
                                <b>{directorData[1]}</b> {/* Accessing role from the JSON structure */}
                                {/*<br/>in<br/>*/}
                                {/*<b>{directorData[2]}</b> /!* Accessing department from the JSON structure *!/*/}
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
    }, [refresh]);
    const convertDate = (string: string):string => {
        const inputDate = new Date(string);

        const year = inputDate.getFullYear();
        const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
        const day = inputDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file !== undefined) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1]; // Extract only the Base64 string
                setFilmImg(base64String || ''); // Store Base64 string in state
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUndoUpload = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFilmImg(''); // Clear the uploaded image
    };



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
            <div className={'edit-main-info'}>
                <img className={'big-poster'} src={`data:image/jpeg;base64,${FilmInfo.cover}`}/>
                <div className={'edit-details'}>
                    <form className={'edit-details'}>
                        <input id={'edit-title'} type={'label'} value={filmName}
                               onChange={e => setFilmName(e.target.value)}/>
                        <input id={'edit-year'} type={'date'} value={convertDate(filmDate)}
                               onChange={e => setFilmDate(e.target.value.toString)}/>
                        <textarea id={'edit-plot'} value={filmDesc}
                                  onChange={e => setFilmDesc(e.target.value)}/>
                        <input id={'edit-poster'} type={"file"} accept="image/*"
                               onChange={e => handleImageChange(e)}/>
                        <img id={'save-edits'} title='Save edits'
                             src={hoverSave ? 'src/assets/floppy-disk-solid.svg' : 'src/assets/floppy-disk-regular.svg'}
                             onMouseEnter={handleSaveMouseEnter}
                             onMouseLeave={handleSaveMouseLeave}
                             onClick={(e) => {
                                 e.preventDefault();
                                 if (filmImg === '') {
                                     setFilmImg(FilmInfo.cover);
                                 }
                                 fetch('http://localhost:8080/Progetto_Tweb/film/updateFilm', {
                                     method: 'POST',
                                     headers: {
                                         "token": `tok $${sessionStorage.getItem("token")}`
                                     },
                                     body: JSON.stringify({
                                         "cod": FilmInfo.cod,
                                         "name": filmName,
                                         "ranking": "2.12",
                                         "publicRelease": filmDate,
                                         "desc": filmDesc,
                                         "cover": filmImg
                                     })
                                 }).then(response => {
                                     if (response.ok) {
                                         setResult(true);
                                     } else {
                                         setResult(false);
                                         throw new Error(`Request failed with status ${response.status}`);
                                     }
                                 }).catch(error => {
                                     setResult(false)
                                     console.error('Error:', error);
                                     const successMessage = document.getElementById('success');
                                     if (successMessage) {
                                         successMessage.innerText = `Error: ${error.message}`;
                                     }
                                 });
                             }}>
                        </img>
                        <p className={'success'} style={{display: Result ? 'block' : 'none'}}>Successfully saved edits</p>
                    </form>
                </div>
            </div>
            <div>
            <p style={{fontFamily:'Arial'}} >Add one member to the film personnel</p>
            <Search
                idMain={props.cod}
                values={[false, true, true]}
                setCodMember={setCodMember}
                setShowSpecifyRoles={setShowSpecifyRoles}
                refresh={refresh}
            />
            {showSpecifyRoles &&
                <SpecifyRoles
                    filmProps={props}
                    searchBarReturn={codMember}
                    onCancel={() => {setShowSpecifyRoles(false)}}
                    setRefresh={setRefresh}
                    refresh={refresh}
                />}
            </div>
            <div className={'cast-box'}>
                <p id={'cast'}>Cast</p>
                <div className={'actor-list'}>
                    {ActorList}
                </div>
            </div>
            {showRemovalConfirmation &&
                selectedMember.id !== -1 &&
                selectedMember.section !== 'null' &&
                <ConfirmDelete
                    filmId={props.cod}
                    selectedMember={selectedMember}
                    onCancel={() => {setShowRemovalConfirmation(false);}}
                    refresh={refresh}
                    setRefresh={setRefresh}
                />}
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