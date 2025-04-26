import {createContext} from "react";
import {UserContextType} from "../types/UserContextType";

// Tạo context với giá trị mặc định là undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
