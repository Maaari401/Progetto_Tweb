    import {FC, useEffect, useState} from "react";
    import "./films.css"

    interface filmI{
        cod: number,
        name: string,
        rate: number,
        release: string,
        desc: string,
    }
    interface filmElemI{
        cod: number,
        name: string,
        rate: number,
        release: string,
        desc: string,
        setView: (cod: ViewI) => void,
        view: ViewI
    }

    interface imageI{
        image: string
    }
    interface ViewI {
        view: string,
        preView: string
    }

    const FILM_FOR_Page: number = 15;

    const Film: FC<filmElemI> = (props) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [imageSrc, setImageSrc] = useState<string>('');

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/Progetto_Tweb/film/cover?cod=${props.cod}`, {
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
            <>
                <div>
                    <div key={props.cod} onClick={()=>{props.setView({'view':'film?'+props.cod, 'preView':props.view.view})}}>
                        <img key={props.cod} src={imageSrc} alt="FilmList Cover" />
                        <p>{props.name}</p>
                    </div>
                    {sessionStorage.getItem('role') === 'true' ?
                        (<img src={'src/assets/icons8-matita-50.png'}
                                 style={{width: '15px', height: 'auto'}} onClick={() => {
                                /* TODO ADD ONCLICK EVENT TO MODIFY VALUES*/
                                props.setView({'view': 'modify-Film?' + props.cod, 'preView': props.view.view})
                            }}/>):(<></>)
                    }
                </div>
            </>
        );
    };


    interface FilmsProps {
        setView: (value: ViewI) => void
        view: ViewI
    }

    export const Films: FC<FilmsProps> = (props: FilmsProps) => {
        const [films, setFilms] = useState<filmI[]>([]);
        const [loading, setLoading] = useState<boolean>(false);
        const [page, setPage] = useState<number>(1);
        const [filmListElem, setFilmListElem] = useState<JSX.Element[]>([]);

        const fetchData = () => {
            setLoading(true);
            fetch("http://localhost:8080/Progetto_Tweb/film", {
                method: 'GET',
                headers: {
                    "token": "tok $" + sessionStorage.getItem("token")
                }
            })
                .then(response => response.json())
                .then((data: filmI[]) => {
                    setLoading(false);
                    setFilms(data);
                    setPage(page);
                })
                .catch(error => {
                    console.error('Error fetching films:', error);
                    setLoading(false);
                });
        };

        useEffect(() => {
            fetchData(); // Fetch film data
        }, []);

        useEffect(() => {
            const elem = films.slice((page-1)*FILM_FOR_Page, (page)*FILM_FOR_Page).map((f) =>
                <Film key={f.cod}
                      name={f.name}
                      desc={f.desc}
                      release={f.release}
                      rate={f.rate}
                      cod={f.cod}
                      setView={props.setView}
                      view={props.view}
                />
            );
            setFilmListElem(elem);
        }, [page, films]);

        return (
            <div id="film-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div id="image-container">{filmListElem}</div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px'
                        }}>

                            <button onClick={() => {
                                setPage(page - 1);
                            }} disabled={page === 1}> Previous
                            </button>

                            <button onClick={() => {
                                setPage(page + 1);
                            }} disabled={page === Math.ceil(films.length / FILM_FOR_Page)}>
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        );
    };
