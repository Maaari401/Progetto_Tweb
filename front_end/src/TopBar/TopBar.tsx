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


export const TopBar: FC<TopBarPropsI> = (props) => {
    return (
        <section className="topbar">
        <h1 onClick={()=>{props.setView({'view':'films','preView':'user'})}}>FakerBoxD</h1>
        <nav className="topmenu">
            <Search setView={props.setView} view={props.view}/>
            {props.view.view === "films" ? (
                    <div className="user-button" onClick={() => {props.setView({'view':'user','preView':props.view.view})}}>
                        <img className="icon" alt="Profile" src={'src/assets/user-solid.svg'} title={'Profile'}/>
                    </div>
                ) : (
                <div className="home-button" onClick={() => {
                    props.setView({'view':'films','preView':'user'})
                }}>
                    <img className="icon" src="src/assets/house-solid.svg" alt="Home" title={'Home'}/>
                </div>
            )
            }


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
                            console.log(data)
                        }).catch((e)=>console.error(e))
                        .finally(()=> {
                            sessionStorage.removeItem('token')
                            props.setLogged(false);
                        })
                }}>
                <img className="icon" src="src/assets/right-from-bracket-solid.svg" alt="Logout"
                         title={'Logout'}/>
                </div>
        </nav>
    </section>);
}