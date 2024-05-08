import "./TopBar.css";
import {FC} from "react";
import Search from "./Search.tsx";

interface ViewI {
    view: string,
    preView: string
}
interface TopBarPropsI {
    setLogged: (value: boolean) => void,
    view: ViewI,
    setView: (value: ViewI) => void
}
interface loginI {
    operation: string;
    token: string;
    success: boolean;
    error: boolean;
    errorMessage: string;
}

export const TopBar: FC<TopBarPropsI> = ({ setLogged, view, setView }) => {
    return (
        <section className="topbar">
        <h1>FakerBoxd</h1>
        <nav className="topmenu">
            <Search setView={setView} view={view}/>
            {view.view === "films" ? (
                    <div className="user" onClick={() => {setView({'view':'user','preView':view.view})}}>
                        <img src={'src/assets/user.png'}/>
                    </div>
                ) : (
                <div className="home" onClick={() => {
                    setView({'view':'films','preView':'user'})
                }}>
                    <img src={'src/assets/home.png'}/>
                </div>
            )
            }


            <div className="logout pulsante" onClick={(e) => {
                    e.preventDefault();
                    fetch("http://localhost:8080/Progetto_Tweb/logout", {
                        method: 'GET',
                        headers: {
                            "token": "tok $" + sessionStorage.getItem("token"),
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((value) => value.json())
                        .then((data: loginI) => {
                            console.log(data)
                        }).catch((e)=>console.error(e))
                        .finally(()=> {
                            sessionStorage.removeItem('token')
                            setLogged(false);
                        })
                }}>Logout
                </div>
        </nav>
    </section>);
}