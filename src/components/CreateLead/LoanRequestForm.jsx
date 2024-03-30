import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
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
    Snackbar,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import Loader from '&/components/common/Loader';
import { submitLoanApplication, checkLeadStatus } from '&/services/loans';

const validationSchema = yup.object().shape({
    amount: yup
        .number()
        .positive('Loan amount must be positive')
        .required('Loan amount is required'),
    tenure: yup
        .number()
        .positive('Loan tenure must be positive')
        .required('Loan tenure is required'),
    loan_type: yup.string().trim().required('Loan type is required'),
    gross_income: yup
        .number()
        .positive('Gross income must be positive')
        .required('Gross income is required'),
    net_income: yup
        .number()
        .positive('Net income must be positive')
        .required('Net income is required'),
    category: yup.string().trim().optional(), // Optional loan category
});

const LoanRequestForm = props => {
    const { leadID } = props;
    const navigate = useNavigate();
    const { setModalOpen, setSnackbarMessage } = props;

    const formik = useFormik({
        initialValues: {
            amount: '',
            tenure: '',
            loan_type: '',
            gross_income: '',
            net_income: '',
            category: '',
            lead_id: leadID,
        },
        validationSchema: validationSchema,
        onSubmit: (values, action) => {
            action.setSubmitting(true);
            console.log('Loan Request Form Details', values);
            submitLoanApplication(values).then(res => {
                action.setSubmitting(false);
                if (res.code === 200) {
                    return navigate(`/loan-details/${res.response.loan_id}`);
                } else {
                    setModalOpen(true);
                    setSnackbarMessage(res?.response?.message);
                }
            });
        },
    });
    const { data, isLoading } = useQuery({
        queryKey: ['leadDetails'],
        queryFn: async () => checkLeadStatus(leadID),
        active: leadID,
    });
    if (isLoading) {
        return <Loader />;
    }

    return (
        <Paper className="p-4 text-center ">
            <Typography variant="h6" className="font-bold text-gray-500">
                {' '}
                Loan Requirements
            </Typography>
            <Divider className="my-2" />
            <Box className="pt-3 mb-4">
                <FormControl fullWidth className="mb-8">
                    <InputLabel size="small" id="income_type">
                        Income Type
                    </InputLabel>
                    <Select
                        labelId="income_type"
                        size="small"
                        name="income_type"
                        onBlur={formik.hanleBlur}
                        value={formik.values.income_type}
                        onChange={formik.handleChange}>
                        <MenuItem value={1}>Salaried</MenuItem>
                        <MenuItem value={2}>Self Employed</MenuItem>
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
                        name="loan_type"
                        value={formik.values.loan_type}
                        onChange={formik.handleChange}>
                        <MenuItem value="PL">Personal Loan</MenuItem>
                        <MenuItem value="HL">Home Loan</MenuItem>
                        <MenuItem value="BL">Business Loan</MenuItem>
                        <MenuItem value="LAP">Loan Against Property</MenuItem>
                        <MenuItem value="BT">Balance Transfer</MenuItem>
                    </Select>
                </FormControl>
                <Box className="grid md:grid-cols-2 md:gap-2">
                    <FormControl fullWidth className="mb-8">
                        <TextField
                            name="gross_income"
                            variant="outlined"
                            label="Gross Income"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.gross_income}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.gross_income &&
                                formik.errors.gross_income
                            }
                            helperText={
                                formik.touched.gross_income &&
                                formik.errors.gross_income
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth className="mb-8">
                        <TextField
                            name="net_income"
                            variant="outlined"
                            label="Net Income"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.net_income}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.net_income &&
                                formik.errors.net_income
                            }
                            helperText={
                                formik.touched.net_income &&
                                formik.errors.net_income
                            }
                        />
                    </FormControl>
                </Box>
                <Box className="grid md:grid-cols-2 md:gap-2">
                    <FormControl fullWidth className="">
                        <TextField
                            name="amount"
                            variant="outlined"
                            label="Loan Amount"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.amount}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.amount && formik.errors.amount
                            }
                            helperText={
                                formik.touched.amount && formik.errors.amount
                            }
                        />
                    </FormControl>

                    <FormControl fullWidth className="">
                        <TextField
                            name="tenure"
                            variant="outlined"
                            label="Loan Tenure in months"
                            type="number"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tenure}
                            fullWidth
                            size="small"
                            error={
                                formik.touched.tenure && formik.errors.tenure
                            }
                            helperText={
                                formik.touched.tenure && formik.errors.tenure
                            }
                        />
                    </FormControl>
                </Box>
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

export default LoanRequestForm;
