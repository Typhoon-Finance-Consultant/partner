import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import PreloginHeader from '&/components/common/Header/PreloginHeader.jsx';

const Notfound = () => {
    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-100 h-screen">
            <PreloginHeader />
            <Box className=" grid md:justify-center md:items-center h-screen py-10 sm:py-0 ">
                <Typography variant="h2">Invalid URL</Typography>
                {/* <Typography variant='h6'>Invalid Link</Typography> */}
            </Box>
        </Container>
    );
};

export default Notfound;
