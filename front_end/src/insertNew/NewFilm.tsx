import '../userSection/userPage.css'
import React, {ChangeEvent, useState} from "react";
import "./NewMember.css"

interface retStatus {
    id: number
}
interface ViewI {
    view: string,
    preView: string
}

interface NewFilmProps {
    view: ViewI,
    setView: (value: ViewI) => void
}

export const NewFilm = (props: NewFilmProps) => {

    const [image, setImage] = useState('');
    const [filmName, setFilmName] = useState('');
    const [filmDate, setFilmDate] = useState('');
    const [filmRatio, setFilmRatio] = useState('');
    const [textareaInput, setTextareaInput] = useState('');

    const [codFilm, setCodFilm] = useState(-1)
    const [hoverSave, setHoverSave] = useState(false);

    const handleSaveMouseEnter = () => {
        setHoverSave(true);
    };
    const handleSaveMouseLeave = () => {
        setHoverSave(false);
    };

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
                "ranking": 4.01,
                "publicRelease": filmDate,
                "desc": textareaInput,
                "cover": image
            })
        }).then(data => data.json())
            .then((data: retStatus) => {
                props.setView({'view':'film?'+data.id, 'preView':'films'})
            });
    };

    return (
        <div className="add-artist">
            {/*<p>{codFilm}</p>*/}
            <input id="new-film-title" type="text" value={filmName}
                   onChange={(e) => setFilmName(e.target.value)}
                   placeholder={'Insert new film title'} required/>
            <input id="new-film-date" type="date" value={filmDate}
                   onChange={(e) => setFilmDate(e.target.value)} required/>
            <textarea id={'new-film-plot'} value={textareaInput}
                      onChange={(e) => setTextareaInput(e.target.value)}
                      placeholder={'Insert new film plot'} required/>
            <div id={'new-artist-pic'} className={'temp-pic-container'}>
                {image === '' ? (
                    <>
                        <p style={{marginRight: '1em'}}>Choose a picture</p>
                        <input type={"file"} accept="image/*"
                               onChange={e => handleImageChange(e)}/>
                    </>
                ) : (
                    <>
                        <p>Picture preview</p>
                        <img className={'temp-pic'} src={`data:image/jpeg;base64,${image}`} alt="Uploaded"
                             style={{maxWidth: '300px'}}/>
                        <button onClick={handleUndoUpload}>Undo Upload</button>
                    </>
                )}
            </div>
            <button onClick={e => handleQuery(e)}>
                <img id={'save-new-artist'}
                     src={hoverSave ? 'src/assets/floppy-disk-solid.svg' : 'src/assets/floppy-disk-regular.svg'}
                     onMouseEnter={handleSaveMouseEnter}
                     onMouseLeave={handleSaveMouseLeave}
                     alt={'Save new film'} title={'Save new film'}>
                </img>
            </button>
        </div>
    );

}



