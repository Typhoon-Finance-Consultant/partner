import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as Picker } from '@mui/x-date-pickers/DatePicker';

const DatePicker = ({ format = 'DD/MM/YYYY', slotProps, ...props }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Picker
                format={format}
                slotProps={{
                    ...slotProps,
                    textField: {
                        placeholder: format,
                        ...slotProps?.textField,
                    },
                }}
                {...props}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;
