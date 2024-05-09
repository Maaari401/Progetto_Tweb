import React, {ChangeEvent, FC, useState} from "react";
import Search from "./searchBar/Search.tsx";

interface retStatus {
    id: number
}
interface NewMemberPropsI{
    member: string
}
export const NewMember: FC<NewMemberPropsI> = (props) => {

    const [image, setImage] = useState('');
    const [ActorName, setActorName] = useState('');
    const [ActorDate, setActorDate] = useState('');
    const [textareaInput, setTextareaInput] = useState('');
    const [codActor, setCodActor] = useState(-1)

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
                "desc": textareaInput,
                "image": image
            })
        }).then(data => data.json())
            .then((data: retStatus) => {
                console.log(data)
                setCodActor(data.id)
            });
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
                   placeholder={'Release Date of the '+props.member} required/><br/>
            <textarea value={textareaInput} onChange={(e) => setTextareaInput(e.target.value)}
                      placeholder={'Description of the '+props.member} required/><br/>
            <button onClick={e => handleQuery(e)}>Query</button>

            {codActor != -1 && <Search idMain={codActor} values={[true, false, (props.member === 'actor')]}/>}
        </div>




    );

}



