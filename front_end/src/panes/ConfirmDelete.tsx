import {FC} from "react";

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

    return <div className={'glasspane'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) props.onCancel();
                }}>
        <div>
            <button onClick={handleDelete}>
                Confirm
            </button>
        </div>
    </div>
}

export default ConfirmDelete;