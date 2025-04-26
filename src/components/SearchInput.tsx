import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Input} from "antd";
import debounce from "lodash/debounce";
import {SearchOutlined} from "@ant-design/icons";

const {Search} = Input;

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const performSearch = (query: string) => {
        if (query.trim()) {
            navigate(`/search?name=${encodeURIComponent(query.trim())}`);
        } else {
            // Navigate to home route if search query is empty
            navigate('/');
        }
    };

    // Create a debounced version of the search function
    // This will wait 1000ms after the user stops typing before searching
    const debouncedSearch = debounce(performSearch, 1000);

    // Cancel the debounced function when component unmounts
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    // We still allow manual search on Enter key or button click
    const handleSearch = (value: string) => {
        performSearch(value);
    };

    const handleBlur = () => {
        setSearchQuery("");
    };

    return (
        <Search
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChange={handleChange}
            onSearch={handleSearch}
            enterButton={<SearchOutlined/>}
            allowClear
            size={"large"}
            style={{width: '50%'}}
            onBlur={handleBlur}
        />
    );
};

export default SearchInput;
