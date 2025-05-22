import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import PathConst from "../consts/PathConst";
import LoginService from "../services/auth/LoginService";
import AssetsConstant from "../consts/AssetsConstant";
import PasswordInput from "../components/PasswordInput";
import UserService from "../services/user/UserService";
import {useUserContext} from "../context";
import GoogleAuthService from "../services/user/GoogleAuthService.ts";

const LoginPage = () => {
    const [username, setUsername] = useState(""); //  username or email
    const [password, setPassword] = useState(""); //  password
    const [isRememberSession, setRememberSession] = useState(false); //  true is remember, false is not
    const [errorMessage, setErrorMessage] = useState(""); // handle throw error
    const [successMessage, setSuccessMessage] = useState(""); // handle success messages
    const [validated, setValidated] = useState(false); //  check form validation
    const {setUserId, setUserInfo} = useUserContext();
    const [googleLoginUrl, setGoogleLoginUrl] = useState(""); // URL for Google login

    const navigate = useNavigate();
    const location = useLocation();

    // Check for success message from registration
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message after showing it
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Fetch Google login URL when component mounts
    useEffect(() => {
        const fetchGoogleLoginUrl = async () => {
            try {
                const url = await GoogleAuthService.getLoginUrl();
                setGoogleLoginUrl(url);
            } catch (error) {
                console.error("Error fetching Google login URL:", error);
                setErrorMessage("Không thể kết nối với dịch vụ đăng nhập Google.");
            }
        };

        fetchGoogleLoginUrl();
    }, []);

    function onValueChange(e) {
        const {id, value, type, checked} = e.target;

        if (type === "checkbox") {
            setRememberSession(checked);
        } else {
            switch (id) {
                case "username":
                    setUsername(value);
                    break;
                case "password":
                    setPassword(value);
                    break;
                default:
                    break;
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);

        try {
            const response = await LoginService.login(username, password);
            // console.log("Đăng nhập thành công, token:", response.access_token);

            // Lưu token vào localStorage nếu "Nhớ phiên đăng nhập" được chọn
            if (response.data.access_token && response.data.refresh_token) {
                const getUserInfo = await UserService.getUserInfo(
                    response.data.access_token
                );

                if (isRememberSession) {
                    localStorage.setItem("access_token", response.data.access_token);
                    localStorage.setItem("refresh_token", response.data.refresh_token);
                } else {
                    sessionStorage.setItem("access_token", response.data.access_token);
                    sessionStorage.setItem("refresh_token", response.data.refresh_token);
                }

                setUserId(getUserInfo.data.sub);
                setUserInfo(getUserInfo.data);

                // Chuyển hướng sau khi đăng nhập thành công
                navigate(PathConst.HOME);
            }
        } catch (error) {
            setErrorMessage(
                "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!"
            );
            console.error(error);
        }
    }

    function handleGoogleLogin() {
        // Redirect to Google OAuth URL
        if (googleLoginUrl) {
            window.location.href = googleLoginUrl;
        } else {
            setErrorMessage("Không thể kết nối với dịch vụ đăng nhập Google. Vui lòng thử lại sau.");
        }
    }

    return (
        <div className={"container"}>
            <div className={"row min-vh-100"}>
                <div className={"col-7"}>
                    <div className={"intro"}>
                        <span>Welcome To</span>
                        <img
                            src={AssetsConstant.BLACK_LOGO}
                            alt={"logo"}
                            className={"d-flex justify-content-center align-items-center"}
                        />
                    </div>
                </div>

                <div className={"col-5 d-flex  align-items-center"}>
                    <form
                        className={`form needs-validation ${
                            validated ? "was-validated" : ""
                        }`}
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <div className={"form-title"}>Đăng nhập</div>

                        {successMessage && (
                            <div className="alert alert-success" role="alert">
                                {successMessage}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username" className="form-label fs-6 fw-regular">
                                Username hoặc email <span className="text-primary">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control form-control--custom"
                                required
                                id="username"
                                value={username}
                                onChange={onValueChange}
                            />
                            <div className="invalid-feedback">Username là bắt buộc!</div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label fs-6 fw-regular">
                                Mật khẩu <span className="text-primary">*</span>
                            </label>

                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="  "
                            />

                            <div className="invalid-feedback">Mật khẩu là bắt buộc!</div>
                        </div>

                        <div className="mb-3 d-flex justify-content-between fs-6">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={isRememberSession}
                                    onChange={onValueChange}
                                />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    Nhớ phiên đăng nhập
                                </label>
                            </div>
                            <Link
                                to={PathConst.FORGOT_PASSWORD}
                                className="text-decoration-none"
                            >
                                Quên mật khẩu
                            </Link>
                        </div>

                        <div className="mb-3 d-flex justify-content-center fs-6">
                            <button
                                type="submit"
                                className="btn btn-outline-primary rounded-5 w-50"
                            >
                                Đăng Nhập
                            </button>
                        </div>

                        <div className="mb-3 d-flex justify-content-center fs-6">
                            <hr className={"w-25 me-1"}/>
                            Hoặc
                            <hr className={"w-25 ms-1"}/>
                        </div>

                        <div className="mb-5 d-flex justify-content-center fs-6">
                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-5 w-50"
                                onClick={handleGoogleLogin}
                            >
                                <i className="bi bi-google mx-2"></i>
                                Đăng Nhập Với Google
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
