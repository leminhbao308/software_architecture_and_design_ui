// auth/tokenUtils.ts
export const getAccessToken = (): string => {
    return localStorage.getItem("access_token") || sessionStorage.getItem("access_token") || "";
};
