import React, {FC, useState} from "react";
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

const AddDirectorPanel: FC<ConfirmDeletePropsI> = (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const [role, setRole] = useState('')
    const [dep, setDep] = useState('')

    const handleInsert = () =>{
        fetch('http://localhost:8080/Progetto_Tweb/director/insertDIF?id=' + props.selectedMember.id + '&cod=' + props.filmId + '&role=' + role +'&dep='+dep,{
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
            <p>Inserisci il dipartimento in cui ha lavorato nel film</p>
            <input type={'text'} onChange={e => setDep(e.target.value)}/><br/>
            <p>Inserisci il ruolo che ha avuto nel dipartimento</p>
            <input type={'text'} onChange={e => setRole(e.target.value)}/><br/>
            <button onClick={handleInsert}>
                ADD
            </button>
        </div>
        <div className={'confirm-deletion'} style={{display: !isVisible ? 'block' : 'none'}}>
            <p>Director added correctly</p>
        </div>
    </div>
}

export default AddDirectorPanel;