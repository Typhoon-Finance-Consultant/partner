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
import * as Yup from 'yup';
import userService from '&/services/user';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { selectCurrentUser, setCredentials } from '&/features/auth/authSlice';
import PreloginHeader from '../components/common/Header/PreloginHeader';

const Login = () => {
    const user = useSelector(selectCurrentUser);
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
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
                    navigate('/dashboard'),
                        setSnackbarMessage('Login Sucessful');
                    setModalOpen(true);
                } else {
                    setSnackbarMessage(data.message);
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
            className="bg-slate-100 h-screen"
            //   sx={{ minHeight: "100vh" }}
        >
            <PreloginHeader />
            <Grid container className="mt-10 ">
                <Grid item xs={12} md={4} className="mx-auto">
                    <Card raised className="px-4 py-8 sm:mx-2">
                        <CardContent>
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-center text-blue-500 font-bold text-3xl">
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
                                    <Link to="/forgot-password">Forgot Password?</Link>
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
        </Container>
    );
};

export default Login;
