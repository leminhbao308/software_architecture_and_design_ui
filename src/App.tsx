import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context";

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppRoutes />;
    </UserProvider>
  );
};

export default App;
