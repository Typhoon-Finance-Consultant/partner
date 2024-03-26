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
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import { getDocumentList } from '&/services/loans';
import Loader from '&/components/common/Loader';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  

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

const Documents = ({ documentData }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['document'],
        queryFn: async () => getDocumentList(),
    });
    const formik = useFormik({
        initialValues: {
            

            
        },
        onSubmit: (values, actions) => {
            console.log('Bank account', values);
        },
        validationSchema: bankValidationSchema,
    });
    const [formDisabled, setFormDisbaled] = useState(true);
    if (isLoading) {
        return <Loader loaderText="Loading Bank details" />;
    }
    const documentList = data?.code === 200 ? data.response : [];
    return (
        <Box>
            <Box className="mt-5">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FormGroup className="mb-8">
                           <Button>
                            Upload Document
                           <VisuallyHiddenInput type="file" />

                           </Button>
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
                            <InputLabel size="small" id="account_type">
                                Bank Name
                            </InputLabel>
                            <Select
                                labelId="bank"
                                size="small"
                                id="bank"
                                disabled={formDisabled}
                                name="bank"
                                value={formik.values.bank}
                                onChange={formik.handleChange}>
                                
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
                                onBlur={formik.handleBlur}
                                value={formik.values.branch}
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
                                value={formik.values.branch_city}
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
                                value={formik.values.branch_state}
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
                                value={formik.values.branch_address}
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
                       
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            fullWidth
                            color="secondary"
                            onClick={() => setFormDisbaled(prev => !prev)}>
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
        </Box>
    );
};

export default Documents;
