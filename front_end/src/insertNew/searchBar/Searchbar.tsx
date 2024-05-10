import { ChangeEventHandler } from "react";
import styles from "./Searchbar.module.css"

interface searchTerm {
    value: string,
    searchHandler: ChangeEventHandler,
    placeholder: string
}
const SearchBar = (props: searchTerm) => {
    return (
        <input
            className={styles.searchBar}
            type="search"
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.searchHandler}>

        </input>
    )
}

export default SearchBar;