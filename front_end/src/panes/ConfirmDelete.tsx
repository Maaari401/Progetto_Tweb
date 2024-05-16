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

const ConfirmDelete: FC<ConfirmDeletePropsI> = (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const handleDelete = () =>{
        console.log('elimino il '+props.selectedMember.id + ' da ' + props.selectedMember.section + ' da '+props.filmId + ' film');
        const url = props.selectedMember.section !== 'actor' ?
            'http://localhost:8080/Progetto_Tweb/director/remove?id='+ props.selectedMember.id +'&cod='+props.filmId :
            'http://localhost:8080/Progetto_Tweb/actor/remove?id='+ props.selectedMember.id +'&cod='+props.filmId
        console.log(url)
        fetch(url, {
            method: 'DELETE',
            headers: {
                "token": `tok $${sessionStorage.getItem("token")}`
            }
        }).then(data => {
            if(data.status === 200) setIsVisible(false);
            else console.log('nope')
            props.setRefresh(!props.refresh)
        }).catch((e)=>{
            console.error(e)
        }).finally(()=>{
            setTimeout(props.onCancel, 2000)
        })
    }

    return <div className={'glass-pane'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) props.onCancel();
                }}>
        <div className={'confirm-deletion'} style={{display: isVisible ? 'block' : 'none'}}>
            <p>Are you sure you want to remove the selected member from the film personnel?</p>
            <button onClick={handleDelete}>
                Confirm
            </button>
        </div>
        <div className={'confirm-deletion'} style={{display: !isVisible ? 'block' : 'none'}}>
            <p>Elimination success!</p>
        </div>
    </div>
}

export default ConfirmDelete;