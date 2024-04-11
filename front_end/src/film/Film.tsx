import {FC, useEffect, useState} from "react";
import "./films.css"

interface filmI{
    name: string,
    desc: string,
    image: string,
    relase: Date,
    rate: number
}

const Film: FC<{name: string, image: string, relase: Date}> = (props) => {
    return (
    <div
        onClick={() => console.log("clicked")}>
        <img src={props.image}/>
        <span>{props.name}</span>
        <span>{props.relase.getDate()}</span>
    </div>
    );
}


interface FilmsI{
    username: string,

}

export const Films: FC<FilmsI> = ({username}) => {
    const [films, setFilms] = useState<filmI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = () => {
        setLoading(true);
        fetch("http://localhost:8080/Progetto_Tweb_war/film", {

        })
            .then(response => response.json())
            .then((data: filmI[]) => {
                setFilms(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching films:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Fetch data when component mounts (initially)
        fetchData();
    }, []);

    const filmListElem = films.map((f, index) => (
        <Film key={index} name={f.name} image={f.image} relase={f.relase} />
    ));

    return (
        <div id="film-container">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <button onClick={fetchData}>Fetch Films</button>
                    <div id="image-container">{filmListElem}</div>
                </>
            )}
        </div>
    );
};
