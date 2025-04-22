import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AssetsConstant from "../consts/AssetsConstant";

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?name=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
                <img src={AssetsConstant.SEARCH_ICON} alt="search icon" />
            </button>
        </form>
    );
};

export default SearchInput;
