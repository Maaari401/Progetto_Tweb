import React, {ChangeEvent, FC, useEffect, useState} from "react";
import './CastMemberInfo.css'
import Search from "../insertNew/searchBar/Search.tsx";
import SpecifyRoles from "../panes/SpecifyRoles.tsx";

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
    const [hoverSave, setHoverSave] = useState(false)
    const [showSpecifyRoles, setShowSpecifyRoles] = useState(false)

    const [Result, setResult] = useState<boolean>(false);
    const [codFilm, setCodFilm] = useState<searchBarReturn>({'id':-1,'section':'default'})
    const [refresh, setRefresh] = useState(true)

    const handleSaveMouseEnter = () => {
        setHoverSave(true);
    };
    const handleSaveMouseLeave = () => {
        setHoverSave(false);
    };

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



    }, [refresh]);

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

    let imageSrc: string;
    if (memberInfo !== undefined) {
        imageSrc = memberInfo.image !== 'bnVsbA==' && memberInfo.image !== ''? `data:image/jpeg;base64,${memberInfo.image}` : 'src/assets/profile-placeholder-cropped.png';
    }
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
                <p style={{fontSize:'1.5em'}} >Editing details about {memberName} as {props.section}</p>
                <div className={'artist-info'}>
                    <img className={'big-poster'} src={imageSrc}
                         alt={memberInfo.name + 'cover'}/>
                    <div className={'bio-info-container'}>
                        <form className={'bio-info-container'}>
                            <input id={'edit-name'} type={'label'} value={memberName}
                                   onChange={e => setMemberName(e.target.value)}/>
                            <input id={'edit-birthdate'} type={'date'}
                                   onChange={e => setMemberDate(e.target.value.toString())}/>
                            <textarea id={'edit-bio'} value={memberDesc}
                                      onChange={e => setMemberDesc(e.target.value)}/>
                            <div className={'temp-pic-container'}>
                                {memberImg === '' ? (
                                    <>
                                        <p style={{marginRight:'1em'}}>Choose a picture</p>
                                        <input type={"file"} accept="image/*"
                                               onChange={e => handleImageChange(e)}/>
                                    </>
                                ) : (
                                    <>
                                        <p>Picture preview</p>
                                        <img className={'temp-pic'} src={`data:image/jpeg;base64,${memberImg}`} alt="Uploaded" style={{maxWidth: '200px'}}/>
                                        <button onClick={(event) => handleUndoUpload(event)}>Undo Upload</button>
                                    </>
                                )}
                            </div>
                            <img id={'save-edit-member'} title='Save edits'
                                 src={hoverSave ? 'src/assets/floppy-disk-solid.svg' : 'src/assets/floppy-disk-regular.svg'}
                                 onMouseEnter={handleSaveMouseEnter}
                                 onMouseLeave={handleSaveMouseLeave}
                                 onClick={(e) => {
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

                                 }}/>
                            <p className={'success'} style={{display: Result ? 'block' : 'none'}}>Successfully saved edits</p>
                        </form>
                    </div>
                </div>
                <p style={{fontFamily:'Arial'}}>Add {memberName} in a film personnel</p>
                <Search setShowSpecifyRoles={setShowSpecifyRoles} idMain={props.id} values={[true, false, (props.section === 'actor')]}
                        setCodMember={setCodFilm} refresh={refresh}/>
                {showSpecifyRoles && <SpecifyRoles searchBarReturn={{id:props.id,section:props.section}} filmProps={{cod:codFilm.id,setView:props.setView,view:props.view}}
                                                   onCancel={() => {setShowSpecifyRoles(false)}} refresh={refresh} setRefresh={setRefresh}/>}
                
            </div>
        </>
    ) : (
        <p>500 server error</p>
    )
}
export default CastMemberInfo;