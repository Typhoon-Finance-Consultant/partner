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
} from '@mui/material';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import {
    getBankList,
    updateBankAccount,
    getBankDetailsUsingIFSC,
} from '&/services/loans';
import Loader from '&/components/common/Loader';

const bankValidationSchema = yup.object({
    bank: yup.string().trim().required('Bank name is required'),
    account_number: yup.string().trim().required('Account number is required'),
    re_enter_account_number: yup
        .string()
        .trim()
        .required('Re-enter account number is required')
        .oneOf([yup.ref('account_number')], true, 'Account numbers must match'),
    ifsc: yup
        .string()
        .trim()
        .required('IFSC code is required')
        .length(11, 'IFSC code must be 11 characters'),
    branch: yup.string().trim().required('Branch Name is required'),
    branch_address: yup.string().trim().required('Branch Address is required'),
    branch_city: yup.string().trim().required('Branch City is required'),
    branch_state: yup.string().trim().required('Branch State is required'),
    type: yup.string().trim().required('Please select account type'),
});

const BankAccount = ({ bankData, loanID }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['bankList'],
        queryFn: async () => getBankList(),
    });
    const formik = useFormik({
        initialValues: {
            bank: bankData?.bank?.name || 'HDFC BANK',
            account_number: bankData?.account_number,
            re_enter_account_number: bankData?.account_number,
            ifsc: bankData?.ifsc,
            branch: bankData?.branch,
            branch_address: bankData?.branch_address,
            branch_city: bankData?.branch_city,
            branch_state: bankData?.branch_state,

            type: bankData?.account_type || 'SAVINGS',
            loan_id: loanID,
            bank_account_id: bankData?.id,
            action_type: bankData?.id ? 'UPDATE' : 'ADD',
        },
        onSubmit: (values, actions) => {
            console.log('Bank account Update Form', values);
            actions.setSubmitting(true);
            updateBankAccount(values)
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
        validationSchema: bankValidationSchema,
    });

    const [formDisabled, setFormDisabled] = useState(true);
    const handleIFSCChange = event => {
        console.log('IFSC ', event.target.value, event.target.value.length);
        if (event.target.value !== formik.values.ifsc) {
            formik.setFieldValue('ifsc', event.target.value);
            if (event.target.value.length === 11) {
                getBankDetailsUsingIFSC(event.target.value).then(data => {
                    if (data.code === 200) {
                        console.log('IFSC Data ', data);
                        formik.setFieldValue('branch', data?.response?.BRANCH);
                        formik.setFieldValue('branch_city', data?.response?.CITY);
                        formik.setFieldValue(
                            'branch_address',
                            data?.response?.ADDRESS,
                        );
                        formik.setFieldValue('branch_state', data?.response?.STATE);
                    }
                });
            }
        }
       
    };
    if (isLoading) {
        return <Loader loaderText="Loading Bank details" />;
    }
    const bankList = data?.code === 200 ? data.response : [];
    return (
        <Box>
            <Box className="mt-5">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="ifsc"
                                variant="outlined"
                                label="IFSC"
                                onChange={handleIFSCChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.ifsc}
                                fullWidth
                                size="small"
                                disabled={formDisabled}
                                error={
                                    formik.touched.ifsc && formik.errors.ifsc
                                }
                                helperText={
                                    formik.touched.ifsc && formik.errors.ifsc
                                }
                            />
                        </FormGroup>
                        <FormGroup className="mb-8">
                            <TextField
                                name="account_number"
                                variant="outlined"
                                label="Account Number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.account_number}
                                fullWidth
                                disabled={formDisabled}
                                size="small"
                                error={
                                    formik.touched.account_number &&
                                    formik.errors.account_number
                                }
                                helperText={
                                    formik.touched.account_number &&
                                    formik.errors.account_number
                                }
                            />
                        </FormGroup>
                        <FormGroup>
                            <TextField
                                name="re_enter_account_number"
                                variant="outlined"
                                label="Re-enter Account Number"
                                type="password"
                                size="small"
                                disabled={formDisabled}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.re_enter_account_number}
                                fullWidth
                                error={
                                    formik.touched.re_enter_account_number &&
                                    formik.errors.re_enter_account_number
                                }
                                helperText={
                                    formik.touched.re_enter_account_number &&
                                    formik.errors.re_enter_account_number
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="bankName">
                                Bank Name
                            </InputLabel>
                            <Select
                                labelId="bankName"
                                size="small"
                                id="bank"
                                disabled={formDisabled}
                                name="bank"
                                value={formik.values.bank}
                                onChange={formik.handleChange}>
                                {bankList.map(item => (
                                    <MenuItem value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth className="mb-8">
                            <InputLabel size="small" id="account_type">
                                Account Type
                            </InputLabel>
                            <Select
                                labelId="account_type"
                                size="small"
                                id="type"
                                name="type"
                                disabled={formDisabled}
                                value={formik.values.type}
                                onChange={formik.handleChange}>
                                <MenuItem value="SAVINGS">SAVINGS</MenuItem>
                                <MenuItem value="CURRENT">CURRENT</MenuItem>
                            </Select>
                        </FormControl>
                        <FormGroup className="">
                            <TextField
                                name="branch"
                                variant="outlined"
                                label="Branch"
                                size="small"
                                onChange={formik.handleChange}
                                // InputLabelProps={{ shrink: true }}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.branch
                                        ? formik.values.branch
                                        : ''
                                }
                                disabled={formDisabled}
                                fullWidth
                                error={
                                    formik.touched.branch &&
                                    formik.errors.branch
                                }
                                helperText={
                                    formik.touched.branch &&
                                    formik.errors.branch
                                }
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                            <TextField
                                name="branch_city"
                                variant="outlined"
                                label="Branch City"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={
                                    formik.values.branch_city
                                        ? formik.values.branch_city
                                        : ''
                                }
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.branch_city &&
                                    formik.errors.branch_city
                                }
                                helperText={
                                    formik.touched.branch_city &&
                                    formik.errors.branch_city
                                }
                            />
                        </FormGroup>
                        <FormGroup className="mb-8">
                            <TextField
                                name="branch_state"
                                variant="outlined"
                                label="Branch State"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.branch_state
                                    ? formik.values.branch_state
                                    : ''}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.branch_state &&
                                    formik.errors.branch_state
                                }
                                helperText={
                                    formik.touched.branch_state &&
                                    formik.errors.branch_state
                                }
                            />
                        </FormGroup>
                        <FormGroup className="">
                            <TextField
                                name="branch_address"
                                variant="outlined"
                                label="Branch Address"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.branch_address
                                    ? formik.values.branch_address
                                    : ''}
                                disabled={formDisabled}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.branch_address &&
                                    formik.errors.branch_address
                                }
                                helperText={
                                    formik.touched.branch_address &&
                                    formik.errors.branch_address
                                }
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
                <div className="grid md:grid-cols-8 xs:grid-cols-2 md:gap-4 xs:gap-2  mt-8 justify-end">
                    <div className="col-span-6">
                        Account Verification :{' '}
                        {bankData?.is_verified ? 'Complete' : 'Pending'}
                    </div>
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

export default BankAccount;
