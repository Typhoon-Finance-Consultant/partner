import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    TextField,
    Divider,
    Button,
    Typography,
    Box,
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import { getBankList } from '&/services/loans';
import { updatePartnerProfile } from '&/services/user';
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
    account_type: yup.string().trim().required('Please select account type'),
});

const UpdateProfileForm = props => {
    const { bankData, partnerProfile, setSnackbarMessage, setModalOpen } =
        props;
    const { data, isLoading } = useQuery({
        queryKey: ['bankList'],
        queryFn: async () => getBankList(),
    });
    const formik = useFormik({
        initialValues: {
            bank: bankData?.bank?.name || '',
            account_number: bankData?.account_number,
            ifsc: bankData?.ifsc,
            account_type: bankData?.account_type || 'SAVINGS',
            gst_number: partnerProfile?.gst_number,
            address: partnerProfile?.address,
            pincode: partnerProfile?.pincode,
        },
        onSubmit: (values, actions) => {
            updatePartnerProfile(values)
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
    if (isLoading) {
        return <Loader loaderText="Loading Bank List" />;
    }
    const bankList = data?.code === 200 ? data.response : [];

    return (
        <Box className="w-full">
            <Card raised className="px-4 py-8 sm:mx-2">
                <CardContent>
                    <div className="w-full flex flex-col items-center">
                        <Typography
                            variant="h5"
                            className="font-bold text-gray-500 text-center">
                            {' '}
                            Update Profile
                        </Typography>
                    </div>

                    <Divider className="my-2" />
                    <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 mt-10">
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel size="small" id="bank_name">
                                    Bank Name
                                </InputLabel>
                                <Select
                                    labelId="bank_name"
                                    size="small"
                                    // id="bank"
                                    name="bank"
                                    fullWidth
                                    value={formik.values.bank}
                                    onChange={formik.handleChange}>
                                    {bankList.map(item => (
                                        <MenuItem value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel size="small" id="type">
                                    Account Type
                                </InputLabel>
                                <Select
                                    labelId="type"
                                    size="small"
                                    id="account_type"
                                    name="account_type"
                                    fullWidth
                                    value={formik.values.account_type}
                                    onChange={formik.handleChange}>
                                    <MenuItem value="SAVINGS">SAVINGS</MenuItem>
                                    <MenuItem value="CURRENT">CURRENT</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <TextField
                                name="ifsc"
                                variant="outlined"
                                label="IFSC"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.ifsc}
                                fullWidth
                                size="small"
                                error={
                                    formik.touched.ifsc && formik.errors.ifsc
                                }
                                helperText={
                                    formik.touched.ifsc && formik.errors.ifsc
                                }
                            />
                        </Box>
                        <div className="w-full relative">
                            <TextField
                                name="account_number"
                                size="small"
                                variant="outlined"
                                type="account_number"
                                label="Account Number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.account_number}
                                fullWidth
                                error={
                                    formik.touched.account_number &&
                                    formik.errors.account_number
                                }
                                helperText={
                                    formik.touched.account_number &&
                                    formik.errors.account_number
                                }
                            />
                        </div>
                        <div className="w-full relative md:col-span-2">
                            <TextField
                                name="address"
                                size="small"
                                variant="outlined"
                                label="Address"
                                type="address"
                                rows={5}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                                fullWidth
                                error={
                                    formik.touched.address &&
                                    formik.errors.address
                                }
                                helperText={
                                    formik.touched.address &&
                                    formik.errors.address
                                }
                            />
                        </div>
                        <div className="w-full relative">
                            <TextField
                                name="pincode"
                                label="Pin Code"
                                size="small"
                                fullWidth
                                value={formik.values.pincode}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.pincode &&
                                    !!formik.errors.pincode
                                }
                                helperText={
                                    formik.touched.pincode &&
                                    formik.errors.pincode
                                }
                            />
                        </div>
						<div className="w-full relative">
                            <TextField
                                name="gst_number"
                                label="GST Number"
                                size="small"
                                fullWidth
                                value={formik.values.gst_number}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.gst_number &&
                                    !!formik.errors.gst_number
                                }
                                helperText={
                                    formik.touched.gst_number &&
                                    formik.errors.gst_number
                                }
                            />
                        </div>
                       
                    </div>
					<div className=" text-center w-full mt-8">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                
                                className="mx-auto"
                                onClick={formik.handleSubmit}
                                disabled={formik.isSubmitting}>
                                Submit
                            </Button>
                        </div>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UpdateProfileForm;
