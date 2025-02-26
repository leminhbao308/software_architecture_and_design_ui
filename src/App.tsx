import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import Header from "./components/layouts/header.tsx";

function App() {
  return (
    <div>
      <Header />
      {/*<Header/>*/}
      <Routes>
        {/*<Route path={"/"} element={<LandingPage/>}/>*/}
        <Route path={"login"} element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
