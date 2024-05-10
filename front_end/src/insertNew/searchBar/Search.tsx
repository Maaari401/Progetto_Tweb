import {ChangeEventHandler, FC, useEffect, useState} from "react";

import styles from "./Search.module.css";
import SearchBar from "./Searchbar";
import {FilmI} from "../../data/datas.ts";

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
interface searchProps{
    idMain: number,
    values: boolean[],
    setCodMember: (value: (((prevState: number) => number) | number)) => void
}


interface CreditsDataI{
    actor: ActorBaseI[],
    crew: CrewDataI[]
}
interface ActorBaseI{
    id: number,
    character: string
}
interface CrewDataI {
    [department: string]: CastBaseI[];
}

interface CastBaseI{
    id: number,
    role: string,
    department: string
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
                let allDataRet: SearchData[] = [];

                for (let i = 0; i < urls.length; i++) {
                    if(props.values[i]) {
                        const response = await fetch(urls[i], {
                            method: 'GET',
                            headers: {
                                "token": `tok $${sessionStorage.getItem("token")}`
                            }
                        });
                        const data = await response.json();

                        if (i === 0) {
                            allData = [...allData, ...data.map((item: FilmI) => ({
                                id: item.cod,
                                name: item.name,
                                typo: 'film'
                            }))];
                        } else {
                            allData = [...allData, ...data.map((item: MemberI) => ({
                                id: item.id,
                                name: item.name,
                                typo: i === 1 ? 'actor' : 'director'
                            }))];
                        }
                    }
                }
                try{


                    if (!props.values[0] && props.values[1] && props.values[2]){ //Caso per rimozione attori e direttori
                        const response = await fetch('http://localhost:8080/Progetto_Tweb/film/credits?cod='+props.idMain, {
                            method: 'GET',
                            headers: {
                                "token": `tok $${sessionStorage.getItem("token")}`
                            }
                        });
                        const data = await response.json() as CreditsDataI;
                        console.log(data)
                        const allIds: SearchData[] = [];

                        const actors: SearchData[] = [];
                        data.actor.map((a: string[]) => actors.push({
                            'id':parseInt(a[0]),
                            'name':'',
                            'typo':'actor'
                        }));

                        const tmp: SearchData[] = [];
                        for (const crewData in data.crew) {
                            const arr = data.crew[crewData]
                            console.log(crewData)
                            console.log(arr)
                            arr.map((directorData: string[]) =>{
                                tmp.push({
                                    'id':parseInt(directorData[0]),
                                    'name':'',
                                    'typo':'director'
                                })
                            })
                        }
                        allIds.push(...actors);
                        allIds.push(...tmp);
                        console.log(allIds.length);
                        console.log(allData.length)
                        allDataRet = allData.filter(value => !allIds.some(item => item.id === value.id && item.typo === value.typo));
                        console.log(allDataRet.length)
                    }else if(props.values[0] && !props.values[1]){
                        const response = await fetch('http://localhost:8080/Progetto_Tweb/' + (props.values ? 'actor/credits':'director/movies' )+'?id='+props.idMain, {
                            method: 'GET',
                            headers: {
                                "token": `tok $${sessionStorage.getItem("token")}`
                            }
                        });
                        const data = await response.json() as number[];
                        const allIds: SearchData[] = data.map((val) => {
                            return {
                                'id':val,
                                'name':'',
                                'typo':'film'
                            }
                        })

                        allDataRet = allData.filter(value => !allIds.some(item => item.id === value.id && item.typo === value.typo));

                    }
                }catch (e){
                    allDataRet.push(...allData)
                }



                return allDataRet;
            }

            const data = await getAllData();
            console.log(data);
            setContentData(data)
        } catch (error) {
            console.log(error)
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
                            item.name.toLowerCase().startsWith(searchContentData.toLowerCase())
                    ).map((item, index) => <li key={index} onClick={()=>{
                        props.setCodMember(item.id);
                    }}>{item.name} <span className={styles.typo}>{item.typo}</span></li>)
                    }
                </ul>
            )}
        </div>
    </div>
)
}

export default Search;
