import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
    return (
        <BrowserRouter>
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
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                            index
                        />
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
                            <Route path=":leadID" element={<CreateLead />} />
                        </Route>
                        <Route
                            path="/update-password"
                            element={<UpdatePassword />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
