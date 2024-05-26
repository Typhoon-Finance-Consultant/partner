import {
    Paper,
    TextField,
    Box,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';

import DatePicker from '&/components/common/Form/DatePicker';
import { useState } from 'react';

const InvoiceFilter = props => {
    const { formData, handleFormUpdate } = props;

    const [searchString, setSearchString] = useState(formData?.searchString);
    const [invoiceMonth, setInvoiceMonth] = useState(formData?.invoiceMonth);
    const [status, setStatus] = useState(formData?.status);
    const sendFormData = () => {
        handleFormUpdate({ searchString, invoiceMonth, status });
    };

    return (
        <Box className="py-5">
            <Paper className="py-5 px-4 ">
                <Box className="flex-row justify-center grid xs:grid-cols-1 md:grid-cols-5 gap-4 w-full">
                    <Box className="col-span-2">
                        <TextField
                            name="search_field"
                            placeholder="Search Invoice ID"
                            value={searchString}
                            fullWidth
                            size="small"
                            onChange={val => setSearchString(val.target.value)}
                        />
                    </Box>

                    <Box>
                        <DatePicker
                            label="Invoice Month"
                            value={invoiceMonth}
                            onChange={val => setInvoiceMonth(val)}
                            size="small"
                            clearable
                            views={['month', 'year']}
                            disableFuture
                            fullWidth
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    fullWidth: true,
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel size="small" id="status">
                                Status
                            </InputLabel>
                            <Select
                                labelId="status"
                                size="small"
                                value={status}
                                onChange={val => setStatus(val.target.value)}>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="APPROVED">Approved</MenuItem>
                                <MenuItem value="PROCESSING">
                                    Processing
                                </MenuItem>

                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="flex justify-end bg-slate-200">
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={sendFormData}>
                            Find
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default InvoiceFilter;
