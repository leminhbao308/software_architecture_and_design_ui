import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context";
import UserService from "../services/user/UserService";
import PathConst from "../consts/PathConst";

const AuthCallbackPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { setUserId, setUserInfo } = useUserContext();

    useEffect(() => {
        const processAuthCallback = async () => {
            try {
                // Parse URL parameters
                const params = new URLSearchParams(location.search);
                const accessToken = params.get("access_token");
                const refreshToken = params.get("refresh_token");
                const registrationStatus = params.get("registration");
                const message = params.get("message");

                // Handle registration result
                if (registrationStatus !== null) {
                    if (registrationStatus === "true") {
                        setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
                        setTimeout(() => {
                            navigate("/login", {
                                state: { message: "Đăng ký thành công! Vui lòng đăng nhập." }
                            });
                        }, 2000);
                    } else {
                        setError(message || "Đăng ký thất bại. Vui lòng thử lại.");
                        setTimeout(() => {
                            navigate("/signup");
                        }, 3000);
                    }
                    setLoading(false);
                    return;
                }

                // Handle login result
                if (!accessToken || !refreshToken) {
                    throw new Error("Không nhận được token từ dịch vụ xác thực.");
                }

                // Save tokens based on the remember me preference (assuming we default to localStorage)
                localStorage.setItem("access_token", accessToken);
                localStorage.setItem("refresh_token", refreshToken);

                // Fetch user info with the new token
                const userInfoResponse = await UserService.getUserInfo(accessToken);
                if (userInfoResponse && userInfoResponse.data) {
                    setUserId(userInfoResponse.data.sub);
                    setUserInfo(userInfoResponse.data);
                    setSuccessMessage("Đăng nhập thành công!");
                    setTimeout(() => {
                        navigate(PathConst.HOME);
                    }, 1500);
                } else {
                    throw new Error("Không thể lấy thông tin người dùng.");
                }
            } catch (err) {
                console.error("Auth callback error:", err);
                setError(err.message || "Đã xảy ra lỗi trong quá trình xác thực.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } finally {
                setLoading(false);
            }
        };

        processAuthCallback();
    }, [location, navigate, setUserId, setUserInfo]);

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="text-center">
                {loading ? (
                    <>
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h2>Đang xử lý...</h2>
                    </>
                ) : error ? (
                    <>
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <p>Đang chuyển hướng...</p>
                    </>
                ) : (
                    <>
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                        <p>Đang chuyển hướng...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallbackPage;
