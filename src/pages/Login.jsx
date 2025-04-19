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
    Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { selectCurrentUser, setCredentials } from '&/features/auth/authSlice';
import PreloginHeader from '../components/common/Header/PreloginHeader';

import userService, { sendOTP, verifyOTP } from '&/services/user';

import Logo from '&/assets/images/brand.png';

const Login = () => {
    const user = useSelector(selectCurrentUser);
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [tempCredentials, setTempCredentials] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const handleSendOTP = async mobileNumber => {
        try {
            const response = await sendOTP({
                key_value: mobileNumber,
                key_name: 'MOBILE',
                purpose: 'MOBILE NUMBER VERIFICATION',
            });
            console.log('SEND OTP API RESPONSE', response);
            if (response.code === 200) {
                setSnackbarMessage(response.response);
                setModalOpen(true);
            } else {
                setSnackbarMessage(response.message);
                setModalOpen(true);
            }
        } catch (error) {
            console.log('Error OTP', error);
            setSnackbarMessage('Failed to send OTP');
            setModalOpen(true);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await verifyOTP({
                key_value: mobileNumber,
                key_name: 'MOBILE',
                purpose: 'MOBILE NUMBER VERIFICATION',
                password: otp,
            });

            console.log('VERIFY OTP API RESPONSE', response);
            if (response.code === 200) {
                // OTP verified successfully
                // Complete the login process
                completeLogin();
            } else {
                setSnackbarMessage(
                    response?.response?.data?.response ||
                        'OTP verification failed',
                );
                setModalOpen(true);
            }
        } catch (error) {
            setSnackbarMessage('Error verifying OTP');
            setModalOpen(true);
            console.error(error);
        }
    };
    const completeLogin = () => {
        if (tempCredentials) {
            // Set credentials in Redux
            dispatch(setCredentials(tempCredentials));

            // Navigate to appropriate page
            const redirectPath = state?.pathname;
            if (redirectPath) {
                navigate(redirectPath);
            } else {
                navigate('/');
            }

            setSnackbarMessage('Login successful!');
            setModalOpen(true);
            setOtpModalOpen(false);
        }
    };
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: (values, actions) => {
            userService.login(values).then(data => {
                actions.setSubmitting(false);
                console.log('formik login Actions', data);

                if (data.code === 200) {
                    // Store the credentials
                    const credentials = {
                        user: data.response.user,
                        accessToken: data.response.access_token,
                        refreshToken: data.response.refresh_token,
                    };
                    // Check if mobile is verified
                    if (
                        data?.response?.user?.is_mobile_number_verified ===
                        false
                    ) {
                        // Mobile not verified, send OTP
                        setTempCredentials(credentials);
                        setMobileNumber(data.response.user.mobile_number);

                        // Send OTP
                        handleSendOTP(data.response.user.mobile_number);

                        // Show OTP modal
                        setOtpModalOpen(true);
                    } else {
                        // Mobile already verified, proceed with login
                        dispatch(setCredentials(credentials));

                        const redirectPath = state?.pathname;
                        if (redirectPath) {
                            return navigate(redirectPath);
                        }
                        navigate('/');
                        setSnackbarMessage('Login Successful');
                        setModalOpen(true);
                    }
                } else {
                    setSnackbarMessage(data.message || data.response);
                    setModalOpen(true);
                }
            });
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
    });

    useEffect(() => {
        console.log('Statefrom rendered', state?.pathname);
        if (user) {
            if (state?.pathname && state?.pathname !== 'login') {
                return navigate(state?.pathname);
            }
            return navigate('/');
        }
    }, []);

    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-200 min-h-lvh"
            //   sx={{ minHeight: "100vh" }}
        >
            {/* <PreloginHeader /> */}

            <div className="text-center mx-auto">

                <img src={Logo} height={140} width={240} className="mx-auto" />
            </div>
            <Grid container className="pt-10 ">
                <Grid item xs={12} md={4} className="mx-auto">
                    <Card raised className="px-4 py-8 sm:mx-2">
                        <CardContent>
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-center text-teal font-bold text-3xl">
                                    LOGIN
                                </h2>
                            </div>
                            <div className="w-full flex flex-col gap-6 mt-10">
                                <div className="w-full relative">
                                    <TextField
                                        name="username"
                                        size="small"
                                        variant="outlined"
                                        label="Username"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.username}
                                        fullWidth
                                        error={
                                            formik.touched.username &&
                                            formik.errors.username
                                        }
                                        helperText={
                                            formik.touched.username &&
                                            formik.errors.username
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
                                <Typography className="text-right text-indigo-600">

                                    <Link to="/forgot-password">
                                        Forgot Password?
                                    </Link>
                                </Typography>
                            </div>
                            <div className="mt-5 b-1 mx-auto">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    className="mx-auto"
                                    onClick={formik.handleSubmit}
                                    disabled={formik.isSubmitting}>
                                    {' '}
                                    Sign In{' '}
                                </Button>
                                <Divider>
                                    <Typography className="my-5 text-center">
                                        Need an account?{' '}
                                    </Typography>
                                </Divider>
                                <Typography className=" text-center">
                                    <Link to="/signup">Sign Up</Link>
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Snackbar
                open={modalOpen}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setModalOpen(false)}
                message={snackbarMessage}
            />

            {/* OTP Verification Modal */}
            <Modal open={otpModalOpen} onClose={() => setOtpModalOpen(false)}>
                <div>
                    <Grid container className="mt-5 ">
                        <Grid className="mx-auto" xs={12} sm={4} md={4}>
                            <Paper className="mt-5 mb-8 px-4 py-2">
                                <Typography variant="h6" className="mt-3">
                                    Enter OTP Sent to {mobileNumber}
                                </Typography>
                                <Divider />

                                <div className="my-5">
                                    <TextField
                                        type="text"
                                        name="otp"
                                        maxLength={6}
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        label="OTP"
                                        fullWidth
                                        size="small"
                                        variant="outlined"
                                    />
                                </div>
                                <div className="text-right">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className="mr-3"
                                        onClick={() =>
                                            handleSendOTP(mobileNumber)
                                        }>
                                        Resend OTP
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleVerifyOTP}>
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

export default Login;
