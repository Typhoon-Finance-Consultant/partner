import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostLoginLayout from './Layouts/PostLoginLayout';
import AuthGuard from './components/Auth/AuthGuard';
import Profile from './pages/Profile';
import Loans from './pages/Loans';
import Invoices from './pages/Invoices';
import LoanDetails from './pages/LoanDetails';
import InvoiceDetails from './pages/InvoiceDetails';
import CreateLead from './pages/CreateLead';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import UpdateProfile from './pages/UpdateProfile.jsx';
import Notfound from './pages/Notfound.jsx';
import { setNavigateFunction } from './services/axiosConfig';

// Component to set up navigation
const NavigationSetup = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set the navigate function for use in axios interceptors
        setNavigateFunction(navigate);
    }, [navigate]);

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <NavigationSetup>
                <Routes>
                    <Route path="/">
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/reset-password" element={<Login />} />

                        <Route path="" element={<AuthGuard />}>
                            <Route path="/" element={<Dashboard />} index />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/loans" element={<Loans />} />
                            <Route
                                path="/loan-details/:loanID"
                                element={<LoanDetails />}
                            />

                            <Route path="/invoices" element={<Invoices />} />
                            <Route
                                path="/invoice-details/:invoiceID"
                                element={<InvoiceDetails />}
                            />
                            <Route path="/create-lead">
                                <Route path="" element={<CreateLead />} />
                                <Route
                                    path=":leadID"
                                    element={<CreateLead />}
                                />
                            </Route>
                            <Route
                                path="/update-password"
                                element={<UpdatePassword />}
                            />
                            <Route
                                path="/update-profile"
                                element={<UpdateProfile />}
                            />
                        </Route>
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        <Route
                            path="/reset-password/:token"
                            element={<ForgotPassword />}
                        />

                        <Route path="*" element={<Notfound />} />
                    </Route>
                </Routes>
            </NavigationSetup>
        </BrowserRouter>
    );
}

export default App;
