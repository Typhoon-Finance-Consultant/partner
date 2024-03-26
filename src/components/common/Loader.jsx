import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ({loaderText=""}) => {
    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <CircularProgress disableShrink />
        </div>
    );
};

export default Loader;
