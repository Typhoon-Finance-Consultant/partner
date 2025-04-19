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
<<<<<<< HEAD
=======
    Grid,
>>>>>>> e85d874 (Initial commit- Raj)
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
<<<<<<< HEAD
import { getBankList } from '&/services/loans';
import { updatePartnerProfile } from '&/services/user';
import Loader from '&/components/common/Loader';

const bankValidationSchema = yup.object({
    bank: yup.string().trim().required('Bank name is required'),
=======
import {
    getBankList,
    getBankDetailsUsingIFSC,
    getPinCode,
} from '&/services/loans';
import { updatePartnerProfile } from '&/services/user';
import Loader from '&/components/common/Loader';
import { INDIAN_STATES } from '&/helpers/constants';
   
const bankValidationSchema = yup.object({
    name_as_on_bank_account: yup.string().trim().required('Name is required'),
    bank: yup.string().trim().required('Bank name is required'),

>>>>>>> e85d874 (Initial commit- Raj)
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
<<<<<<< HEAD
=======
    branch: yup.string().trim().required('Bank Branch is required'),
    branch_address: yup.string().trim().required('Branch Address is required'),
    branch_city: yup.string().trim().required('Branch City is required'),
    branch_state: yup.string().trim().required('Branch State is required'),
    line1: yup.string().trim().required('Address Line 1 is required'),
    line2: yup.string().trim().optional(), // Optional address line 2
    city: yup.string().trim().required('City is required'),
    state: yup.string().trim().required('State is required'),
    pincode: yup
        .string()
        .trim()
        .required('Pin Code is required')
        .matches(/^\d{6}$/, 'Invalid PIN code (6 digits)'),
>>>>>>> e85d874 (Initial commit- Raj)
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
<<<<<<< HEAD
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
=======
            name_as_on_bank_account: bankData?.name_as_on_bank_account,
            bank: bankData?.bank?.name || 'HDFC Bank',
            account_number: bankData?.account_number,
            re_enter_account_number: bankData?.account_number,
            ifsc: bankData?.ifsc,
            branch: bankData?.branch,
            branch_address: bankData?.branch_address,
            branch_city: bankData?.branch_city,
            branch_state: bankData?.branch_state,
            account_type: bankData?.account_type || 'SAVINGS',
            gst_number: partnerProfile?.gst_number,
            line1: partnerProfile?.line1,
            line2: partnerProfile?.line2, // Optional
            city: partnerProfile?.city,
            state: partnerProfile?.state || '',
            pincode: partnerProfile?.pincode, // Optional
        },
        validationSchema: bankValidationSchema,

        onSubmit: (values, actions) => {
            // Combine address fields into a single address field
            const address =
                `${values.line1}, ${values.line2 || ''}, ${values.city}, ${values.state}, ${values.pincode}`
                    .replace(/,\s*,/g, ',')
                    .trim();

            // Create a new object with the combined address
            const updatedValues = {
                ...values,
                address, // Add the combined address
            };
            updatePartnerProfile(updatedValues)
>>>>>>> e85d874 (Initial commit- Raj)
                .then(res => {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                    actions.setSubmitting(false);
<<<<<<< HEAD
=======
                    navigate('/profile');
>>>>>>> e85d874 (Initial commit- Raj)
                })
                .catch(error => {
                    setModalOpen(true);
                    setSnackbarMessage('Something went wrong');
                    actions.setSubmitting(false);
                });
        },
    });
<<<<<<< HEAD
=======
    const navigate = useNavigate();
    if (isLoading) {
        return <Loader />;
    }
    const handlePinCode = event => {
        if (event.target.value !== formik.values.pincode) {
            formik.setFieldValue('pincode', event.target.value);
            if (event.target.value.length === 6) {
                getPinCode(event.target.value).then(data => {
                    if (data.code === 200) {
                        // Find the matching state value in INDIAN_STATES
                        const validState = INDIAN_STATES.find(
                            state => state.label === data.response?.state,
                        );
                        formik.setFieldValue(
                            'city',
                            data?.response?.city || '',
                        );
                        formik.setFieldValue(
                            'state',
                            validState
                                ? validState.value
                                : data.response?.state, // Use the value property
                        );
                    }
                });
            }
        }
    };

    const handleIFSCChange = event => {
        // console.log('IFSC ', event.target.value, event.target.value.length);
        if (event.target.value !== formik.values.ifsc) {
            formik.setFieldValue('ifsc', event.target.value);
            if (event.target.value.length === 11) {
                getBankDetailsUsingIFSC(event.target.value).then(data => {
                    if (data.code === 200) {
                        // console.log('IFSC Data ', data);
                        formik.setFieldValue('branch', data?.response?.BRANCH);
                        formik.setFieldValue(
                            'branch_city',
                            data?.response?.CITY,
                        );
                        formik.setFieldValue(
                            'branch_address',
                            data?.response?.ADDRESS,
                        );
                        formik.setFieldValue(
                            'branch_state',
                            data?.response?.STATE,
                        );
                        formik.setFieldValue('bank', data?.response?.BANK);
                    }
                });
            }
        }
    };
>>>>>>> e85d874 (Initial commit- Raj)
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
<<<<<<< HEAD
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
=======
                    <Typography
                        variant="h6"
                        className="text-gray-500 text-center">
                        {' '}
                        Bank Details{' '}
                    </Typography>
                    <div className="w-full flex flex-col gap-6 mt-4">
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={4}>
                                <FormGroup className="mb-8">
                                    <TextField
                                        autoComplete="new-name_as_on_bank_account"
                                        id="name_as_on_bank_account"
                                        name="name_as_on_bank_account"
                                        variant="outlined"
                                        label="Name As On Bank Account"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={
                                            formik.values
                                                .name_as_on_bank_account
                                        }
                                        fullWidth
                                        size="small"
                                        error={
                                            formik.touched
                                                .name_as_on_bank_account &&
                                            formik.errors
                                                .name_as_on_bank_account
                                        }
                                        helperText={
                                            formik.touched
                                                .name_as_on_bank_account &&
                                            formik.errors
                                                .name_as_on_bank_account
                                        }
                                    />
                                </FormGroup>
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
                                        error={
                                            formik.touched.ifsc &&
                                            formik.errors.ifsc
                                        }
                                        helperText={
                                            formik.touched.ifsc &&
                                            formik.errors.ifsc
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
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={
                                            formik.values
                                                .re_enter_account_number
                                        }
                                        fullWidth
                                        error={
                                            formik.touched
                                                .re_enter_account_number &&
                                            formik.errors
                                                .re_enter_account_number
                                        }
                                        helperText={
                                            formik.touched
                                                .re_enter_account_number &&
                                            formik.errors
                                                .re_enter_account_number
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
                                        name="bank"
                                        value={formik.values.bank}
                                        onChange={formik.handleChange}>
                                        {bankList.map((item, index) => (
                                            <MenuItem
                                                value={item.name}
                                                key={index}>
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
                                        id="account_type"
                                        name="account_type"
                                        value={formik.values.account_type}
                                        onChange={formik.handleChange}>
                                        <MenuItem value="SAVINGS">
                                            SAVINGS
                                        </MenuItem>
                                        <MenuItem value="CURRENT">
                                            CURRENT
                                        </MenuItem>
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
                                        autoComplete="new-branch-city"
                                        id="branch-city-field"
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
                                        autoComplete="new-branch-state"
                                        id="branch-state-field"
                                        name="branch_state"
                                        variant="outlined"
                                        label="Branch State"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={
                                            formik.values.branch_state
                                                ? formik.values.branch_state
                                                : ''
                                        }
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
                                        autoComplete="new-branch-branch_address"
                                        id="branch-branch_address-field"
                                        name="branch_address"
                                        variant="outlined"
                                        label="Branch Address"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={
                                            formik.values.branch_address
                                                ? formik.values.branch_address
                                                : ''
                                        }
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
                        {/* <Divider className="my-2" /> */}
                        <Typography
                            variant="h6"
                            className="text-gray-500 text-center">
                            {' '}
                            Other Details{' '}
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth className="mb-8">
                                    <TextField
                                        name="line1"
                                        value={formik.values.line1}
                                        size="small"
                                        label="House No, Building, Street, Area, City"
                                        type="text"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.line1 &&
                                            formik.errors.line1
                                        }
                                        helperText={
                                            formik.touched.line1 &&
                                            formik.errors.line1
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth className="mb-8">
                                    <TextField
                                        name="line2"
                                        label="Line 2"
                                        size="small"
                                        value={formik.values.line2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.line2 &&
                                            !!formik.errors.line2
                                        }
                                        helperText={
                                            formik.touched.line2 &&
                                            formik.errors.line2
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth className="mb-8">
                                    <TextField
                                        name="pincode"
                                        label="Pin Code"
                                        size="small"
                                        value={formik.values.pincode}
                                        onChange={handlePinCode}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.pincode &&
                                            !!formik.errors.pincode
                                        }
                                        helperText={
                                            formik.touched.pincode &&
                                            formik.errors.pincode
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth className="mb-8">
                                    <TextField
                                        autoComplete="new-city"
                                        id="city"
                                        variant="outlined"
                                        name="city"
                                        label="District"
                                        size="small"
                                        type="text"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={
                                            formik.values.city
                                                ? formik.values.city
                                                : ''
                                        }
                                        error={
                                            formik.touched.city &&
                                            !!formik.errors.city
                                        }
                                        helperText={
                                            formik.touched.city &&
                                            formik.errors.city
                                        }
                                    />
                                </FormControl>
                                <FormControl fullWidth className="mb-8">
                                    <InputLabel size="small" id="State">
                                        State
                                    </InputLabel>
                                    <Select
                                        labelId="State"
                                        size="small"
                                        id="state"
                                        name="state"
                                        value={formik.values.state}
                                        // onBlur={formik.handleBlur}

                                        onChange={formik.handleChange}>
                                        {INDIAN_STATES.map((item, index) => (
                                            <MenuItem
                                                value={item.value}
                                                key={index}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth className="mb-8">
                                    <TextField
                                        name="gst_number"
                                        label="GST Number"
                                        size="small"
                                        onBlur={formik.handleBlur}
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
                                </FormControl>{' '}
                            </Grid>
                        </Grid>
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
>>>>>>> e85d874 (Initial commit- Raj)
                </CardContent>
            </Card>
        </Box>
    );
};

export default UpdateProfileForm;
