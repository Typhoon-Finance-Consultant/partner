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

    reference_two_name: yup
        .string()
        .trim()
        .required('Reference 2 name is required'),

    reference_one_relation: yup.string().trim().optional(),
    reference_two_relation: yup.string().trim().optional(),
    professional_reference_one_name: yup.string().trim().optional(),
    professional_reference_two_name: yup.string().trim().optional(),
    professional_reference_one_relation: yup.string().trim().optional(),
    professional_reference_two_relation: yup.string().trim().optional(),
});
const References = ({ references, loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            reference_one_name: references?.reference_one_name,
            reference_two_name: references?.reference_two_name,
            reference_one_relation: references?.reference_one_relation,
            reference_two_relation: references?.reference_two_relation,
            professional_reference_one_name:
                references?.professional_reference_one_name,
            professional_reference_two_name:
                references?.professional_reference_two_name,
            professional_reference_one_relation:
                references?.professional_reference_one_relation,
            professional_reference_two_relation:
                references?.professional_reference_two_relation,
            loan_id: loanID,
        },
        onSubmit: (values, actions) => {
            console.log('Reference Update Form', values);
            actions.setSubmitting(true);
            updateLoanReference(values)
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
        validationSchema: referenceValidationSchema,
    });
    const [formDisabled, setFormDisabled] = useState(true);

    return (
        <Box>
            <Box className="">
                <Typography
                    variant="h6"
                    className="font-bold text-gray-500 mb-5">
                    {' '}
                    Personal Reference Details
                </Typography>
                <Grid container spacing={4}>
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
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
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
                        </FormGroup>
                        <FormControl fullWidth className="mb-8">
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
                        </FormControl>
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
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
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
                        </FormGroup>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel
                                size="small"
                                id="reference_two_relation_professional">
                                Reference Two Relation
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
                        </FormControl>
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
