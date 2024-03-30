import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    FormGroup,
    Box,
    TextField,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Paper,
    Typography,
    Divider,
    Snackbar,
} from '@mui/material';
import * as yup from 'yup';
import { INDIAN_STATES } from '&/helpers/constants';
import { updateAddress } from '&/services/loans';

const addressSchema = yup.object().shape({
    line1: yup.string().trim().required('Address Line 1 is required'),
    line2: yup.string().trim().optional(), // Optional address line 2
    city: yup.string().trim().required('City is required'),
    state: yup.string().trim().required('State is required'),
    pincode: yup
        .string()
        .trim()
        .matches(/^\d{6}$/, 'Invalid PIN code (6 digits)'), // Validates 6-digit PIN code
});

const addressValidationSchema = yup.object().shape({
    permanent_address: addressSchema.required(),
    communication_address: addressSchema.optional(
        'Communication address is required if different',
    ), // Optional communication address with conditional requirement
    workplace_address: addressSchema.required(),
});

const Address = ({ address, loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const formik = useFormik({
        initialValues: {
            permanent_address: {
                line1: address?.permanent_address?.line1,
                line2: address?.permanent_address?.line2, // Optional
                city: address?.permanent_address?.city,
                state: address?.permanent_address?.state,
                pincode: address?.permanent_address?.pincode, // Optional
                type: 'PERM',
            },
            communication_address: {
                line1: address?.communication_address?.line1,
                line2: address?.communication_address?.line2, // Optional
                city: address?.communication_address?.city,
                state: address?.communication_address?.state,
                pincode: address?.communication_address?.pincode,
                type: 'COMM',
            },
            workplace_address: {
                line1: address?.office_address?.line1,
                line2: address?.office_address?.line2, // Optional
                city: address?.office_address?.city,
                state: address?.office_address?.state,
                pincode: address?.office_address?.pincode,
                type: 'OFFI',
            },
            loan_id: loanID,
        },
        validationSchema: addressValidationSchema,
        onSubmit: (values, actions) => {
            console.log('Upload Address Response', values);
            actions.setSubmitting(true);
            updateAddress(values)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    actions.setSubmitting(false);
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
    });
    const [formDisabled, setFormDisabled] = useState(true);
    return (
        <Box className="mt-5">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper className="p-4">
                        <Typography variant="h6">Permanent Address</Typography>
                        <Divider className="my-2" />
                        <Box className="py-2">
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="permanent_address.line1"
                                    value={
                                        formik.values.permanent_address?.line1
                                    }
                                    size="small"
                                    label="Line 1"
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.permanent_address
                                            ?.line1 &&
                                        !!formik.errors.permanent_address
                                            ?.line1
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.permanent_address
                                            ?.line1 &&
                                        formik.errors.permanent_address?.line1
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="permanent_address.line2"
                                    label="Line 2"
                                    size="small"
                                    value={
                                        formik.values.permanent_address.line2
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.permanent_address
                                            ?.line2 &&
                                        !!formik.errors.permanent_address?.line2
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.permanent_address
                                            ?.line2 &&
                                        formik.errors.permanent_address?.line2
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="permanent_address.pincode"
                                    label="Pin Code"
                                    size="small"
                                    value={
                                        formik.values.permanent_address.pincode
                                    }
                                    disabled={formDisabled}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.permanent_address
                                            ?.pincode &&
                                        !!formik.errors.permanent_address
                                            ?.pincode
                                    }
                                    helperText={
                                        formik.touched.permanent_address
                                            ?.pincode &&
                                        formik.errors.permanent_address?.pincode
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="permanent_address.city"
                                    label="City"
                                    size="small"
                                    disabled={formDisabled}
                                    value={formik.values.permanent_address.city}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.permanent_address
                                            ?.city &&
                                        !!formik.errors.permanent_address?.city
                                    }
                                    helperText={
                                        formik.touched.permanent_address
                                            ?.city &&
                                        formik.errors.permanent_address?.city
                                    }
                                />
                            </FormControl>

                            <FormControl fullWidth className="mb-8">
                                <InputLabel size="small" id="permanent_state">
                                    State
                                </InputLabel>
                                <Select
                                    labelId="permanent_state"
                                    size="small"
                                    disabled={formDisabled}
                                    name="permanent_address.state"
                                    value={
                                        formik.values.permanent_address.state
                                    }
                                    onChange={formik.handleChange}>
                                    {INDIAN_STATES.map(item => (
                                        <MenuItem value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="p-4">
                        <Typography variant="h6">
                            Communication Address
                        </Typography>
                        <Divider className="my-2" />
                        <Box className="py-2">
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="communication_address.line1"
                                    value={
                                        formik.values.communication_address
                                            ?.line1
                                    }
                                    size="small"
                                    label="Line 1"
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.communication_address
                                            ?.line1 &&
                                        !!formik.errors.communication_address
                                            ?.line1
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.communication_address
                                            ?.line1 &&
                                        formik.errors.communication_address
                                            ?.line1
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="communication_address.line2"
                                    label="Line 2"
                                    size="small"
                                    value={
                                        formik.values.communication_address
                                            .line2
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.communication_address
                                            ?.line2 &&
                                        !!formik.errors.communication_address
                                            ?.line2
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.communication_address
                                            ?.line2 &&
                                        formik.errors.communication_address
                                            ?.line2
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="communication_address.pincode"
                                    label="Pin Code"
                                    size="small"
                                    value={
                                        formik.values.communication_address
                                            .pincode
                                    }
                                    disabled={formDisabled}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.communication_address
                                            ?.pincode &&
                                        !!formik.errors.communication_address
                                            ?.pincode
                                    }
                                    helperText={
                                        formik.touched.communication_address
                                            ?.pincode &&
                                        formik.errors.communication_address
                                            ?.pincode
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="permanent_address.city"
                                    label="City"
                                    size="small"
                                    disabled={formDisabled}
                                    value={
                                        formik.values.communication_address.city
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.communication_address
                                            ?.city &&
                                        !!formik.errors.communication_address
                                            ?.city
                                    }
                                    helperText={
                                        formik.touched.communication_address
                                            ?.city &&
                                        formik.errors.communication_address
                                            ?.city
                                    }
                                />
                            </FormControl>

                            <FormControl fullWidth className="mb-8">
                                <InputLabel
                                    size="small"
                                    id="communication_address_state">
                                    State
                                </InputLabel>
                                <Select
                                    labelId="communication_address_state"
                                    size="small"
                                    disabled={formDisabled}
                                    name="communication_address.state"
                                    value={
                                        formik.values.communication_address
                                            .state
                                    }
                                    onChange={formik.handleChange}>
                                    {INDIAN_STATES.map(item => (
                                        <MenuItem value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="p-4">
                        <Typography variant="h6">Workplace Address</Typography>
                        <Divider className="my-2" />
                        <Box className="py-2">
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="workplace_address.line1"
                                    value={
                                        formik.values.workplace_address?.line1
                                    }
                                    size="small"
                                    label="Line 1"
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.workplace_address
                                            ?.line1 &&
                                        !!formik.errors.workplace_address
                                            ?.line1
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.workplace_address
                                            ?.line_1 &&
                                        formik.errors.workplace_address?.line1
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="workplace_address.line2"
                                    label="Line 2"
                                    size="small"
                                    value={
                                        formik.values.workplace_address.line2
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.workplace_address
                                            ?.line2 &&
                                        !!formik.errors.workplace_address?.line2
                                    }
                                    disabled={formDisabled}
                                    helperText={
                                        formik.touched.workplace_address
                                            ?.line2 &&
                                        formik.errors.workplace_address?.line2
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="workplace_address.pincode"
                                    label="Pin Code"
                                    size="small"
                                    value={
                                        formik.values.workplace_address.pincode
                                    }
                                    disabled={formDisabled}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.workplace_address
                                            ?.pincode &&
                                        !!formik.errors.workplace_address
                                            ?.pincode
                                    }
                                    helperText={
                                        formik.touched.workplace_address
                                            ?.pincode &&
                                        formik.errors.workplace_address?.pincode
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth className="mb-8">
                                <TextField
                                    name="workplace_address.city"
                                    label="City"
                                    size="small"
                                    disabled={formDisabled}
                                    value={formik.values.workplace_address.city}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.workplace_address
                                            ?.city &&
                                        !!formik.errors.workplace_address?.city
                                    }
                                    helperText={
                                        formik.touched.workplace_address
                                            ?.city &&
                                        formik.errors.workplace_address?.city
                                    }
                                />
                            </FormControl>

                            <FormControl fullWidth className="mb-8">
                                <InputLabel
                                    size="small"
                                    id="workplace_address_state">
                                    State
                                </InputLabel>
                                <Select
                                    labelId="workplace_addresss_state"
                                    size="small"
                                    disabled={formDisabled}
                                    name="workplace_address.state"
                                    value={
                                        formik.values.workplace_address.state
                                    }
                                    onChange={formik.handleChange}>
                                    {INDIAN_STATES.map(item => (
                                        <MenuItem value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <div className="grid md:grid-cols-8 xs:grid-cols-2 md:gap-4 xs:gap-2  mt-8 justify-end">
                <div className="col-span-6"></div>
                <div>
                    <Button
                        variant="contained"
                        fullWidth
                        color="secondary"
                        onClick={() => setFormDisabled(prev => !prev)}>
                        Edit
                    </Button>
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={formik.isSubmitting}
                        onClick={formik.handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
            <Snackbar
                open={modalOpen}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setModalOpen(false)}
                message={snackbarMessage}
            />
        </Box>
    );
};

export default Address;
