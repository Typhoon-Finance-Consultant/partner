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
    const {pathname} = useLocation();
    const { data, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => me(),
    });
    if (isLoading) {
        return <Loader />;
    }
    const userProfile = data?.code === 200 ? data.response : {};
    console.log('location Data', location);
    return (
        <Grid container className="bg-white h-lvh flex ">
            <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
                <Box
                    className="bg-gray-400 h-full v-100  bg-gradient-to-t from-black to-gray-700 p-5"
                    // sx={{ maxWidth: 274, minWidth: 270 }}
                >
                    <Box className="  justify-center align-middle text-center pt-10">
                        <AccountCircle
                            fontSize="large"
                            color="white"
                            className="text-center"
                            sx={{
                                fontSize: 60,
                                marginBottom: '20px',
                                color: 'white',
                            }}
                        />
                        <Typography className="text-center text-gray-300">
                            {userProfile?.partner?.full_name}
                        </Typography>
                    </Box>
                    <Divider className="py-2 border-bottom border-b border-slate-100" />
                    <Box>
                        {menuOptions.map(item => (
                            <Button
                                key={item.name}
                                fullWidth
                                color="white"
                                className={`text-gray-300 ${pathname === item.path ? " text-black bg-gray-100" : "bg-transparent"}`}
                                onClick={() => handleMenuClick(item.path)}
                                href={item.path}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Drawer>
            <Box className="flex-grow" md={9}>
                <AppBar position="sticky" color="white">
                    <Toolbar className="flex w-full justify-between ">
                        <Box>
                            <IconButton
                                onClick={() => setShowMenu(prev => !prev)}
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}>
                                <MenuIcon />
                            </IconButton>
                            <IconButton href="/">
                                <img src={Logo} height={50} width={100} />
                            </IconButton>{' '}
                        </Box>
                        <Box className="flex ">
                            <Typography sx={{ marginTop: '10px' }}>
                                {userProfile?.entity_name}
                            </Typography>
                            <div className="row">
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit">
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
                                        sx={{ minWidth: 200 }}
                                        onClick={() => navigate('/profile')}>
                                        Profile
                                    </MenuItem>
                                    <Divider />

                                    <MenuItem
                                        sx={{ minWidth: 200 }}
                                        onClick={() =>
                                            navigate('/update-password')
                                        }>
                                        Update Password
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={logOutUser}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </div>
                        </Box>
                    </Toolbar>
                </AppBar>
                {children}
            </Box>
        </Grid>
    );
};

export default PostLoginLayout;
