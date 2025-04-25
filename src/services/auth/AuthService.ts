export const isAuthenticated = (): boolean => {
    return !!(
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token")
    );
};

export const logout = (): void => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("access_token");
};

