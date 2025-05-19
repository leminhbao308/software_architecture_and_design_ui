import { jwtDecode } from "jwt-decode";

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

export const isAdmin = (): boolean => {
    const token =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

    if (!token) return false;

    try {
        const decoded: any = jwtDecode(token);
        const roles: string[] =
            decoded?.resource_access?.["tmdt-back-end"]?.roles || [];

        return roles.includes("admin");
    } catch (err) {
        console.error("Token decode failed:", err);
        return false;
    }
};

