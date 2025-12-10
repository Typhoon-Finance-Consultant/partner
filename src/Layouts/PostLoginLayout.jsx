import React, { useState } from 'react';
import {
    Grid,
    Box,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Drawer,
    Divider,
} from '@mui/material';

import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { logOut, selectCurrentUser } from '&/features/auth/authSlice';
import { me } from '&/services/user';
import Loader from '&/components/common/Loader';
import Logo from '&/assets/images/brand.png';

const menuOptions = [
    {
        name: 'Home',
        path: '/',
    },
    {
        name: 'Loans',
        path: '/Loans',
    },
    {
        name: 'Invoices',
        path: '/invoices',
    },
    {
        name: 'Create Lead',
        path: '/create-lead',
    },
];

const PostLoginLayout = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const user = useSelector(selectCurrentUser);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleMenuClick = linkName => {
        navigate(linkName);
        setAnchorEl(null);
    };
    const dispatch = useDispatch();
    const logOutUser = () => {
        navigate('/');
        dispatch(logOut());
    };
    const [showMenu, setShowMenu] = useState();
    const { pathname } = useLocation();
    const { data, isLoading, error } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => me(),
        retry: (failureCount, error) => {
            // Don't retry on 401 errors as the user will be redirected
            if (error?.response?.status === 401) {
                return false;
            }
            return failureCount < 3;
        },
        onError: error => {
            // Additional error handling if needed
            console.error('User profile fetch error:', error);
            if (error?.response?.status === 401) {
                // The axios interceptor should have already handled this,
                // but we can add additional cleanup here if needed
            }
        },
    });
    if (isLoading) {
        return <Loader />;
    }

    // If there's a 401 error, the axios interceptor should have already redirected
    // But as a safety check, if we have an error and no data, redirect to login
    if (error && !data && error?.response?.status === 401) {
        navigate('/login');
        return null;
    }

    const userProfile = data?.code === 200 ? data.response : {};
    return (
        <Grid container className="bg-white min-h-screen flex ">
            <Drawer
                open={showMenu}
                onClose={() => setShowMenu(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '85%', sm: 280 },
                        maxWidth: 320,
                    },
                }}>
                <Box className="bg-white h-full p-5 shadow-lg">
                    <Box className="justify-center align-middle text-center pt-6 sm:pt-10">
                        <AccountCircle
                            fontSize="large"
                            className="text-center"
                            sx={{
                                fontSize: { xs: 50, sm: 60 },
                                marginBottom: '15px',
                                color: '#FF0000',
                            }}
                        />
                        <Typography className="text-center text-gray-800 text-sm sm:text-base px-2 break-words font-semibold">
                            {userProfile?.partner?.full_name}
                        </Typography>
                    </Box>
                    <Divider className="py-2 my-4 border-gray-300" />
                    <Box className="space-y-2">
                        {menuOptions.map(item => (
                            <Button
                                key={item.name}
                                fullWidth
                                className={`py-3 justify-start px-4 text-left font-medium ${
                                    pathname === item.path
                                        ? 'text-white hover:bg-red-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleMenuClick(item.path)}
                                href={item.path}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s',
                                    backgroundColor:
                                        pathname === item.path
                                            ? '#FF0000'
                                            : 'transparent',
                                    '&:hover': {
                                        backgroundColor:
                                            pathname === item.path
                                                ? '#CC0000'
                                                : 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Drawer>
            <Box className="flex-grow w-full" md={9}>
                <AppBar position="sticky" color="white" elevation={1}>
                    <Toolbar className="flex w-full justify-between min-h-[56px] sm:min-h-[64px] px-2 sm:px-4">
                        <Box className="flex items-center">
                            <IconButton
                                onClick={() => setShowMenu(prev => !prev)}
                                size="medium"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                className="touch-target"
                                sx={{ mr: { xs: 0.5, sm: 2 } }}>
                                <MenuIcon />
                            </IconButton>
                            <IconButton href="/" sx={{ p: { xs: 0.5, sm: 1 } }}>
                                <img
                                    src={Logo}
                                    className="h-8 w-auto sm:h-12 md:w-24"
                                    alt="Logo"
                                />
                            </IconButton>
                        </Box>
                        <Box className="flex items-center gap-1 sm:gap-2">
                            <Typography
                                className="hidden sm:block text-sm lg:text-base"
                                sx={{ marginTop: '2px' }}
                                noWrap>
                                {userProfile?.entity_name}
                            </Typography>
                            <IconButton
                                size="medium"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                className="touch-target"
                                color="primary">
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                sx={{ marginTop: '35px' }}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={() => setAnchorEl(null)}>
                                <MenuItem
                                    sx={{ minWidth: 180, py: 1.5 }}
                                    onClick={() => navigate('/profile')}>
                                    Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    sx={{ minWidth: 180, py: 1.5 }}
                                    onClick={() =>
                                        navigate('/update-password')
                                    }>
                                    Update Password
                                </MenuItem>
                                <Divider />
                                <MenuItem sx={{ py: 1.5 }} onClick={logOutUser}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                {children}
            </Box>
        </Grid>
    );
};

export default PostLoginLayout;
