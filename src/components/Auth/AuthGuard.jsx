import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '&/features/auth/authSlice';
import PostLoginLayout from '&/Layouts/PostLoginLayout';

const AuthGuard = () => {
    const user = useSelector(selectCurrentUser);
    console.log('Auth User____', user);
    const location = useLocation();
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <>
            <PostLoginLayout>
                <Outlet />
            </PostLoginLayout>
        </>
    );
};

export default AuthGuard;
