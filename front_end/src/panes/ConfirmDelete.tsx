import {FC} from "react";
import './ConfirmDelete.css'

interface memberToDelete{
    id: number,
    section: string //actor || director
}
interface ConfirmDeletePropsI {
    onCancel: () => void,
    selectedMember: memberToDelete,
    filmId: number
}

const ConfirmDelete: FC<ConfirmDeletePropsI> = (props) => {

    const handleDelete = () =>{
        //console.log('elimino il '+props.selectedMember.id + ' da ' + props.selectedMember.section + ' da '+props.filmId + ' film');

    }

    return <div className={'glass-pane'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) props.onCancel();
                }}>
        <div className={'confirm-deletion'}>
            <p>Are you sure you want to remove the selected member from the film personnel?</p>
            <button onClick={handleDelete}>
                Confirm
            </button>
        </div>
    </div>
}

export default ConfirmDelete;