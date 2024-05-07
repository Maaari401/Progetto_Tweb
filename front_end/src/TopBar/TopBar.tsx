import "./TopBar.css";
import {FC} from "react";

interface TopBarPropsI {
    setLogged: (value: boolean) => void,
    view: string,
    setView: (value: string) => void
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
            <h1>FakerBoxD</h1>
            <nav className="topmenu">
                {view === "films" ? (
                    <div className="user-button" onClick={() => {setView("user")}}>
                        <img id="home" className="icon" src="src/assets/user-solid.svg" alt="Profile"
                             title={'Profile'}/>
                    </div>
                ) : (
                    <div className="home-button" onClick={() => {
                        setView("films")
                    }}>
                        <img id="home" className="icon" src="src/assets/house-solid.svg" alt="Home" title={'Home'}/>
                        {/*<svg id="home" src={'src/assets/house-solid.svg'}/>*/}
                    </div>
                )}

                <div className="logout-button" onClick={(e) => {
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
                            setLogged(false);
                            console.log(data);
                            sessionStorage.removeItem('token');
                        });
                }}>
                    <img id="home" className="icon" src="src/assets/right-from-bracket-solid.svg" alt="Logout"
                         title={'Logout'}/>
                </div>
            </nav>
        </section>);
}