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

const InvoiceFilter = props => {
    const {
        searchString,
        setSearchString,
        toDate,
        setToDate,
        fromDate,
        setFromDate,
        status,
        setStatus,
    } = props;

    return (
        <Box className="py-5">
            <Paper className="py-5 px-4 bg-gradient-to-b from-neutral-50 to-neutral-200">
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
                            value={fromDate}
                            onChange={val => setFromDate(val)}
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
                        <Button fullWidth size="small" variant="contained">
                            Find
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default InvoiceFilter;
