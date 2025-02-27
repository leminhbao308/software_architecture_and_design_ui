import logo from "../assets/devicer-black.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import AssetsConstant from "../consts/AssetsConstant";

const SignUpPage = () => {
  const [username, setUsername] = useState(""); //  username
  const [password, setPassword] = useState(""); //  password
  const [email, setEmail] = useState(""); //  email
  const [phone, setPhone] = useState(""); //  phone
  const [confirmPassword, setConfirmPassword] = useState(""); //  confirm password

  const [validated, setValidated] = useState(false); //  check form validation

  function onValueChange(e) {
    const { id, value } = e.target;

    switch (id) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      default:
        break;
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

  function handleGoogleSignup() {
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
              src={AssetsConstant.BLACK_LOGO}
              alt={"logo"}
              className={"d-flex justify-content-center align-items-center"}
            />
          </div>
        </div>

        <div className={"col-5 d-flex  align-items-center"}>
          <form
            className={`form form-signup needs-validation ${
              validated ? "was-validated" : ""
            }`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className={"form-title"}>Đăng Ký</div>

            <div className="form-group">
              <label htmlFor="username" className="form-label fs-6 fw-regular">
                Username <span className="text-primary">*</span>
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
              <label htmlFor="email" className="form-label fs-6 fw-regular">
                Email <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control--custom"
                required
                id="email"
                value={email}
                onChange={onValueChange}
              />
              <div className="invalid-feedback">Email là bắt buộc!</div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label fs-6 fw-regular">
                Phone <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control--custom"
                required
                id="phone"
                value={phone}
                onChange={onValueChange}
              />
              <div className="invalid-feedback">Phone là bắt buộc!</div>
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

            <div className="form-group">
              <label
                htmlFor="confirmPassword"
                className="form-label fs-6 fw-regular"
              >
                Xác Nhận Mật khẩu <span className="text-primary">*</span>
              </label>
              <input
                type="password"
                className="form-control form-control--custom"
                required
                id="confirmPassword"
                value={confirmPassword}
                onChange={onValueChange}
              />
              <div className="invalid-feedback">
                Xác nhận mật khẩu là bắt buộc!
              </div>
            </div>

            <div className="mb-3 d-flex justify-content-end fs-6">
              <Link to={"/login"} className="text-decoration-none">
                Đã có tài khoản
              </Link>
            </div>

            <div className="mb-3 d-flex justify-content-center fs-6">
              <button
                type="submit"
                className="btn btn-outline-primary rounded-5 w-50"
              >
                Đăng Ký
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
                onClick={handleGoogleSignup}
              >
                <i className="bi bi-google mx-2"></i>
                Đăng Ký Với Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
