import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Divider,
    Button,
    TextField,
    Snackbar,
    Modal,
    Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { registerPartner } from '&/services/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { selectCurrentUser, setCredentials } from '&/features/auth/authSlice';
import PreloginHeader from '../components/common/Header/PreloginHeader';
import { sendOTP, verifyOTP } from '../services/user';
import Logo from '&/assets/images/brand.png';

const validationSchema = yup.object().shape({
    mobile_number: yup
        .string()
        .trim()
        .required('Mobile number is required')
        .matches(/^\d{10}$/, 'Invalid mobile number (10 digits)'),
    email: yup
        .string()
        .trim()
        .email('Invalid email format')
        .required('Email is required'),
    entity_name: yup.string().trim().required('Entity name is required'),
    pan: yup
        .string()
        .trim()
        .matches(
            /^[A-Z0-9]{10}$/,
            'Invalid PAN format (10 alphanumeric characters)',
        ),
    password: yup
        .string()
        .trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    confirm_password: yup
        .string()
        .trim()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    first_name: yup.string().trim().required('First name is required'),
    last_name: yup.string().trim().optional(), // Optional last name
    otp: yup.string().trim().min(6, 'Invalid OTP').max(6, 'Invalid OTP'),
});

const Signup = () => {
    const user = useSelector(selectCurrentUser);
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackMessage] = useState('');
    const [otpVerified, setOTPVerified] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const handleSendOTP = async data => {
        try {
            const response = await sendOTP({
                key_value: data,
                key_name: 'MOBILE',
                purpose: 'MOBILE NUMBER VERIFICATION',
            });
            console.log('SEND OTP API RESPONSE', response);
            if (response.code === 200) {
                setSnackBarOpen(true);
                setSnackMessage(response.response);
            } else {
                setSnackBarOpen(true);
                setSnackMessage(response.message);
            }
        } catch (error) {
            console.log('Error OTP', error);
            setSnackBarOpen(true);
        } finally {
            console.log('API RESPONSE DONE SEND OTP');
        }
    };
    const handleVerifyOTP = async (data, otp, formikSubmit) => {
        verifyOTP({
            key_value: data,
            key_name: 'MOBILE',
            purpose: 'MOBILE NUMBER VERIFICATION',
            password: otp,
        })
            .then(data => {
                console.log('VERIFY OTP API RESPONSE', data, formikSubmit);
                if (data.code === 200) {
                    setOTPVerified(true);
                    setTimeout(() => formikSubmit(),250)
                    // formikSubmit();
                } else {
                    setSnackBarOpen(true);
                    setSnackMessage(data?.response?.message);
                }
            })
            .catch(error => {
                setSnackBarOpen(true);
                console.error(error);
            });
    };

    const formik = useFormik({
        initialValues: {
            mobile_number: '',
            email: '',
            entity_name: '',
            pan: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
        },
        onSubmit: (values, actions) => {
            if (!otpVerified) {
                setModalOpen(true);
                handleSendOTP(values.mobile_number);
                return false;
            }
            registerPartner(values).then(data => {
                actions.setSubmitting(false);
                console.log('formik login Actions', data);

                if (data.code === 200) {
                    dispatch(
                        setCredentials({
                            user: data.response.user,
                            accessToken: data.response.access_token,
                            refreshToken: data.response.refresh_token,
                        }),
                    );
                    const redirectPath = state?.pathname;
                    if (redirectPath) {
                        return navigate(redirectPath);
                    }
                    navigate('/');
                    setSnackMessage('Signup Sucessful');
                    setSnackBarOpen(true);
                } else {
                    setSnackMessage(data.response);
                    setSnackBarOpen(true);
                }
            });
        },
        validationSchema: validationSchema,
    });

    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-200 h-screen"
            //   sx={{ minHeight: "100vh" }}
        >
            {/* <PreloginHeader /> */}
            <Grid container className="pt-10 ">
                <Grid item xs={12} md={6} className="mx-auto">
                    <div className="text-center mx-auto">
                        <img
                            src={Logo}
                            height={140}
                            width={240}
                            className="mx-auto"
                        />
                    </div>
                    <Card raised className="px-4 py-2 sm:mx-2">
                        <CardContent>
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-center text-teal font-bold text-3xl">
                                    Partner Signup
                                </h2>
                            </div>
                            <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-6 mt-10">
                                <div className="w-full relative">
                                    <TextField
                                        name="mobile_number"
                                        size="small"
                                        variant="outlined"
                                        label="Mobile Number"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.mobile_number}
                                        fullWidth
                                        error={
                                            formik.touched.mobile_number &&
                                            formik.errors.mobile_number
                                        }
                                        helperText={
                                            formik.touched.mobile_number &&
                                            formik.errors.mobile_number
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="email"
                                        size="small"
                                        variant="outlined"
                                        label="Email"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.email}
                                        fullWidth
                                        error={
                                            formik.touched.email &&
                                            formik.errors.email
                                        }
                                        helperText={
                                            formik.touched.email &&
                                            formik.errors.email
                                        }
                                    />
                                </div>{' '}
                                <div className="w-full relative">
                                    <TextField
                                        name="first_name"
                                        size="small"
                                        variant="outlined"
                                        label="First Name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.first_name}
                                        fullWidth
                                        error={
                                            formik.touched.first_name &&
                                            formik.errors.first_name
                                        }
                                        helperText={
                                            formik.touched.first_name &&
                                            formik.errors.first_name
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="last_name"
                                        size="small"
                                        variant="outlined"
                                        label="Last Name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.last_name}
                                        fullWidth
                                        error={
                                            formik.touched.last_name &&
                                            formik.errors.last_name
                                        }
                                        helperText={
                                            formik.touched.last_name &&
                                            formik.errors.last_name
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="entity_name"
                                        size="small"
                                        variant="outlined"
                                        label="Company Name"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.entity_name}
                                        fullWidth
                                        error={
                                            formik.touched.entity_name &&
                                            formik.errors.entity_name
                                        }
                                        helperText={
                                            formik.touched.entity_name &&
                                            formik.errors.entity_name
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="pan"
                                        size="small"
                                        variant="outlined"
                                        label="PAN"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.pan}
                                        fullWidth
                                        error={
                                            formik.touched.pan &&
                                            formik.errors.pan
                                        }
                                        helperText={
                                            formik.touched.pan &&
                                            formik.errors.pan
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="password"
                                        variant="outlined"
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        size="small"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.password &&
                                            formik.errors.password
                                        }
                                        helperText={
                                            formik.touched.password &&
                                            formik.errors.password
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="confirm_password"
                                        variant="outlined"
                                        label="Confirm Password"
                                        type="password"
                                        fullWidth
                                        size="small"
                                        value={formik.values.confirm_password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.confirm_password &&
                                            formik.errors.confirm_password
                                        }
                                        helperText={
                                            formik.touched.confirm_password &&
                                            formik.errors.confirm_password
                                        }
                                    />
                                </div>
                            </div>
                            <div className="mt-5 b-1 mx-auto text-center">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className="mx-auto"
                                    onClick={formik.handleSubmit}
                                    disabled={formik.isSubmitting}>
                                    {' '}
                                    Sign Up{' '}
                                </Button>
                                <Divider>
                                    <Typography className="my-5 text-center">
                                        Have an account?{' '}
                                    </Typography>
                                </Divider>
                                <Typography className="mt-1 text-center">
                                    <Link to="/login">Login</Link>
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setSnackBarOpen(false)}
                message={snackbarMessage}
            />
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <Grid container className="mt-5 ">
                        <Grid className="mx-auto" xs={12} sm={4} md={4}>
                            <Paper className="mt-5 mb-8 px-4 py-2">
                                <Typography variant="h6" className="mt-3">
                                    Enter OTP Sent to{' '}
                                    {formik.values.mobile_number}
                                </Typography>
                                <Divider />

                                <div className="my-5">
                                    <TextField
                                        type="text"
                                        name="otp"
                                        maxLength={6}
                                        value={formik.values.otp}
                                        onChange={formik.handleChange}
                                        label="OTP"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                        disabled={formik.isSubmitting}
                                        error={
                                            formik.touched.otp &&
                                            formik.errors.otp
                                        }
                                        helperText={
                                            formik.touched.otp &&
                                            formik.errors.otp
                                        }
                                    />
                                </div>
                                <div className="text-right">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mr-3"
                                        onClick={() =>
                                            handleSendOTP(
                                                formik.values.mobile_number,
                                            )
                                        }>
                                        Resend OTP
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>
                                            handleVerifyOTP(
                                                formik.values.mobile_number,
                                                formik.values.otp,
                                                formik.handleSubmit,
                                            )
                                        }>
                                        Submit
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </Modal>
        </Container>
    );
};

export default Signup;
