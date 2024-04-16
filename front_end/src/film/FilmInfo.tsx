import {FC, useEffect, useState} from "react";
import './filminfo.css'

interface FilmPropsI {
    cod: number
    setFilmShowed: (cod: number) => void
}
interface FilmDataI {
    cod: number,
    name: string,
    rate: number,
    release: string,
    cover: string,
    desc: string,
}


const FilmInfo: FC<FilmPropsI> = (props) =>{
    const [Elem, setElem] = useState<FilmDataI>({cod: 0, desc: "", cover: "", name: "", rate: 0, release: ""});
    useEffect(() => {
        const fetchFilm = async () =>{
            const response = await fetch('http://localhost:8080/Progetto_Tweb/film?id='+props.cod, {
                method: 'GET',
                headers: {
                    "token": `tok $${sessionStorage.getItem("token")}`
                }
            });
            const value = (await response.json()) as FilmDataI
            console.log(value)
            setElem(value)
        };
        fetchFilm();
    }, []);

    return (<>
            <div>
                <div className={'image-container'}> <img className={'centered-image'} src={`data:image/jpeg;base64,${Elem.cover}`}/></div>
                <p>Movie name: {Elem.name}</p>
                <p>Description: {Elem.desc}</p>
                <p>release date: {Elem.release}</p>
            </div>
            <button onClick={() => {
                props.setFilmShowed(0)
            }
            }>BACK</button>

        </>
    )
};

export default FilmInfo;