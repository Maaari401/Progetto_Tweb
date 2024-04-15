import {FC, useEffect, useState} from "react";
import "./films.css"

interface filmI{
    cod: number
    name: string,
    rate: number
    release: string,
    desc: string,
}

interface imageI{
    image: string
}


const Film: FC<filmI> = (props) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/Progetto_Tweb_war/film/cover?cod=${props.cod}`, {
                    method: 'GET',
                    headers: {
                        "token": `tok $${sessionStorage.getItem("token")}`
                    }
                });
                const data: imageI = await response.json();
                setImageSrc(`data:image/jpeg;base64,${data.image}`);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchData();
    }, [props.cod]);
    return (
        <div key={props.cod} onClick={() => console.log("clicked")}>
            <img key={props.cod} src={imageSrc  } alt="Film Cover" />
            <span>{props.name}</span>
        </div>
    );
};


export const Films: FC = () => {
    const [films, setFilms] = useState<filmI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1)
    const [filmListElem, setFilmListElem] = useState<JSX.Element[]>([])

    const fetchData = () =>{
        setLoading(true);
        fetch("http://localhost:8080/Progetto_Tweb_war/film", {
            method: 'GET',
            headers: {
                "token" : "tok $"+sessionStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then((data: filmI[]) => {
                setLoading(false);
                setFilms(data);
                setPage(page)
            })
            .catch(error => {
                console.error('Error fetching films:', error);
                setLoading(false);
            }
            );
    }
    useEffect(() => {

        const elem = films.slice((page-1)*20, (page)*20).map((f) =>
            <Film key={f.cod}
                name={f.name}
                desc={f.desc}
                release={f.release}
                rate={f.rate}
                cod={f.cod}
            />
        );
        setFilmListElem(elem)
    }, [page, films]);


    return (
        <div id="film-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                {films.length === 0 && <button onClick={fetchData}> fetchData</button>}
                    <div id="image-container">{filmListElem}</div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10px'
                }}>
                    <button onClick={() => {
                        if (page != 1) setPage(page - 1)
                    }}> Previus
                    </button>
                    <button onClick={() => {
                        setPage(page + 1)
                    }}> Next
                    </button>
                </div>
                </>
            )}
        </div>
    );
};
