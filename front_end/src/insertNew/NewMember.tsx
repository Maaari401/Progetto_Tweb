import React, {ChangeEvent, FC, useState} from "react";
import "./NewMember.css"

interface ViewI {
    view: string,
    preView: string
}
interface retStatus {
    id: number
}
interface NewMemberPropsI{
    member: string,
    view: ViewI,
    setView: (value: ViewI) => void
}

export const NewMember: FC<NewMemberPropsI> = (props) => {

    const [image, setImage] = useState('');
    const [ActorName, setActorName] = useState('');
    const [ActorDate, setActorDate] = useState('');
    const [textareaInput, setTextareaInput] = useState('');

    const [codActor, setCodActor] = useState(-1)
    const [hoverSave, setHoverSave] = useState(false);

    const handleSaveMouseEnter = () => {
        setHoverSave(true);
    };
    const handleSaveMouseLeave = () => {
        setHoverSave(false);
    };

    const [codFilm, setCodFilm] = useState<searchBarReturn>({'id':-1,'section':'default'})
    const [character, setCharacter] = useState('')
    const [role, setRole] = useState('')
    const [Result, setResult] = useState<boolean | undefined>(undefined)

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file !== undefined) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(",")[1]; // Extract only the Base64 string
                setImage(base64String || ''); // Store Base64 string in state
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUndoUpload = () => {
        setImage(''); // Clear the uploaded image
    };

    const handleQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const link = props.member === 'actor' ? 'http://localhost:8080/Progetto_Tweb/actor/newActor' : 'http://localhost:8080/Progetto_Tweb/director/newDirector'
        fetch(link,{
            method: 'POST',
            headers: {
                "token": `tok $${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                "name": ActorName,
                "date_birth": ActorDate,
                "description": textareaInput,
                "image": image
            })
        })
            .then(data => data.json())
            .then((data: retStatus) => {
                props.setView({'view':props.member+'?'+data.id, 'preView':'films'})
            })
    };

    return (
        <div className="add-artist">
            {/*<p>{codActor}</p>*/}
            <input id="new-artist-name" type="text" value={ActorName}
                   onChange={(e) => setActorName(e.target.value)}
                   placeholder={'Insert new ' + props.member + ' name'} required/>
            <input id="new-artist-birthdate" type="date" value={ActorDate}
                   onChange={(e) => setActorDate(e.target.value)} required/>
            <textarea id={'new-artist-bio'} value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}
                      placeholder={'Insert new ' + props.member + ' bio'} required/>
            <div id={'new-artist-pic'} className={'temp-pic-container'}>
                {image === '' ? (
                    <>
                        <p style={{marginRight:'1em'}}>Choose a picture</p>
                        <input type={"file"} accept="image/*"
                               onChange={e => handleImageChange(e)}/>
                    </>
                ) : (
                    <>
                        <p>Picture preview</p>
                        <img className={'temp-pic'} src={`data:image/jpeg;base64,${image}`} alt="Uploaded" style={{maxWidth: '300px'}}/>
                        <button onClick={handleUndoUpload}>Undo Upload</button>
                    </>
                )}
            </div>
            <button onClick={e => handleQuery(e)}>
                <img id={'save-new-artist'}
                     src={hoverSave ? 'src/assets/floppy-disk-solid.svg' : 'src/assets/floppy-disk-regular.svg'}
                     onMouseEnter={handleSaveMouseEnter}
                     onMouseLeave={handleSaveMouseLeave}
                     alt={'Save new artist'} title={'Save new artist'}>
                </img>
            </button>

            
        </div>
    );
}



