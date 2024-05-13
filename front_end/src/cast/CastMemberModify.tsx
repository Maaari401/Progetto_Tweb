import React, {ChangeEvent, FC, useEffect, useState} from "react";
import './CastMemberInfo.css'
import Search from "../insertNew/searchBar/Search.tsx";

interface ViewI {
    view: string,
    preView: string
}

interface castMemberInfoPropsI{
    id: number,
    section: string,
    setView: (value: ViewI) => void,
    view: ViewI
}
interface MemberInfoI{
    id: number,
    name: string,
    date_birth: string,
    description: string,
    image: string
}

interface searchBarReturn{
    id: number,
    section: string
}

const CastMemberInfo: FC<castMemberInfoPropsI> = (props: castMemberInfoPropsI) => {

    const [memberInfo, setMemberInfo] = useState<MemberInfoI>({id: 0, description: "", image: "", name: "",  date_birth: ""})

    const [memberName, setMemberName] = useState("")
    const [memberDesc, setMemberDesc] = useState("")
    const [memberDate, setMemberDate] = useState("")
    const [memberImg, setMemberImg] = useState('')

    const [Result, setResult] = useState<boolean>(false);
    const [codFilm, setCodFilm] = useState<searchBarReturn>({'id':-1,'section':'default'})
    const [character, setCharacter] = useState('')
    const [role, setRole] = useState('')

    useEffect(() => {
        const fetchFilmDataActor = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/actor?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as MemberInfoI;
            setMemberName(value.name);
            setMemberDesc(value.description);
            setMemberDate(value.date_birth);
            setMemberImg(value.image);
            setMemberInfo(value)

        }
        const fetchFilmDataDirector = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/director?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as MemberInfoI;
            setMemberName(value.name);
            setMemberDesc(value.description);
            setMemberDate(value.date_birth);
            setMemberImg(value.image);
            setMemberInfo(value);
        }

        if (props.section === 'actor') {
            fetchFilmDataActor(props.id)
        } else {
            fetchFilmDataDirector(props.id);
        }



    }, []);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file !== undefined) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1]; // Extract only the Base64 string
                setMemberImg(base64String || ''); // Store Base64 string in state
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUndoUpload = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMemberImg(''); // Clear the uploaded image
    };


    /*const convertDate = (string: string):string => {
        const inputDate = new Date(string);

        const year = inputDate.getFullYear();
        const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
        const day = inputDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }*/


    /*IMPORTANT to render the values in the input we need to rerender this component*/
    return memberInfo !== undefined ? (
        <>
            <div className={'artist-info-container'}>
                <div className={'previous-page'}>
                    <button onClick={() => {
                        props.setView({'view': props.view.preView, 'preView': props.view.view})
                    }}>
                        <img className='icon' src='src/assets/arrow-left-solid.svg'
                             title={'Go back'}/>
                    </button>
                </div>
                <div className={'artist-info'}>
                    <img className={'big-poster'} src={`data:image/jpeg;base64,${memberInfo.image}`}
                         alt={memberInfo.name + 'cover'}/>
                    <div className={'bio-info-container'}>
                        <p id={'name'}>{memberInfo.name}</p>
                        <p id={'birth-date'}>Born {memberInfo.date_birth}</p>
                        <p id={'bio'}>{memberInfo.description}</p>
                        {sessionStorage.getItem('role') === "true" &&
                            (<>
                                <img id={'edit-member'} src={'src/assets/pen-solid.svg'} onClick={() => props.setView({
                                    'view': 'modify-member-' + props.section + '?' + props.id,
                                    'preView': props.view.view
                                })} alt={'Edit icon'}>
                                </img>
                            </>)
                        }
                    </div>
                </div>
            </div>
            <h1>You are modifying the values of {memberName} {props.section}</h1>
            <form>
                {memberImg === '' ? (
                    <span>Cover of the film: <input type={"file"} accept="image/*"
                                                    onChange={e => handleImageChange(e)}/></span>
                ) : (
                    <div>
                        <img src={`data:image/jpeg;base64,${memberImg}`} alt="Uploaded" style={{maxWidth: '200px'}}/>
                        <button onClick={(event) => handleUndoUpload(event)}>Undo Upload</button>
                    </div>
                )}<br/>

                <span>name: <input type={'label'} value={memberName}
                                   onChange={e => setMemberName(e.target.value)}/></span><br/>
                <span>Description: <textarea value={memberDesc}
                                             onChange={e => setMemberDesc(e.target.value)}/></span><br/>
                <span>release date: <input type={'date'}
                                           onChange={e => setMemberDate(e.target.value.toString())}/></span><br/>

                <button onClick={(e) => {
                    e.preventDefault();
                    console.log(memberImg === '')
                    let url = '';
                    if (props.section === 'actor') {
                        url = 'http://localhost:8080/Progetto_Tweb/actor/updateActor';
                    } else {
                        url = 'http://localhost:8080/Progetto_Tweb/director/updateDirector'
                    }
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            "token": `tok $${sessionStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            "id": memberInfo.id,
                            "name": memberName,
                            "date_birth": memberDate,
                            "description": memberDesc,
                            "image": memberImg
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

                }}>Modify values
                </button>
            </form>
            <h1 id={'success'} style={{display: Result ? 'block' : 'none'}}>MODIFI AVVENUTA CORRETTAMENTE</h1>
            <Search idMain={props.id} values={[true, false, (props.section === 'actor')]}
                    setCodMember={setCodFilm}/>
            {
                codFilm.id !== -1 && (
                    props.section === 'actor' ? (
                        <div>
                            <p>Inserisci il nome del personaggio nel film</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <button onClick={() => {
                                console.log('stai aggiungendo ' + character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/actor/insertAIF?id=' + props.id + '&cod=' + codFilm.id + '&character=' + character, {
                                    method: 'PUT',
                                    headers: {
                                        "token": `tok $${sessionStorage.getItem("token")}`
                                    }
                                }).then(data => {
                                    if(data.status === 200) setResult(true);
                                    else setResult(false);
                                }).catch(()=>setResult(false));
                            }}>ADD
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p>Inserisci il dipartimento in cui ha lavorato nel film</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <p>Inserisci il ruolo che ha avuto nel dipartimento</p>
                            <input type={'text'} onChange={e => setRole(e.target.value)}/>
                            <button onClick={() => {
                                console.log('hai aggiunto' + character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/director/insertDIF?id=' + props.id + '&cod=' + codFilm.id + '&role=' + role + '&dep=' + character, {
                                    method: 'PUT',
                                    headers: {
                                        "token": `tok $${sessionStorage.getItem("token")}`
                                    }
                                }).then(data => {
                                    if(data.status === 200) setResult(true);
                                    else setResult(false);
                                }).catch(()=>setResult(false));
                            }}>ADD
                            </button>
                        </div>
                    )
                )
            }
        </>

    ) : (
        <p>500 server error</p>
    )
}
export default CastMemberInfo;