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
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import userService from '&/services/user';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser, setCredentials } from '&/features/auth/authSlice';
import PreloginHeader from '../components/common/Header/PreloginHeader';

const ForgotPassword = () => {
    const user = useSelector(selectCurrentUser);

    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [linkSent, setLinkSent] = useState(false);
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: (values, actions) => {
            userService.forgotPassword(values).then(data => {
                actions.setSubmitting(false);
                console.log('Forgot Password Response', data);
                if (data.code === 200) {
                    setLinkSent(true);
                } else {
                    setSnackbarMessage(data.message || data.response);
                    setModalOpen(true);
                }
            });
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .trim()
                .email('Invalid email format')
                .required('Email is required'),
        }),
    });

    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-100 h-screen">
            <PreloginHeader />
            <Grid container className="mt-10 ">
                <Grid item xs={12} md={4} className="mx-auto">
                    <Card raised className="px-4 py-8 sm:mx-2">
                        <CardContent>
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-center text-blue-500 font-bold text-3xl">
                                    Forgot Password
                                </h2>
                            </div>
                            {!linkSent ? (
                                <>
                                    <div className="w-full flex flex-col gap-6 mt-10">
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
                                        </div>
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
                                            Submit{' '}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-5 b-1 mx-auto">
                                    <Typography className=" text-center mt-5">
                                        You will receive a password reset link
                                        on your email if your account exists.
                                    </Typography>
                                </div>
                            )}
                            {/* <Divider /> */}
                            <div className="mt-5 b-1 mx-auto">
                                <Typography className=" text-center mt-5">
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        className="mx-auto">
                                        <Link to="/login">Back to Login</Link>
                                    </Button>
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
        </Container>
    );
};

export default ForgotPassword;
