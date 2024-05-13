import {ChangeEvent, FC, useEffect, useState} from "react";
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

const FilmInfo: FC<FilmPropsI> = (props) =>{
    const [FilmInfo, setFilmInfo] = useState<FilmDataI>({cod: 0, desc: "", cover: "", name: "", rate: 0, publicRelease: ""});
    const [ActorList, setActorList] = useState<JSX.Element[]>()
    const [DirectorList, setDirectorList] = useState<Record<string, JSX.Element[]>>()
    const [isLoading, setIsLoading] = useState(true)


    const [filmName, setFilmName] = useState(FilmInfo.name);
    const [filmDesc, setFilmDesc] = useState(FilmInfo.desc);
    const [filmDate, setFilmDate] = useState(FilmInfo.publicRelease);
    const [filmImg, setFilmImg] = useState('')

    const [Result, setResult] = useState<boolean>(false);
    
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
                        return (
                            <>
                                <div className={"actor_container"} key={a[0]} onClick={() => {
                            //code to show actor's info
                            props.setView({'view':'actor?'+value.id, 'preView':props.view.view})
                        }}>
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

                return (
                    <>
                        <div className="director_container" key={directorData[0]} onClick={()=>{
                    //code to show info of actor or director
                    props.setView({'view':'director?'+directorDetails.id, 'preView':props.view.view})

                }} >
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
        <div>
            <p>MODIFY FILM</p>
            <button onClick={()=>{
        props.setView({'view':props.view.preView, 'preView':props.view.view})
    }}>Back</button><br/>
            <form>
                {filmImg === '' ? (
                    <span>Cover of the film: <input type={"file"} accept="image/*"
                                                    onChange={e => handleImageChange(e)}/></span>
                ) : (
                    <div>
                        <img src={`data:image/jpeg;base64,${filmImg}`} alt="Uploaded" style={{maxWidth: '200px'}}/>
                        <button onClick={(event) => handleUndoUpload(event)}>Undo Upload</button>
                    </div>
                )}<br/>
                <span>name: <input type={'label'} value={filmName}
                                   onChange={e => setFilmName(e.target.value)}/></span><br/>
                <span>Description: <textarea value={filmDesc}
                                             onChange={e => setFilmDesc(e.target.value)}/></span><br/>
                <span>release date: <input type={'date'} value={convertDate(filmDate)}
                                           onChange={e => setFilmDate(e.target.value.toString())}/></span><br/>
                <button onClick={(e) => {
                    e.preventDefault();
                    fetch('http://localhost:8080/Progetto_Tweb/film/updateFilm',{
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
                        console.error('Error:', error);
                        const successMessage = document.getElementById('success');
                        if (successMessage) {
                            successMessage.innerText = `Error: ${error.message}`;
                        }
                    });
                    setTimeout(() => {
                        props.setView({'view':'film?'+FilmInfo.cod, 'preView':props.view.view});
                    }, 3000);
                }}>Modify values
                </button>
            </form>
        </div>
        <h1 id={'success'} style={{ display: Result ? 'block' : 'none' }}>MODIFI AVVENUTA CORRETTAMENTE</h1>

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


    </>
};


export default FilmInfo;