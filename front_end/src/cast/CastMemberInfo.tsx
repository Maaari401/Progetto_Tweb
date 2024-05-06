import {FC, useEffect, useState} from "react";
import './CastMemberInfo.css'
interface infoPageI{
    id: number,
    section: string
}
interface castMemberInfoPropsI{
    id: number,
    section: string,
    setBack: (value: infoPageI) => void
}
interface MemberInfoI{
    id: number,
    name: string,
    date_birth: string,
    desc: string,
    image: string
}
interface MemberI{
    id: number,
    name: string,
    date_birth: string,
    desc: string,
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

const CastMemberInfo: FC<castMemberInfoPropsI> = (data: castMemberInfoPropsI) => {

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
                            <div className={'image-container'} onClick={() => {console.log('filmo.cod'+filmo.cod)
                                }}>
                                <img src={`data:image/jpeg;base64,${filmo.cover}`} className={'centered-image'}/>
                                <p>{filmo.name} - {filmo.publicRelease}</p>
                            </div>
                        </>
                    }))
                    setfilmList(tmp)
                })
        }
        if (data.section === 'actor') {
            fetchFilmDataActor(data.id)
            FilmList(data.id, 'actor/credits')
        } else {
            fetchFilmDataDirector(data.id);
            FilmList(data.id, 'director/movies')
        }


    }, []);
    return memberInfo !== undefined ?(
        <>
            <button onClick={()=> {
                data.setBack({'id': -1,'section':''})
            }}>BACK</button><br/>
            <div className={'image-container'}>
                <img src={`data:image/jpeg;base64,${memberInfo.image}`} className={'centered-image'} alt={memberInfo.name+'cover'}/>
                <p>{memberInfo.name} - {memberInfo.date_birth}</p>
                <p>{memberInfo.desc}</p>
            </div>
            <div className={'films'}>
                {filmList}
            </div>
        </>

    ):(
        <p>500 server error</p>
    )
}
export default CastMemberInfo;