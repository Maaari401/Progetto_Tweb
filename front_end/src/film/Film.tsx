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
            <img key={props.cod} src={imageSrc} alt="Film Cover" />
            <span>{props.name}</span>
        </div>
    );
};


export const Films: FC = () => {
    const [films, setFilms] = useState<filmI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchFilms = () => {
        console.log("sas")
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
            })
            .catch(error => {
                console.error('Error fetching films:', error);
                setLoading(false);
            });
    };

    const filmListElem = films.map((f) =>
        <Film
            name={f.name}
            desc={f.desc}
            release={f.release}
            rate={f.rate}
            cod={f.cod}
        />
    );

    return (
        <div id="film-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <button onClick={fetchFilms}>Fetch Films</button>
                    <div id="image-container">{filmListElem}</div>
                </>
            )}
        </div>
    );
};
