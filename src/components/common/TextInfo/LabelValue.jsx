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
        <div className={`flex flex-${type} justify-between ${rowClassName}`}>
            <Typography className="text-justify font-bold">
                {labelName}:
            </Typography>
            <Typography className={`${labelValueClassName}`}>
                {labelValue}
            </Typography>
        </div>
    );
};

export default LabelValue;
