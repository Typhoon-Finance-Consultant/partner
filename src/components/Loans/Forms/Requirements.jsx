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
} from '@mui/material';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { getBankList } from '&/services/loans';
import Loader from '&/components/common/Loader';

const requirementsValidationSchema = yup.object({
    amount: yup
        .number()
        .min(10000)
        .max(10000000)
        .required('Please enter Loan Amount'),
    tenure_in_months: yup.number(),
});

const Requirements = ({ requirementsData }) => {
    const formik = useFormik({
        initialValues: {
            category: requirementsData?.category,
            tenure_in_months: requirementsData?.tenure_in_months,
            amount: requirementsData?.amount,
            loan_type: requirementsData?.loan_type,
        },
    });
    const [formDisabled, setFormDisabled] = useState(true);
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
                            disabled={formDisabled}
                            name="category"
                            value={formik.values.category}
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
                            value={formik.values.loan_type}
                            onChange={formik.handleChange}>
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
    );
};

export default Requirements;
