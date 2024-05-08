import {ChangeEventHandler, FC, useEffect, useState} from "react";

import styles from "./Search.module.css";
import SearchBar from "./Searchbar";
import { FilmI } from "../data/datas.ts";

interface MemberI {
    id: number,
    name: string,
    date_birth: string,
    desc: string
}

interface SearchData {
    id: number,
    name: string,
    typo: string
}
interface ViewI {
    view: string,
    preView: string
}
interface searchProps{
    setView: (value: ViewI) => void,
    view: ViewI
}
const MIN_INPUT_LENTH: number =  3


const Search: FC<searchProps> = (props: searchProps) => {
    const [contentData, setContentData] = useState<SearchData[]>([]);
    const [searchContentData, setSearchContentData] = useState<string>('');
    const [searchDataErr, setSearchDataErr] = useState<boolean>(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const getAllData = async (): Promise<SearchData[]> => {
                    const urls = [
                        'http://localhost:8080/Progetto_Tweb/film',
                        'http://localhost:8080/Progetto_Tweb/actor',
                        'http://localhost:8080/Progetto_Tweb/director'
                    ];

                    let allData: SearchData[] = [];

                    for (let i = 0; i < urls.length; i++) {
                        const response = await fetch(urls[i], {
                            method: 'GET',
                            headers: {
                                "token": `tok $${sessionStorage.getItem("token")}`
                            }
                        });
                        const data = await response.json();

                        if (i === 0) {
                            allData = [...allData, ...data.map((item: FilmI) => ({ id: item.cod, name: item.name, typo: 'film' }))];
                        } else {
                            allData = [...allData, ...data.map((item: MemberI) => ({ id: item.id, name: item.name, typo: i === 1 ? 'actor' : 'director' }))];
                        }
                    }

                    return allData;
                }

                const data = await getAllData();
                console.log(data);

                //if fetch works but there is a data mismatch, throw specialized error
                if (!data) { throw new Error("Unable to find data") }
                else { setContentData(data) }
            } catch (error) {
                //catches auto thrown and data mismatch errors
                console.log(error);
                setSearchDataErr(true)
            }
        }
        fetchData();
    }, [])

    const searchHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        setSearchContentData(e.currentTarget.value);
    }

    // Conditionally render data only if searchContentData length is at least 2
    const renderData = searchContentData.length >= MIN_INPUT_LENTH && !searchDataErr;

    return (
        <div className={styles.searchHolder}>
            <SearchBar
                value={searchContentData}
                placeholder={`Search by name`}
                searchHandler={searchHandler}
            />

            <div className={styles.searchData}>
                {searchDataErr && <h1 className={'errorMsg'}>Error loading data, please check URL or console for more details!</h1>}
                {renderData && ( // Conditionally render data
                    <ul>
                        {contentData.filter(item =>
                                item.name.toLowerCase().startsWith(searchContentData.toLowerCase()) ||
                                item.name.toLowerCase().startsWith(searchContentData.toLowerCase())
                            //(`${person.firstName} ${person.lastName}`).toLowerCase().startsWith(searchContentData.toLowerCase())
                        ).map((item, index) => <li key={index} onClick={()=>{
                            console.log('setView('+item.typo +'?' + item.id+')')
                            props.setView({'view':item.typo +'?' + item.id, 'preView':props.view.view})
                        }}>{item.name} <span className={styles.typo}>{item.typo}</span></li>)
                        }
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Search;
