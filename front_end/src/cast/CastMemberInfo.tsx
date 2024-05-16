import React, {FC, useEffect, useState} from "react";
import './CastMemberInfo.css'

interface ViewI {
    view: string,
    preView: string
}

interface castMemberInfoPropsI{
    id: number,
    section: string,
    setView: (value: ViewI) => void,
    view: ViewI
}
interface MemberInfoI{
    id: number,
    name: string,
    date_birth: string,
    description: string,
    image: string
}
interface FilmI{
    cod: number,
    name: string,
    rate: number,
    publicRelease: string,
    cover: string,
    desc: string,
}

const CastMemberInfo: FC<castMemberInfoPropsI> = (props: castMemberInfoPropsI) => {

    const [memberInfo, setMemberInfo] = useState<MemberInfoI>()
    const [filmList, setfilmList] = useState<JSX.Element[]>()
    useEffect(() => {
        const fetchFilmDataActor = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/actor?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as MemberInfoI;
            setMemberInfo(value)
        }
        const fetchFilmDataDirector = async (cod:number) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/director?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as MemberInfoI;
            setMemberInfo(value)
        }
        const FilmList = async (cod: number, route: string) => {
            const response = await fetch('http://localhost:8080/Progetto_Tweb/' + route + '?id=' + cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as number[];

            const list: Promise<FilmI>[] = value.map((codF) => {
                return fetch('http://localhost:8080/Progetto_Tweb/film?id=' + codF, {
                    method: 'GET',
                    headers: {
                        "token": `tok $${sessionStorage.getItem("token")}`
                    }
                }).then(response => response.json())
                    .then((value: FilmI) => {
                        return value
                    })
            })
            
            Promise.all(list)
                .then(films => {
                    const tmp = films.map((filmo => {
                        return <>
                            <div className={'filmography-entry-container'}>
                                <img src={`data:image/jpeg;base64,${filmo.cover}`} className={'centered-image'}
                                     onClick={() =>
                                     {props.setView({'view': 'film?'+filmo.cod, 'preView':props.view.view})
                                         //console.log('filmo.cod'+filmo.cod)
                                     }}/>
                                <p>{filmo.name}<br/>{filmo.publicRelease}</p>
                            </div>
                        </>
                    }))
                    setfilmList(tmp)
                })
        }
        if (props.section === 'actor') {
            fetchFilmDataActor(props.id)
            FilmList(props.id, 'actor/credits')
        } else {
            fetchFilmDataDirector(props.id);
            FilmList(props.id, 'director/movies')
        }


    }, []);
    let imageSrc: string;
    if (memberInfo !== undefined) {
        imageSrc = memberInfo.image !== 'bnVsbA=='  && memberInfo.image !== '' ? `data:image/jpeg;base64,${memberInfo.image}` : 'src/assets/profile-placeholder-cropped.png';
    }
    return memberInfo !== undefined ? (
        <>
            <div className={'artist-info-container'}>
                <div className={'previous-page'}>
                    <button onClick={() => {
                        props.setView({'view': props.view.preView, 'preView': props.view.view})}}>
                        <img className='icon' src='src/assets/arrow-left-solid.svg'
                             title={'Go back'}/>
                    </button>
                </div>
                <div className={'artist-info'}>
                    <img className={'big-poster'} src={imageSrc} alt={memberInfo.name + ' photo'}/>
                    <div className={'bio-info-container'}>
                        <p id={'name'}>{memberInfo.name}</p>
                        <p id={'birth-date'}>Born {memberInfo.date_birth}</p>
                        <p id={'bio'}>{memberInfo.description}</p>
                        {sessionStorage.getItem('role') === "true" &&
                            (<>
                                <img id={'edit-member'} src={'src/assets/pen-solid.svg'} onClick={() => props.setView({
                                'view': 'modify-member-' + props.section + '?' + props.id,
                                'preView': props.view.view
                                })} alt={'Edit icon'}>
                                </img>
                            </>)
                        }
                    </div>
                </div>
                <div className={'filmography'}>
                    <p id={'filmography'}>Filmography</p>
                    <div className={'filmography-list'}>
                        {filmList}
                    </div>
                </div>
            </div>
        </>

    ) : (
        <p>500 server error</p>
    )
}
export default CastMemberInfo;