import CustomAlert from "./CustomAlert";
import {useEffect, useState, useRef} from "react";
// import { message } from 'antd';
import {useNavigate} from "react-router-dom";
import {Input} from "antd";
import debounce from "lodash/debounce";
import {SearchOutlined} from "@ant-design/icons";

const {Search} = Input;

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);

    const searchCountRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (!timerRef.current) {
            timerRef.current = setTimeout(() => {
                searchCountRef.current = 0;
                timerRef.current = null;
            }, 10000); // rút ngắn thời gian reset để test
        }

        if (searchCountRef.current >= 5) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            return;
        }

        searchCountRef.current += 1;
        performSearch(value);
    };

    const handleBlur = () => {
        setSearchQuery("");
    };

    return (
        <>
            {showAlert && <CustomAlert message="Bạn thao tác quá nhanh! Vui lòng chờ"/>}
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
        </>
    );
};

export default SearchInput;
