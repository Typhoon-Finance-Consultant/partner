import React, { useState } from 'react';
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

const LoanFilters = props => {
    const [status, setStatus] = useState('');
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [searchString, setSearchString] = useState();

    const { formData, setFormData } = props;

    const sendFormData = () => {
        setFormData({ status, fromDate, toDate, searchString });
    };
    const resetFormData = () => {
        setStatus('');
        setFromDate();
        setToDate();
        setSearchString('');
    };
    return (
        <Box className="py-5">
            <Paper className="py-5 px-4 bg-gradient-to-b from-neutral-100 to-neutral-200">
                <Box className="flex-row justify-center grid xs:grid-cols-1 md:grid-cols-5 gap-4 w-full">
                    <Box>
                        <TextField
                            name="search_field"
                            placeholder="Search"
                            value={searchString}
                            fullWidth
                            size="small"
                            onChange={val => setSearchString(val.target.value)}
                        />
                    </Box>
                    <Box>
                        <DatePicker
                            label="Start Date"
                            value={fromDate}
                            onChange={val => setFromDate(val)}
                            size="small"
                            clearable
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
                        <DatePicker
                            label="End Date"
                            value={toDate}
                            onChange={val => setToDate(val)}
                            size="small"
                            clearable
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
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="PENDING">Pending</MenuItem>
                                <MenuItem value="APPROVED">Approved</MenuItem>
                                <MenuItem value="PROCESSING">
                                    Processing
                                </MenuItem>

                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box className="flex justify-end bg-slate-200 gap-3">
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => resetFormData()}>
                            Reset
                        </Button>
                        <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            onClick={() => sendFormData()}>
                            Filter
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoanFilters;
