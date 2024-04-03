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
    Snackbar,
    Typography,
    Divider,
} from '@mui/material';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { updateBasicDetails } from '&/services/loans';
import DatePicker from '&/components/common/Form/DatePicker';

const basicProfileValidationSchema = yup.object({
    marital_status: yup.string().trim().required('Marital Status is required'),
    gender: yup.string().trim().required('Gender is required'),
    first_name: yup.string().trim().required('First name is required'),
    middle_name: yup.string().trim().optional(),
    last_name: yup.string().trim().required('Last name is required'),
    dob: yup.date().required('Date of birth is required').nullable(true),
});

const BasicProfile = ({ profileData, loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const formik = useFormik({
        initialValues: {
            loan_id: loanID,
            primary_applicant: {
                marital_status:
                    profileData?.primary_applicant?.marital_status || 'Single',
                gender: profileData?.primary_applicant?.gender || 'Male',
                first_name: profileData?.primary_applicant?.first_name,
                middle_name: profileData?.primary_applicant?.middle_name,
                last_name: profileData?.primary_applicant?.last_name,
                dob: profileData?.primary_applicant?.dob,
            },
            secondary_applicant: {
                marital_status:
                    profileData?.secondary_applicant?.marital_status | 'Single',
                gender: profileData?.secondary_applicant?.gender || 'Male',
                first_name: profileData?.secondary_applicant?.first_name,
                middle_name: profileData?.secondary_applicant?.middle_name,
                last_name: profileData?.secondary_applicant?.last_name,
                dob: profileData?.secondary_applicant?.dob,
            },
        },
        // validationSchema: yup.object().shape({
        //     primary_applicant: basicProfileValidationSchema.optional(),
        //     secondary_applicant: basicProfileValidationSchema.optional(),
        // }),
        onSubmit: (values, action) => {
            action.setSubmitting(true);
            const body = {
                ...values,
                dob: dayjs(values.dob).format('DD/MM/YYYY'),
            };
            updateBasicDetails(body)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    action.setSubmitting(false);
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    action.setSubmitting(false);
                });
        },
    });
    const [formDisabled, setFormDisabled] = useState(true);
    return (
        <Box className="mt-5">
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography
                        variant="h6"
                        className="font-bold text-gray-500 mb-5">
                        {' '}
                        Primary Applicant
                    </Typography>
                    <Box className="grid md:grid-cols-3 gap-4">
                        <FormGroup className="mb-8">
                            <TextField
                                name="primary_applicant.first_name"
                                variant="outlined"
                                label="First name"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.primary_applicant?.first_name
                                }
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.primary_applicant
                                        ?.first_name &&
                                    formik.errors.primary_applicant?.first_name
                                }
                                helperText={
                                    formik.touched.primary_applicant
                                        ?.first_name &&
                                    formik.errors.primary_applicant?.first_name
                                }
                            />
                        </FormGroup>

                        <FormGroup className="mb-8">
                            <TextField
                                name="primary_applicant.middle_name"
                                variant="outlined"
                                label="Middle name"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.primary_applicant?.middle_name
                                }
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.primary_applicant
                                        ?.middle_name &&
                                    formik.errors.primary_applicant?.middle_name
                                }
                                helperText={
                                    formik.touched.primary_applicant
                                        ?.middle_name &&
                                    formik.errors.primary_applicant?.middle_name
                                }
                            />
                        </FormGroup>
                        <FormGroup className="mb-8">
                            <TextField
                                name="primary_applicant.last_name"
                                variant="outlined"
                                label="Last name"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.primary_applicant?.last_name
                                }
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.primary_applicant
                                        ?.last_name &&
                                    formik.errors.primary_applicant?.last_name
                                }
                                helperText={
                                    formik.touched.primary_applicant
                                        ?.last_name &&
                                    formik.errors.primary_applicant?.last_name
                                }
                            />
                        </FormGroup>
                    </Box>
                    <Box className="grid md:grid-cols-3 gap-4">
                        <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="primary_marital_status">
                                Marital Status
                            </InputLabel>
                            <Select
                                labelId="primary_marital_status"
                                size="small"
                                id="primary_applicant.marital_status"
                                disabled={formDisabled}
                                name="primary_applicant.marital_status"
                                value={
                                    formik.values.primary_applicant
                                        .marital_status
                                }
                                onChange={formik.handleChange}>
                                <MenuItem value="Single">Single</MenuItem>
                                <MenuItem value="Married">Married</MenuItem>
                                <MenuItem value="Divorced">Divorced</MenuItem>
                                <MenuItem value="Separated">Separated</MenuItem>
                                <MenuItem value="Widowed">Widowed</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="primary_gender">
                                Gender
                            </InputLabel>
                            <Select
                                labelId="primary_gender"
                                size="small"
                                id="primary_applicant.gender"
                                disabled={formDisabled}
                                name="primary_applicant.gender"
                                value={formik.values.primary_applicant.gender}
                                onChange={formik.handleChange}>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                        <FormGroup className="mb-8">
                            <DatePicker
                                label="Date of Birth"
                                value={formik.values.primary_applicant.dob}
                                onChange={formik.handleChange}
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
                        </FormGroup>
                    </Box>
                    <Divider />
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

export default BasicProfile;
