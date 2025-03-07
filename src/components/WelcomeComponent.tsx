import { Link } from "react-router-dom";
import PathConst from "../consts/PathConst";
import AssetsConstant from "../consts/AssetsConstant";
const WelcomeComponent = () => {
  return (
    <div className={"home-intro"}>
      <span>Welcome To</span>
      <Link to={PathConst.HOME}>
        <img
          src={AssetsConstant.BLACK_LOGO}
          alt={"logo"}
          className={"d-flex justify-content-center align-items-center"}
        />
      </Link>
      {/* <div className="notification">
        <div className="noti-status-icon">
          <img src={AssetsConstant.SUCCESS_ICON} alt="success icon" />
        </div>
        <div className="noti-message">Tên tài khoản hoặc email đã tồn tại!</div>
        <button className="notification-action">
          <img src={AssetsConstant.SUCCESS_CLOSE_ICON} alt="close icon" />
        </button>
      </div> */}
    </div>
  );
};

export default WelcomeComponent;
