// les imports importants
 import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./pages/CustomerPage";
import CustomersPage from "./pages/CustomersPage";
import HomePage from './pages/HomePage';
import InvoicePage from "./pages/InvoicePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthAPI from "./services/AuthAPI";


AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated);

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>

        <HashRouter>
            
            <NavbarWithRouter />

            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage} />
                    <Route path="/register" component={RegisterPage} />
                    <PrivateRoute path="/customers/:id" component={CustomerPage} />
                    <PrivateRoute path="/customers" component={CustomersPage} />
                    <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                    <PrivateRoute path="/invoices" component={InvoicesPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>

        </HashRouter>
    </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);
