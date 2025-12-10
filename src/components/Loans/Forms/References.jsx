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
import { updateLoanReference } from '&/services/loans';
import {
    LOAN_REFERENCE_PERSONAL_TYPES,
    LOAN_REFERENCE_PROFESSIONAL_TYPES,
} from '&/helpers/constants';

const referenceValidationSchema = yup.object().shape({
    reference_one_name: yup
        .string()
        .trim()
        .required('Reference 1 name is required'),

    // reference_two_name: yup.string().trim().optional(),

    reference_one_relation: yup.string().trim().required(),
    // reference_two_relation: yup.string().trim().optional(),
    professional_reference_one_name: yup.string().trim().optional(),
    // professional_reference_two_name: yup.string().trim().optional(),
    professional_reference_one_relation: yup.string().trim().optional(),
    // professional_reference_two_relation: yup.string().trim().optional(),
    reference_one_mobile_number: yup
        .string()
        .trim()
        .required('Mobile number is required for first reference')
        .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
    // reference_two_mobile_number: yup
    //     .string()
    //     .trim()
    //     .optional()
    //     .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
    professional_reference_one_mobile_number: yup
        .string()
        .trim()
        .required('Mobile number is required for first reference')
        .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
    // professional_reference_two_mobile_number: yup
    //     .string()
    //     .trim()
    //     .optional()
    //     .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
});

const References = ({
    references,
    loanID,
    status,
    setActiveTab,
    activeTab,
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            reference_one_name: references?.reference_one_name,
            // reference_two_name: references?.reference_two_name,
            reference_one_relation: references?.reference_one_relation,
            // reference_two_relation: references?.reference_two_relation,
            professional_reference_one_name:
                references?.professional_reference_one_name,
            // professional_reference_two_name:
            // references?.professional_reference_two_name,
            professional_reference_one_relation:
                references?.professional_reference_one_relation,
            // professional_reference_two_relation:
            // references?.professional_reference_two_relation,
            reference_one_mobile_number:
                references?.reference_one_mobile_number,

            // reference_two_mobile_number:
            // references?.reference_two_mobile_number,
            professional_reference_one_mobile_number:
                references?.professional_reference_one_mobile_number,

            // professional_reference_two_mobile_number:
            // references?.professional_reference_two_mobile_number,
            loan_id: loanID,
        },
        onSubmit: (values, actions) => {
            actions.setSubmitting(true);
            updateLoanReference(values)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    setActiveTab(prev => prev + 1);
                    actions.setSubmitting(false);
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
        validationSchema: referenceValidationSchema,
    });
    const [formDisabled, setFormDisabled] = useState(
        status === 'Loan Disbursal Complete',
    );

    return (
        <Box className="px-2 sm:px-0">
            <Box className="mt-3 sm:mt-5">
                <Typography
                    variant="h6"
                    className="font-bold text-gray-500 mb-3 sm:mb-5"
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Personal Reference Details
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="reference_one_name"
                                variant="outlined"
                                label="Reference One Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.reference_one_name}
                                fullWidth
                                size="small"
                                disabled={formDisabled}
                                error={
                                    formik.touched.reference_one_name &&
                                    formik.errors.reference_one_name
                                }
                                helperText={
                                    formik.touched.reference_one_name &&
                                    formik.errors.reference_one_name
                                }
                            />
                        </FormGroup>
                        {/* <FormGroup className="mb-8">
                            <TextField
                                name="reference_two_name"
                                variant="outlined"
                                label="Reference Two Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.reference_two_name}
                                fullWidth
                                disabled={formDisabled}
                                size="small"
                                error={
                                    formik.touched.reference_two_name &&
                                    formik.errors.reference_two_name
                                }
                                helperText={
                                    formik.touched.reference_two_name &&
                                    formik.errors.reference_two_name
                                }
                            />
                        </FormGroup> */}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="reference_one_relation_personal">
                                Reference One Relation
                            </InputLabel>
                            <Select
                                labelId="reference_one_relation_personal"
                                size="small"
                                id="reference_one_relation"
                                disabled={formDisabled}
                                name="reference_one_relation"
                                value={formik.values.reference_one_relation}
                                onChange={formik.handleChange}>
                                {LOAN_REFERENCE_PERSONAL_TYPES.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="reference_two_relation_personal">
                                Reference Two Relation
                            </InputLabel>
                            <Select
                                labelId="reference_two_relation_personal"
                                size="small"
                                id="reference_two_relation"
                                disabled={formDisabled}
                                name="reference_two_relation"
                                value={formik.values.reference_two_relation}
                                onChange={formik.handleChange}>
                                {LOAN_REFERENCE_PERSONAL_TYPES.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="reference_one_mobile_number"
                                variant="outlined"
                                label="Reference One Mobile"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.reference_one_mobile_number
                                }
                                fullWidth
                                size="small"
                                disabled={formDisabled}
                                error={
                                    formik.touched
                                        .reference_one_mobile_number &&
                                    formik.errors.reference_one_mobile_number
                                }
                                helperText={
                                    formik.touched
                                        .reference_one_mobile_number &&
                                    formik.errors.reference_one_mobile_number
                                }
                            />
                        </FormGroup>
                        {/* <FormGroup className="mb-8">
                            <TextField
                                name="reference_two_mobile_number"
                                variant="outlined"
                                label="Reference Two Mobile"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.reference_two_mobile_number
                                }
                                fullWidth
                                disabled={formDisabled}
                                size="small"
                                error={
                                    formik.touched
                                        .reference_two_mobile_number &&
                                    formik.errors.reference_two_mobile_number
                                }
                                helperText={
                                    formik.touched
                                        .reference_two_mobile_number &&
                                    formik.errors.reference_two_mobile_number
                                }
                            />
                        </FormGroup> */}
                    </Grid>
                </Grid>
                <Divider />

                <Typography
                    variant="h6"
                    className="font-bold text-gray-500 mb-5 mt-2">
                    {' '}
                    Professional Reference Details
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="professional_reference_one_name"
                                variant="outlined"
                                label="Professional Reference One Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values
                                        .professional_reference_one_name
                                }
                                fullWidth
                                size="small"
                                disabled={formDisabled}
                                error={
                                    formik.touched
                                        .professional_reference_one_name &&
                                    formik.errors
                                        .professional_reference_one_name
                                }
                                helperText={
                                    formik.touched
                                        .professional_reference_one_name &&
                                    formik.errors
                                        .professional_reference_one_name
                                }
                            />
                        </FormGroup>
                        {/* <FormGroup className="mb-8">
                            <TextField
                                name="professional_reference_two_name"
                                variant="outlined"
                                label="Professional Reference Two Name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values
                                        .professional_reference_two_name
                                }
                                fullWidth
                                disabled={formDisabled}
                                size="small"
                                error={
                                    formik.touched
                                        .professional_reference_two_name &&
                                    formik.errors
                                        .professional_reference_two_name
                                }
                                helperText={
                                    formik.touched
                                        .professional_reference_two_name &&
                                    formik.errors
                                        .professional_reference_two_name
                                }
                            />
                        </FormGroup> */}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="reference_one_relation_professiona">
                                Professional Reference One Relation
                            </InputLabel>
                            <Select
                                labelId="reference_one_relation_professional"
                                size="small"
                                id="professional_reference_one_relation"
                                disabled={formDisabled}
                                name="professional_reference_one_relation"
                                value={
                                    formik.values
                                        .professional_reference_one_relation
                                }
                                onChange={formik.handleChange}>
                                {LOAN_REFERENCE_PROFESSIONAL_TYPES.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="reference_two_relation_professional">
                                Professional Reference Two Relation
                            </InputLabel>
                            <Select
                                labelId="reference_two_relation_professional"
                                size="small"
                                id="professional_reference_two_relation"
                                disabled={formDisabled}
                                name="professional_reference_two_relation"
                                value={
                                    formik.values
                                        .professional_reference_two_relation
                                }
                                onChange={formik.handleChange}>
                                {LOAN_REFERENCE_PROFESSIONAL_TYPES.map(item => (
                                    <MenuItem value={item}>{item}</MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="professional_reference_one_mobile_number"
                                variant="outlined"
                                label="Professional Reference One Mobile"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values
                                        .professional_reference_one_mobile_number
                                }
                                fullWidth
                                size="small"
                                disabled={formDisabled}
                                error={
                                    formik.touched
                                        .professional_reference_one_mobile_number &&
                                    formik.errors
                                        .professional_reference_one_mobile_number
                                }
                                helperText={
                                    formik.touched
                                        .professional_reference_one_mobile_number &&
                                    formik.errors
                                        .professional_reference_one_mobile_number
                                }
                            />
                        </FormGroup>
                        {/* <FormGroup className="mb-8">
                            <TextField
                                name="professional_reference_two_mobile_number"
                                variant="outlined"
                                label="Professional Reference Two Mobile"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={

                                    formik.values
                                        .professional_reference_two_mobile_number
                                }
                                fullWidth
                                disabled={formDisabled}
                                size="small"
                                error={
                                    formik.touched
                                        .professional_reference_two_mobile_number &&

                                    formik.errors
                                        .professional_reference_two_mobile_number
                                }
                                helperText={
                                    formik.touched
                                        .professional_reference_two_mobile_number &&

                                    formik.errors
                                        .professional_reference_two_mobile_number
                                }
                            />
                        </FormGroup> */}
                    </Grid>
                </Grid>
                {status !== 'Loan Disbursal Complete' && (
                    <div className="grid md:grid-cols-8 xs:grid-cols-2 md:gap-4 xs:gap-2  mt-8 justify-end">
                        <div className="col-span-6"></div>
                        <div>
                            <Button
                                variant="contained"
                                fullWidth
                                color="secondary"
                                disabled={
                                    formik.isSubmitting || activeTab === 0
                                }
                                onClick={() => setActiveTab(prev => prev - 1)}>
                                Back
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
                )}
            </Box>
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

export default References;
