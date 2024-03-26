import { Box, Paper, Typography, Icon } from '@mui/material';
import React from 'react';
import { AccountCircle } from '@mui/icons-material';

const IconCard = props => {
    const {
        iconName = <AccountCircle />,
        boxTitle,
        boxValue,
        valueClassName = '',
        titleClassName = '',
    } = props;
    return (
        <Box className="">
            <Paper className="h-32 text-center md:my-10 xs:my-2 flex justify-between pr-5 pl-2 items-center  bg-gradient-to-l from-neutral-400 to-gray-700">
                <Box className="p-2">{iconName}</Box>
                <Box>
                    <Typography
                        color="white"
                        className={`text-slate-200 ${titleClassName}`}>
                        {boxTitle}
                    </Typography>
                    <Typography
                        variant="h4"
                        className={`text-slate-200 ${valueClassName}`}>
                        {boxValue}
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default IconCard;
