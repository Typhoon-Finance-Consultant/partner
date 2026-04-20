import React, { useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Snackbar,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import userService from '&/services/user';
import { Link, useParams } from 'react-router-dom';
import Logo from '&/assets/images/brand.png';

const validationSchema = yup.object({
    password: yup
        .string()
        .trim()
        .required('New Password is required')
        .min(8, 'Password must be at least 8 characters long'),
    confirm_password: yup
        .string()
        .trim()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
});

const ResetPassword = () => {
    const { token } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [passwordUpdated, setPasswordUpdated] = useState(false);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_password: '',
        },
        validationSchema,
        onSubmit: (values, actions) => {
            userService
                .resetPassword({
                    reset_token: token,
                    password: values.password,
                })
                .then(data => {
                    actions.setSubmitting(false);
                    if (data.code === 200) {
                        setPasswordUpdated(true);
                    } else {
                        setSnackbarMessage(
                            data.message ||
                                data.response ||
                                'Something went wrong',
                        );
                        setModalOpen(true);
                    }
                })
                .catch(() => {
                    actions.setSubmitting(false);
                    setSnackbarMessage(
                        'Something went wrong. Please try again.',
                    );
                    setModalOpen(true);
                });
        },
    });

    return (
        <Container
            fixed={false}
            maxWidth={false}
            disableGutters={true}
            className="bg-slate-200 min-h-lvh">
            <div className="text-center mx-auto">
                <img src={Logo} height={140} width={240} className="mx-auto" />
            </div>
            <Grid container className="mt-10">
                <Grid item xs={12} md={4} className="mx-auto">
                    <Card raised className="px-4 py-8 sm:mx-2">
                        <CardContent>
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-center text-teal font-bold text-3xl">
                                    Reset Password
                                </h2>
                            </div>
                            {!passwordUpdated ? (
                                <>
                                    <div className="w-full flex flex-col gap-6 mt-10">
                                        <div className="w-full relative">
                                            <TextField
                                                name="password"
                                                type="password"
                                                size="small"
                                                variant="outlined"
                                                label="New Password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                                fullWidth
                                                error={
                                                    formik.touched.password &&
                                                    Boolean(
                                                        formik.errors.password,
                                                    )
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
                                                type="password"
                                                size="small"
                                                variant="outlined"
                                                label="Confirm Password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={
                                                    formik.values
                                                        .confirm_password
                                                }
                                                fullWidth
                                                error={
                                                    formik.touched
                                                        .confirm_password &&
                                                    Boolean(
                                                        formik.errors
                                                            .confirm_password,
                                                    )
                                                }
                                                helperText={
                                                    formik.touched
                                                        .confirm_password &&
                                                    formik.errors
                                                        .confirm_password
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
                                            Reset Password
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-5 b-1 mx-auto">
                                    <Typography className="text-center mt-5 text-green-600">
                                        Your password has been reset
                                        successfully. Please login with your new
                                        credentials.
                                    </Typography>
                                </div>
                            )}
                            <div className="mt-5 b-1 mx-auto">
                                <Typography className="text-center mt-5">
                                    <Link to="/login">
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            className="mx-auto">
                                            Back to Login
                                        </Button>
                                    </Link>
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

export default ResetPassword;
