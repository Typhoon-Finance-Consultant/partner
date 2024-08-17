import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import PreloginHeader from '&/components/common/Header/PreloginHeader.jsx';

const Notfound = () => {
    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-200 min-h-lvh">
            <PreloginHeader />
            <Box className=" grid md:justify-center md:items-center min-h-lvh py-10 sm:py-0 ">
                <Typography variant="h2">Invalid URL</Typography>
                {/* <Typography variant='h6'>Invalid Link</Typography> */}
            </Box>
        </Container>
    );
};

export default Notfound;
