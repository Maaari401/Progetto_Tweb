import '../userSection/userPage.css'
import React, {ChangeEvent, useState} from "react";
import Search from "./searchBar/Search.tsx";

interface retStatus {
    id: number
}

interface searchBarReturn{
    id: number,
    section: string
}

export const NewFilm = () => {

    const [image, setImage] = useState('');
    const [filmName, setFilmName] = useState('');
    const [filmDate, setFilmDate] = useState('');
    const [filmRatio, setFilmRatio] = useState('');
    const [textareaInput, setTextareaInput] = useState('');
    const [codFilm, setCodFilm] = useState(586)

    const [codMember, setCodMember] = useState<searchBarReturn>({'id':-1,'section':'default'})
    const [character, setCharacter] = useState('')
    const [role, setRole] = useState('')
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
        fetch('http://localhost:8080/Progetto_Tweb/film/newFilm',{
            method: 'POST',
            headers: {
                "token": `tok $${sessionStorage.getItem("token")}`
            },
            body: JSON.stringify({
                "name": filmName,
                "ranking": filmRatio,
                "publicRelease": filmDate,
                "desc": textareaInput,
                "cover": image
            })
        }).then(data => data.json())
            .then((data: retStatus) => {
                console.log(data)
                setCodFilm(data.id)
            });
    };

    return (
        <div className="formNew">
            <p>{codFilm}</p>
            <input id="FilmImage" type="file" accept="image/*" onChange={e => handleImageChange(e)} required/><br/>
            {image !== '' && (
                <div>
                    <img src={`data:image/jpeg;base64,${image}`} alt="Uploaded" style={{maxWidth: '200px'}}/>
                    <button onClick={handleUndoUpload}>Undo Upload</button>
                </div>
            )}
            <input id="FilmName" type="text" value={filmName} onChange={(e) => setFilmName(e.target.value)}
                   placeholder={'Name of the Film'} required/><br/>
            <input id="FilmDate" type="date" value={filmDate} onChange={(e) => setFilmDate(e.target.value)}
                   placeholder={'Release Date of the Film'} required/><br/>
            <input id="FilmRatio" type="number" value={filmRatio} onChange={(e) => setFilmRatio(e.target.value)}
                   placeholder={'Ratio'} min={0} max={5} required/><br/>
            <textarea value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}
                      placeholder={'Description of the Film'} required/><br/>
            <button onClick={e => handleQuery(e)}>Query</button>
            {codFilm != -1 && <>
                <p>Cerca l'attore/direttore che vuoi mettere</p>
                <Search idMain={codFilm} values={[false, true, true]} setCodMember={setCodMember}/>

                {codMember.id !== -1 && (
                    codMember.section == 'actor' ? (
                        <div>
                            <p>Inserisci il nome del personaggio nel film</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <button onClick={()=>{
                                console.log('stai aggiungendo '+character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/actor/insertAIF?id='+ codMember.id +'&cod='+codFilm+'&character='+character,{
                                    method: 'PUT',
                                    headers: {
                                        "token": `tok $${sessionStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({
                                        "id": codFilm,
                                        "cod": codMember,
                                        "character": character
                                    })
                                }).then(data => {
                                    console.log(data.status)
                                    console.log(data.text())
                                });
                            }}>ADD</button>
                        </div>
                    ): (
                    <div>
                        <p>Inserisci il dipartimento in cui ha lavorato nel film</p>
                        <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                        <p>Inserisci il ruolo che ha avuto nel dipartimento</p>
                        <input type={'text'} onChange={e => setRole(e.target.value)}/>
                        <button onClick={() => {
                            console.log('hai aggiunto' + character)
                            /*Query per aggiungere il valore*/
                            fetch('http://localhost:8080/Progetto_Tweb/director/insertDIF?id=' + codMember.id + '&cod=' + codFilm + '&role=' + role +'&dep='+character, {
                                method: 'PUT',
                                headers: {
                                    "token": `tok $${sessionStorage.getItem("token")}`
                                },
                                body: JSON.stringify({
                                    "id": codFilm,
                                    "cod": codMember,
                                    "character": character
                                })
                            }).then(data => {
                                console.log(data.status)
                                console.log(data.text())
                            });
                        }}>ADD
                        </button>
                    </div>
                )
                )
                }
            </>}
        </div>


    );

}



