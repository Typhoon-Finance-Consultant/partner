import React from 'react';
import { Typography } from '@mui/material';

const LabelValue = ({
    labelName,
    labelValue,
    type = 'row',
    rowClassName = '',
    labelValueClassName = '',
}) => {
    return (
        <div
            className={`flex flex-${type} justify-between gap-1 sm:gap-2 ${rowClassName}`}>
            <Typography
                className="text-justify font-bold"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {labelName}:
            </Typography>
            <Typography
                className={`${labelValueClassName} break-words`}
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {labelValue}
            </Typography>
        </div>
    );
};

export default LabelValue;
