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
    const { formData, handleFormUpdate } = props;

    const [status, setStatus] = useState(formData?.status);
    const [fromDate, setFromDate] = useState(formData?.fromDate);
    const [toDate, setToDate] = useState();
    const [searchString, setSearchString] = useState(formData?.searchString);

    const sendFormData = () => {
        handleFormUpdate({ status, fromDate, toDate, searchString });
    };
    // const resetFormData = () => {
    //     setFormData({});

    //     setStatus('');
    //     setFromDate();
    //     setToDate();
    //     setSearchString('');
    //     refetch();
    // };
    return (
        <Box className="py-5">
            <Paper className="py-5 px-4 ">
                <Box className="flex-row justify-center grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
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
                        <FormControl fullWidth>
                            <InputLabel size="small" id="status_label">
                                Status
                            </InputLabel>
                            <Select
                                labelId="status_label"
                                size="small"
                                name="status"
                                value={status}
                                onChange={val => setStatus(val.target.value)}>
                                <MenuItem value="">All</MenuItem>

                                <MenuItem value="0">Created</MenuItem>
                                <MenuItem value="1">
                                    Proof of identity Complete
                                </MenuItem>
                                <MenuItem value="2">
                                    Proof of Address Complete
                                </MenuItem>
                                <MenuItem value="3">
                                    Income proof added
                                </MenuItem>
                                <MenuItem value="4">
                                    Personal Details Updated
                                </MenuItem>
                                <MenuItem value="5">
                                    Documents Uploaded
                                </MenuItem>
                                <MenuItem value="6">Profile Submitted</MenuItem>
                                <MenuItem value="7">Staff Verified</MenuItem>
                                <MenuItem value="9">Provider Verified</MenuItem>
                                <MenuItem value="10">Fees Pending</MenuItem>
                                <MenuItem value="11">
                                    Document Verification Complete
                                </MenuItem>
                                <MenuItem value="12">Visit Completed</MenuItem>
                                <MenuItem value="14">Loan Sanctioned</MenuItem>
                                <MenuItem value="15">
                                    Loan Disbursal Complete{' '}
                                </MenuItem>
                                <MenuItem value="16">Staff Declined </MenuItem>
                                <MenuItem value="17">
                                    Provider Declined{' '}
                                </MenuItem>
                                <MenuItem value="18">
                                    Client Not Interested{' '}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <DatePicker
                            label="Start Date"
                            value={fromDate}
                            onChange={val => setFromDate(val)}
                            size="small"
                            clearable
                            format="DD/MM/YYYY"
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
                            format="DD/MM/YYYY"
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

                    <Box className="flex justify-end bg-slate-200 gap-3">
                        {/* <Button
                            fullWidth
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={() => resetFormData()}>
                            Reset
                        </Button> */}
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
