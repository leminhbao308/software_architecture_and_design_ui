import React, {ReactNode, useEffect, useState} from "react";
import UserContext from "./UserContext";
import {UserType} from "../types/UserType.ts";
import UserService from "../services/user/UserService.ts";
import {clearToken, getAccessToken, getRefreshToken, setTokens} from "../utils/tokenUtils.ts";
import LoginService from "../services/auth/LoginService.ts";

interface UserProviderProps {
    children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [userId, setUserId] = useState<string>("");
    const [userInfo, setUserInfo] = useState<UserType|undefined>();
    const token = getAccessToken();
    const refreshToken = getRefreshToken();

    // Check for existing token on component mount
    useEffect(() => {
        const loadUserData = async () => {
            if (token) {
                try {
                    const getUserInfo = await UserService.getUserInfo(token);
                    setUserId(getUserInfo.data.sub);
                    setUserInfo(getUserInfo.data);
                } catch (error) {
                    try {
                        const newTokenResponse = await LoginService.refreshToken(refreshToken);

                        setTokens(
                            newTokenResponse.data.access_token,
                            newTokenResponse.data.refresh_token,
                        )

                        const getUserInfo = await UserService.getUserInfo(token);
                        setUserId(getUserInfo.data.sub);
                        setUserInfo(getUserInfo.data);
                    } catch (err) {
                        console.error("Failed to load user data:", error);
                        console.error("Failed to refresh token:", err);
                        // Optionally clear invalid tokens
                        clearToken();
                    }
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
