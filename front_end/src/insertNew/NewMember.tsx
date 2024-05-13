import React, {ChangeEvent, FC, useState} from "react";
import Search from "./searchBar/Search.tsx";

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
interface searchBarReturn{
    id: number,
    section: string
}
export const NewMember: FC<NewMemberPropsI> = (props) => {

    const [image, setImage] = useState('');
    const [ActorName, setActorName] = useState('');
    const [ActorDate, setActorDate] = useState('');
    const [textareaInput, setTextareaInput] = useState('');
    const [codActor, setCodActor] = useState(-1)

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
                console.log(data)
                setCodActor(data.id)
            })
    };

    return (
        <div className="formNew">
            <p>{codActor}</p>
            <input id="ActorImage" type="file" accept="image/*" onChange={e => handleImageChange(e)} required/><br/>
            {image !== '' && (
                <div>
                    <img src={`data:image/jpeg;base64,${image}`} alt="Uploaded" style={{maxWidth: '200px'}}/>
                    <button onClick={handleUndoUpload}>Undo Upload</button>
                </div>
            )}
            <input id="ActorName" type="text" value={ActorName} onChange={(e) => setActorName(e.target.value)}
                   placeholder={'Name of the ' + props.member} required/><br/>
            <input id="ActorDate" type="date" value={ActorDate} onChange={(e) => setActorDate(e.target.value)}
                   placeholder={'Release Date of the ' + props.member} required/><br/>
            <textarea value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}
                      placeholder={'Description of the ' + props.member} required/><br/>
            <button onClick={e => handleQuery(e)}>Query</button>

            {codActor != -1 && <Search idMain={codActor} values={[true, false, (props.member === 'actor')]}
                                       setCodMember={setCodFilm}/>}
            {
                codFilm.id !== -1 && (
                    props.member === 'actor' ? (
                        <div>
                            <p>Inserisci il nome del personaggio nel film</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <button onClick={() => {
                                console.log('stai aggiungendo ' + character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/actor/insertAIF?id=' + codActor + '&cod=' + codFilm.id + '&character=' + character, {
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
                                fetch('http://localhost:8080/Progetto_Tweb/director/insertDIF?id=' + codActor + '&cod=' + codFilm.id + '&role=' + role + '&dep=' + character, {
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
            {Result !== undefined && (
                <>
                    <h2 style={{display: Result ? 'block' : 'none'}}>Aggiunta avvenuta correttamente</h2>
                    <h2 style={{display: !Result ? 'block' : 'none', color:'red'}}>Aggiunta avvenuta non correttamente</h2>
                </>
    )
}

</div>


)
    ;

}



