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
} from '@mui/material';

import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectCurrentUser } from '&/features/auth/authSlice';

const menuOptions = [
    {
        name: 'Home',
        path: '/dashboard',
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
        name: 'Account',
        path: '/account',
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
    return (
        <Grid container className="bg-white h-lvh flex ">
            <Drawer open={showMenu} onClose={() => setShowMenu(false)}>
                <Box
                    className="bg-gray-400 h-full v-100  bg-gradient-to-t from-black to-gray-700 p-5"
                    sx={{ maxWidth: 274, minWidth: 270 }}>
                    <Box>
                        {menuOptions.map(item => (
                            <Button
                                key={item.name}
                                fullWidth
                                color="white"
                                onClick={() => handleMenuClick(item.path)}
                                href={item.path}>
                                {item.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Drawer>
            <Box className="flex-grow" md={9}>
                <AppBar position="sticky" color="white" >
                    <Toolbar className="flex w-full " fixed>
                        <IconButton
                            onClick={() => setShowMenu(prev => !prev)}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography>{user.full_name}</Typography>
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

                                <MenuItem onClick={logOutUser}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
                {children}
            </Box>
        </Grid>
    );
};

export default PostLoginLayout;
