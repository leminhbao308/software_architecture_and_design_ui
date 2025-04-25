import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AssetsConstant from "../consts/AssetsConstant";
import SignUpService from "../services/auth/SignUpService";
import PathConst from "../consts/PathConst";
import PasswordInput from "../components/PasswordInput";
import APIConst from "../consts/APIConst";

const SignUpPage = () => {
  const [username, setUsername] = useState(""); //  username
  const [firstName, setFirstName] = useState(""); // firstName
  const [lastName, setLastName] = useState(""); // lastName
  const [password, setPassword] = useState(""); //  password
  const [email, setEmail] = useState(""); //  email
  const [phone, setPhone] = useState(""); //  phone
  const [confirmPassword, setConfirmPassword] = useState(""); //  confirm password
  const [errorMessage, setErrorMessage] = useState(""); // handle throw error
  const [validated, setValidated] = useState(false); //  check form validation
  const [googleRegisterUrl, setGoogleRegisterUrl] = useState("");

  const navigate = useNavigate();

  // Fetch Google registration URL when component mounts
  useEffect(() => {
    const fetchGoogleRegisterUrl = async () => {
      try {
        const response = await fetch(`${APIConst.API_CONTEXT}/auth/google/register-url`);
        if (response.ok) {
          const url = await response.text();
          setGoogleRegisterUrl(url);
        } else {
          console.error("Failed to fetch Google registration URL");
        }
      } catch (error) {
        console.error("Error fetching Google registration URL:", error);
      }
    };

    fetchGoogleRegisterUrl();
  }, []);

  function onValueChange(e) {
    const { id, value } = e.target;

    switch (id) {
      case "username":
        setUsername(value);
        break;
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
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

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setValidated(true);
    }

    try {
      const response = await SignUpService.signup(
          username,
          firstName,
          lastName,
          password,
          email,
          phone
      );

      if (response.data.status) {
        setTimeout(() => {
          setUsername("");
          setFirstName("");
          setLastName("");
          setPassword("");
          setConfirmPassword("");
          setEmail("");
          setPhone("");
          navigate(PathConst.LOGIN);
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!" + error
      );
      console.error(errorMessage);
    }
  }

  function handleGoogleSignup() {
    // Redirect to Google OAuth registration URL
    if (googleRegisterUrl) {
      window.location.href = googleRegisterUrl;
    } else {
      setErrorMessage("Không thể kết nối với dịch vụ đăng ký Google. Vui lòng thử lại sau.");
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
                <label htmlFor="firstName" className="form-label fs-6 fw-regular">
                  FirstName <span className="text-primary">*</span>
                </label>
                <input
                    type="text"
                    className="form-control form-control--custom"
                    required
                    id="firstName"
                    value={firstName}
                    onChange={onValueChange}
                />
                <div className="invalid-feedback">firstName là bắt buộc!</div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label fs-6 fw-regular">
                  LastName <span className="text-primary">*</span>
                </label>
                <input
                    type="text"
                    className="form-control form-control--custom"
                    required
                    id="lastName"
                    value={lastName}
                    onChange={onValueChange}
                />
                <div className="invalid-feedback">LastName là bắt buộc!</div>
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
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="  "
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
                <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="  "
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

export default SignUpPage;
