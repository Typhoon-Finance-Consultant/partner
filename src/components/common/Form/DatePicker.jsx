import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as Picker } from '@mui/x-date-pickers/DatePicker';

const DatePicker = props => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Picker {...props} />
        </LocalizationProvider>
    );
};

export default DatePicker;