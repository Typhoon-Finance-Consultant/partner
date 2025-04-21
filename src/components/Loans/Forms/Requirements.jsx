import React, { useState, useEffect } from 'react';
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
    Typography,
    Snackbar,
} from '@mui/material';
import * as yup from 'yup';
import { updateLoanRequirements } from '&/services/loans';
import Loader from '&/components/common/Loader';

const requirementsValidationSchema = yup.object({
    amount: yup
        .number()
        .required('Please enter Loan Amount'),
    tenure_in_months: yup
        .number()
        .required('Tenure is required')
        .positive('Tenure must be a positive number'),
    loan_type: yup.string().required('Loan type is required'),
    category: yup.string().required('Loan category is required'),
});

const Requirements = ({ requirementsData, loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    
    const formik = useFormik({
        initialValues: {
            category: requirementsData?.category || '',
            tenure_in_months: requirementsData?.tenure_in_months || '',
            amount: requirementsData?.amount || '',
            loan_type: requirementsData?.loan_type || '',
            loan_id: loanID,
        },
        validationSchema: requirementsValidationSchema,
        onSubmit: (values, actions) => {
            actions.setSubmitting(true);            
            updateLoanRequirements(values)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    actions.setSubmitting(false);
                    setFormDisabled(true);
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
    });
    
    // Effect to set category based on loan_type whenever loan_type changes
    useEffect(() => {
        const loanType = formik.values.loan_type;
        if (loanType) {
            // Set category based on loan type rules
            const newCategory = (loanType === 'HL' || loanType === 'LAP') ? 'S' : 'U';
            formik.setFieldValue('category', newCategory);
        }
    }, [formik.values.loan_type]);
    
    const [formDisabled, setFormDisabled] = useState(true);
    
    // Custom handler for loan type changes
    const handleLoanTypeChange = (event) => {
        const newLoanType = event.target.value;
        formik.setFieldValue('loan_type', newLoanType);
        
        // Immediately set category based on the new loan type
        const newCategory = (newLoanType === 'HL' || newLoanType === 'LAP') ? 'S' : 'U';
        formik.setFieldValue('category', newCategory);
    };
    
    return (
        <Box className="mt-5">
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth className="mb-8">
                        <InputLabel size="small" id="category">
                            Loan Category
                        </InputLabel>
                        <Select
                            labelId="category"
                            size="small"
                            id="category"
                            disabled={true} // Category is auto-set based on loan_type
                            name="category"
                            value={formik.values.category || ''}
                            onChange={formik.handleChange}>
                            <MenuItem value="S">Secured</MenuItem>
                            <MenuItem value="U">Unsecured</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth className="mb-8">
                        <InputLabel size="small" id="loan_type">
                            Loan Type
                        </InputLabel>
                        <Select
                            labelId="loan_type"
                            size="small"
                            id="loan_type"
                            disabled={formDisabled}
                            name="loan_type"
                            value={formik.values.loan_type || ''}
                            onChange={handleLoanTypeChange}>
                            <MenuItem value="PL">Personal Loan</MenuItem>
                            <MenuItem value="HL">Home Loan</MenuItem>
                            <MenuItem value="BL">Business Loan</MenuItem>
                            <MenuItem value="LAP">
                                Loan Against Property
                            </MenuItem>
                            <MenuItem value="BT">Balance Transfer</MenuItem>
                        </Select>
                    </FormControl>
                    <FormGroup className="mb-8">
                        <TextField
                            name="amount"
                            variant="outlined"
                            label="Loan Amount"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                            disabled={formDisabled}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.amount && formik.errors.amount
                            }
                            helperText={
                                formik.touched.amount && formik.errors.amount
                            }
                        />
                    </FormGroup>
                    <FormGroup className="mb-8">
                        <TextField
                            name="tenure_in_months"
                            variant="outlined"
                            label="Tenure in Months"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tenure_in_months}
                            disabled={formDisabled}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.tenure_in_months &&
                                formik.errors.tenure_in_months
                            }
                            helperText={
                                formik.touched.tenure_in_months &&
                                formik.errors.tenure_in_months
                            }
                        />
                    </FormGroup>
                  
                </Grid>
                <Grid item xs={12} md={4}>
                {requirementsData?.provider?.name ? (
                        <FormGroup className="mb-8">
                            <Typography className="font-bold text-sm text-gray-400">Loan Provider : </Typography>
                            <Typography className="text-lg">{requirementsData?.provider?.name}</Typography>
                        </FormGroup>
                    ) : null}
                </Grid>
            </Grid>

            {requirementsData.status !== 'Loan Disbursal Complete' && (

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

            </div>)}
            
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

export default Requirements;
