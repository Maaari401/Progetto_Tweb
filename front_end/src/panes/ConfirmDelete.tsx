import {FC} from "react";

interface ConfirmDeletePropsI {
    onCancel: () => void;
}

const ConfirmDelete: FC<ConfirmDeletePropsI> = ({onCancel}) => {
    return <div className={'glasspane'}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onCancel();
                }}>
        <div>
            <button>
                Confirm
            </button>
        </div>
    </div>
}

export default ConfirmDelete;