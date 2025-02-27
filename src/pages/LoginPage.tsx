import logo from "../assets/devicer-black.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import PathConst from "../consts/PathConst";

const LoginPage = () => {
  const [username, setUsername] = useState(""); //  username or email
  const [password, setPassword] = useState(""); //  password
  const [isRememberSession, setRememberSession] = useState(false); //  true is remember, false is not

  const [validated, setValidated] = useState(false); //  check form validation

  function onValueChange(e) {
    const { id, value, type, checked } = e.target;

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
    console.log("login with google");
  }

  return (
    <div className={"container"}>
      <div className={"row min-vh-100"}>
        <div className={"col-7"}>
          <div className={"intro"}>
            <span>Welcome To</span>
            <img
              src={logo}
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
              <input
                type="password"
                className="form-control form-control--custom"
                required
                id="password"
                value={password}
                onChange={onValueChange}
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
              <hr className={"w-25 me-1"} />
              Hoặc
              <hr className={"w-25 ms-1"} />
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
