// auth/tokenUtils.ts
export const getAccessToken = (): string => {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || "";
};

export const getRefreshToken = (): string => {
    return localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token") || "";
};

export const setTokens = (token: string, refreshToken: string): void => {
    if (whereDataStored() === "local") {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
    } else if (whereDataStored() === "session") {
        sessionStorage.setItem("access_token", token);
        sessionStorage.setItem("refresh_token", refreshToken);
    }
}

export const clearToken = (): void => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");

    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("refresh_token");
}

const whereDataStored = (): string => {
    if (localStorage.getItem("access_token"))
        return "local"
    if (sessionStorage.getItem("access_token"))
        return "session"
    return "none"
}
