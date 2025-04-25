import React, {useState, ReactNode, useEffect} from "react";
import UserContext from "./UserContext";
import {UserType} from "../types/UserType.ts";
import UserService from "../services/user/UserService.ts";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [userId, setUserId] = useState<string>("");
    const [userInfo, setUserInfo] = useState<UserType|undefined>();

    // Check for existing token on component mount
    useEffect(() => {
        const loadUserData = async () => {
            const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
            if (token) {
                try {
                    const getUserInfo = await UserService.getUserInfo(token);
                    setUserId(getUserInfo.data.sub);
                    setUserInfo(getUserInfo.data);
                } catch (error) {
                    console.error("Failed to load user data:", error);
                    // Optionally clear invalid tokens
                    localStorage.removeItem("access_token");
                    sessionStorage.removeItem("access_token");
                }
            }
        };

        loadUserData();
    }, []);

    return (
        <UserContext.Provider
            value={{
                userId,
                userInfo,
                setUserId,
                setUserInfo
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
