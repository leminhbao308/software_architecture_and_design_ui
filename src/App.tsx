import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import Header from "./components/layouts/header.tsx";
import SignUpPage from "./pages/signupPage.tsx";
import PathConst from "./consts/PathConst.ts";

function App() {
  const location = useLocation();
  return (
    <div>
      <Header />
      {/*<Header/>*/}
      <Routes>        
        {/*<Route path={"/"} element={<LandingPage/>}/>*/}
        <Route path={PathConst.LOGIN} element={<LoginPage />} />
        <Route path={PathConst.SIGNUP} element={<SignUpPage />} />
      </Routes>
    </div>
  );
}

export default App;
