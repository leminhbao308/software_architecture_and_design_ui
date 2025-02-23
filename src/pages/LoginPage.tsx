import {Typography} from "antd";
import logo from "../assets/devicer-black.png";
import {Link} from "react-router-dom";
import {useState} from "react";

const LoginPage = () => {
    const {Title} = Typography;

    const [username, setUsername] = useState("");                       //  username or email
    const [password, setPassword] = useState("");                       //  password
    const [isRememberSession, setRememberSession] = useState(false);    //  true is remember, false is not

    const [validated, setValidated] = useState(false);                  //  check form validation

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

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;

        if (form.checkValidity() === false) {
            e.stopPropagation();
        }

        setValidated(true);
    }

    function handleGoogleLogin() {
        // TODO: Implement login function with google
        console.log("login with google")
    }

    return (
        <div className={"container"}>
            <div className={"row min-vh-100 align-items-center"}>
                <div className={"col-6"}>
                    <div className={"d-flex flex-column justify-content-center align-items-center"}>
                        <Title>Welcome to</Title>
                        <img
                            width={"80%"} src={logo} alt={"logo"}
                            className={"d-flex justify-content-center align-items-center"}
                        />
                    </div>
                </div>

                <div className={"col-6"}>
                    <form
                        className={
                            `d-flex flex-column justify-content-center align-items-center needs-validation 
                            ${validated ? "was-validated" : ""}`
                        }
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <div className={"card shadow-lg w-100 h-50 p-2 text-center px-3"}>
                            <div className={"h3 my-4"}>Đăng Nhập</div>

                            <div className="mb-3 text-start">
                                <label htmlFor="username" className="form-label fs-6 fw-light">Username hoặc email *</label>
                                <input type="text" className="form-control rounded-5" required
                                       id="username" value={username} onChange={onValueChange}
                                />
                                <div className="invalid-feedback">
                                    Username là bắt buộc!
                                </div>
                            </div>

                            <div className="mb-3 text-start">
                                <label htmlFor="password" className="form-label fs-6 fw-light">Mật khẩu *</label>
                                <input type="password" className="form-control rounded-5" required
                                       id="password" value={password} onChange={onValueChange}
                                />
                                <div className="invalid-feedback">
                                    Mật khẩu là bắt buộc!
                                </div>
                            </div>

                            <div className="mb-3 d-flex justify-content-between fs-6">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="rememberMe"
                                           checked={isRememberSession} onChange={onValueChange}
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Nhớ phiên đăng nhập
                                    </label>
                                </div>
                                <Link to={"/forgot-password"} className="text-decoration-none">Quên mật khẩu</Link>
                            </div>

                            <div className="mb-2 d-flex justify-content-center fs-6">
                                <button type="submit" className="btn btn-outline-primary rounded-5 w-25">Đăng Nhập</button>
                            </div>

                            <div className="mb-5 d-flex justify-content-center fs-6">
                                <button
                                    type="button" className="btn btn-outline-primary rounded-5 w-75"
                                    onClick={handleGoogleLogin}
                                >
                                    <i className="bi bi-google mx-2"></i>
                                    Đăng Nhập Với Tài Khoản Google
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
