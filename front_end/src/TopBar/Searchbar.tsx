import { ChangeEventHandler } from "react";
import "./Searchbar.css"

interface searchTerm {
    value: string,
    searchHandler: ChangeEventHandler,
    placeholder: string
}
const SearchBar = (props: searchTerm) => {
    return (
        <input
            className={'search-bar'}
            type="search"
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.searchHandler}>
        </input>
    )
}

export default SearchBar;