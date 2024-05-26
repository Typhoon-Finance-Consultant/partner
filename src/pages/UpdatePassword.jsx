import React, { useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Snackbar,
    Divider,
    Button,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { updatePassword } from '&/services/user';

const validationSchema = yup.object().shape({
    old_password: yup
        .string()
        .trim()
        .required('Old password is required')
        .min(8, 'Old Password must be at least 8 characters long'),
    new_password: yup
        .string()
        .trim()
        .required('New Password is required')
        .min(8, 'New Password must be at least 8 characters long'),
    confirm_password: yup
        .string()
        .trim()
        .oneOf([yup.ref('new_password')], 'Passwords must match')
        .required('Please enter password again'),
});

const UpdatePassword = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        },
        onSubmit: (values, actions) => {
            actions.setSubmitting(true);
            updatePassword(values).then(res => {
            actions.setSubmitting(false);

                if (res.code === 200) {
                    navigate('/');
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                } else {
                    setSnackbarMessage(res.response || res.message);
                    setModalOpen(true);
                }
            });
        },
        validationSchema: validationSchema,
    });
    return (
        <Container maxWidth={false} className="bg-slate-200 h-screen ">
            <Grid container className="py-10">
                <Grid item xs={12} md={4} className="mx-auto ">
                    <Card raised className="px-4 py-3 sm:mx-2">
                        <CardContent>
                            <Typography
                                variant="h6"
                                className="font-bold text-gray-500 text-center">
                                {' '}
                                Update Password
                            </Typography>
                            <Divider className="my-2" />
                            <div className="w-full flex flex-col gap-6 mt-5">
                                <div className="w-full relative">
                                    <TextField
                                        name="old_password"
                                        size="small"
                                        variant="outlined"
                                        type="password"
                                        label="Old Password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.old_password}
                                        fullWidth
                                        error={
                                            formik.touched.old_password &&
                                            formik.errors.old_password
                                        }
                                        helperText={
                                            formik.touched.old_password &&
                                            formik.errors.old_password
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="new_password"
                                        size="small"
                                        variant="outlined"
                                        label="New Password"
                                        type="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.new_password}
                                        fullWidth
                                        error={
                                            formik.touched.new_password &&
                                            formik.errors.new_password
                                        }
                                        helperText={
                                            formik.touched.new_password &&
                                            formik.errors.new_password
                                        }
                                    />
                                </div>
                                <div className="w-full relative">
                                    <TextField
                                        name="confirm_password"
                                        size="small"
                                        variant="outlined"
                                        label="Confirm new password"
                                        type="password"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirm_password}
                                        fullWidth
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
                                <div className="mt-1 b-1 mx-auto text-center w-full">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        className="mx-auto"
                                        onClick={formik.handleSubmit}
                                        disabled={formik.isSubmitting}>
                                        Submit
                                    </Button>
                                </div>
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

export default UpdatePassword;
