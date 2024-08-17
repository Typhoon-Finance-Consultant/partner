import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Container,
    Box,
    Grid,
    TextField,
    Paper,
    Typography,
    Button,
    FormControl,
    Divider,
} from '@mui/material';

import { handleLeadCreation } from '&/services/loans';

const validationSchema = yup.object().shape({
    mobile_number: yup
        .string()
        .trim()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
    email: yup
        .string()
        .trim()
        .email('Invalid email format')
        .required('Email is required'),
    first_name: yup.string().trim().required('First name is required'),
    last_name: yup.string().trim().required('Last name is required'), // Optional last name
    pan: yup
        .string()
        .trim()
        .required('PAN is required')
        .matches(
            /^[A-Z0-9]{10}$/,
            'Invalid PAN format (10 alphanumeric characters)',
        ),
});

const LeadFormClient = props => {
    const { setModalOpen, setSnackbarMessage } = props;
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            mobile_number: '',
            email: '',
            first_name: '',
            last_name: '',
            pan: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, action) => {
            action.setSubmitting(true);
            handleLeadCreation(values).then(res => {
                action.setSubmitting(false);
                if (res.code === 200) {
                    setSnackbarMessage('Lead created successfully');
                    setModalOpen(true);
                    navigate(`/create-lead/${res.response.lead_id}`);
                } else {
                    setSnackbarMessage('Something went wrong');
                    setModalOpen(true);
                }
            });
        },
    });
    return (
        <Paper className="p-4 text-center w-full ">
            <Typography variant="h6" className="font-bold text-gray-500">
                {' '}
                New Application
            </Typography>
            <Divider className="my-2" />
            <Box className="pt-3 mb-4">
                <Box>
                    <FormControl fullWidth className="mb-4">
                        <TextField
                            size="small"
                            label="Mobile Number"
                            name="mobile_number"
                            value={formik.values.mobile_number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            fullWidth
                            error={
                                formik.touched.mobile_number &&
                                formik.errors.mobile_number
                            }
                            helperText={
                                formik.touched.mobile_number &&
                                formik.errors.mobile_number
                            }
                        />
                    </FormControl>
                    <Box>
                        <FormControl fullWidth className="">
                            <TextField
                                size="small"
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                error={
                                    formik.touched.email && formik.errors.email
                                }
                                helperText={
                                    formik.touched.email && formik.errors.email
                                }
                            />
                        </FormControl>
                    </Box>

                    <Box className="pt-3 grid md:grid-cols-2 xs:grid-cols-1 gap-4 mb-4">
                        <Box>
                            <FormControl fullWidth className="">
                                <TextField
                                    size="small"
                                    label="First Name"
                                    name="first_name"
                                    value={formik.values.first_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    error={
                                        formik.touched.first_name &&
                                        formik.errors.first_name
                                    }
                                    helperText={
                                        formik.touched.first_name &&
                                        formik.errors.first_name
                                    }
                                />
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <TextField
                                    size="small"
                                    label="Last Name"
                                    name="last_name"
                                    value={formik.values.last_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    fullWidth
                                    error={
                                        formik.touched.last_name &&
                                        formik.errors.last_name
                                    }
                                    helperText={
                                        formik.touched.last_name &&
                                        formik.errors.last_name
                                    }
                                />
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
                <FormControl fullWidth className="">
                    <TextField
                        size="small"
                        label="PAN"
                        name="pan"
                        value={formik.values.pan}
                        onChange={e =>
                            formik.setFieldValue(
                                'pan',
                                e.target.value?.toUpperCase(),
                            )
                        }
                        onBlur={formik.handleBlur}
                        fullWidth
                        error={formik.touched.pan && formik.errors.pan}
                        helperText={formik.touched.pan && formik.errors.pan}
                    />
                </FormControl>
            </Box>
            <Box className="py-3">
                <Button
                    fullWidth
                    variant="contained"
                    onClick={formik.handleSubmit}
                    disabled={formik.isSubmitting}>
                    Submit
                </Button>
            </Box>
        </Paper>
    );
};

export default LeadFormClient;
