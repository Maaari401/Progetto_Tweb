import {FC, useState} from "react";
import './ConfirmDelete.css'

interface searchBarReturn{
    id: number,
    section: string
}

interface ViewI {
    view: string,
    preView: string
}

interface FilmPropsI {
    cod: number,
    setView: (value: ViewI) => void,
    view: ViewI
}

interface SpecifyRolesProps {
    onCancel: () => void,
    searchBarReturn: searchBarReturn,
    filmProps: FilmPropsI
}

const SpecifyRoles: FC<SpecifyRolesProps> = (props) => {

    const [codMember, setCodMember] = useState<searchBarReturn>(props.searchBarReturn)
    const [character, setCharacter] = useState('')
    const [refresh, setRefresh] = useState(false);
    const [role, setRole] = useState('')

    console.log(props.searchBarReturn.id);
    return (
        <div className={'glass-pane'}
             onClick={(e) => {if (e.target === e.currentTarget) props.onCancel();
             }}>
            {
                codMember.id !== -1 && (
                    codMember.section === 'actor' ? (
                        <div className={'define-roles'}>
                            <p>Enter the role played in the film</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <button onClick={()=>{
                                console.log('stai aggiungendo '+character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/actor/insertAIF?id='+ codMember.id +'&cod='+props.filmProps.cod+'&character='+character,{
                                    method: 'PUT',
                                    headers: {
                                        "token": `tok $${sessionStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({
                                        "id": props.filmProps.cod,
                                        "cod": codMember,
                                        "character": character
                                    })
                                }).then(data => {
                                    if(data.status === 200) setRefresh(!refresh)
                                });
                                props.onCancel();
                            }}>
                                Add
                            </button>
                        </div>
                    ) : (
                        <div className={'define-roles'}>
                            <p>Enter crew department</p>
                            <input type={'text'} onChange={e => setCharacter(e.target.value)}/>
                            <p>Enter department specific role</p>
                            <input type={'text'} onChange={e => setRole(e.target.value)}/>
                            <button onClick={() => {
                                console.log('hai aggiunto' + character)
                                /*Query per aggiungere il valore*/
                                fetch('http://localhost:8080/Progetto_Tweb/director/insertDIF?id=' + codMember.id + '&cod=' + props.filmProps.cod + '&role=' + role +'&dep='+character, {
                                    method: 'PUT',
                                    headers: {
                                        "token": `tok $${sessionStorage.getItem("token")}`
                                    },
                                    body: JSON.stringify({
                                        "id": props.filmProps.cod,
                                        "cod": codMember,
                                        "character": character
                                    })
                                }).then(data => {
                                    if(data.status === 200) setRefresh(!refresh)
                                });
                                props.onCancel();
                            }}>
                                Add
                            </button>
                        </div>
                    )
                )
            }
        </div>
    )
}

export default SpecifyRoles;