import './userPage.css'
import React, {ChangeEvent, useState} from "react";

interface retStatus {
    id: number
}

export const NewFilm = () => {

    const [image, setImage] = useState('');
    const [filmName, setFilmName] = useState('');
    const [filmDate, setFilmDate] = useState('');
    const [filmRatio, setFilmRatio] = useState('');
    const [textareaInput, setTextareaInput] = useState('');
    const [codFilm, setCodFilm] = useState(-1)

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
        </div>


    );

}



