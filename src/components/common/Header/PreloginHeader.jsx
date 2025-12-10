import React from 'react';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Logo from '../../../assets/images/brand.png';

function PreloginHeader() {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
                <IconButton
                    href="/"
                    sx={{
                        p: { xs: 1, sm: 1.5 },
                    }}>
                    <img
                        src={Logo}
                        className="h-12 w-auto sm:h-16 md:h-20"
                        alt="Logo"
                    />
                </IconButton>
            </Container>
        </AppBar>
    );
}

export default PreloginHeader;
