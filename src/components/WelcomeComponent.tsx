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
    </div>
  );
};

export default WelcomeComponent;
