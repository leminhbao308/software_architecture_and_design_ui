import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import AppRoutes from "./routes/AppRoutes";
import {UserProvider} from "./context";
import 'antd/dist/reset.css';
import CategoryProvider from "./context/CategoryProvider.tsx";
import CartProvider from "./context/CartProvider.tsx";

const App: React.FC = () => {
    return (
        <UserProvider>
            <CategoryProvider>
                <CartProvider>
                    <AppRoutes/>;
                </CartProvider>
            </CategoryProvider>
        </UserProvider>
    );
};

export default App;
