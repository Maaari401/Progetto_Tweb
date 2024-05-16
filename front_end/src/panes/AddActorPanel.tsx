import {FC, useState} from "react";
import './ConfirmDelete.css'

interface memberToDelete{
    id: number,
    section: string //actor || director
}
interface ConfirmDeletePropsI {
    onCancel: () => void,
    selectedMember: memberToDelete,
    filmId: number,
    refresh: boolean,
    setRefresh: (value: boolean) => void
}

const AddActorPanel: FC<ConfirmDeletePropsI> = (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const [character, setCharacter] = useState('')

    const handleInsert = () =>{
        fetch('http://localhost:8080/Progetto_Tweb/actor/insertAIF?id='+ props.selectedMember.id +'&cod='+props.filmId+'&character='+character,{
            method: 'PUT',
            headers: {
                "token": `tok $${sessionStorage.getItem("token")}`
            }
        }).then(data => {
            if(data.status === 200){
                props.setRefresh(!props.refresh)
                setIsVisible(false);
            }
        }).catch((e)=>{
            console.error(e)
        }).finally(()=>{
            setTimeout(props.onCancel, 1300)
        })
    }

    return <div className={'glasspane'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) props.onCancel();
                }}>
        <div className={'confirm-deletion'} style={{display: isVisible ? 'block' : 'none'}}>
            <p>Inserisci il nome del personaggio nel film  {props.selectedMember.id}</p>
            <input type={'text'} onChange={e => setCharacter(e.target.value)}/><br/>
            <button onClick={handleInsert}>
                Confirm
            </button>
        </div>
        <div className={'confirm-deletion'} style={{display: !isVisible ? 'block' : 'none'}}>
            <p>Actor added correctly</p>
        </div>
    </div>
}

export default AddActorPanel;