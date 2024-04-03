import React, { useState } from 'react';
import { Container, Box, Snackbar, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import UpdateProfileForm from '&/components/Profile/UpdateProfileForm.jsx';
import Loader from '&/components/common/Loader';
import user from '&/services/user';

const UpdateProfile = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => user.getDashboardData(),
    });
    const navigate = useNavigate();
    if (isLoading) {
        return <Loader />;
    }
    const dashboardData = data?.response || {};
    console.log('Update Profile Data', data);
    const hasBank = dashboardData?.bank_account;
    if (hasBank) {
        return navigate('/profile');
    }
    return (
        <Container maxWidth={false} className="bg-slate-100 h-screen">
            <Grid container className="pt-10 ">
                <Grid item xs={12} md={6} className="mx-auto">
                    {/* <Box> */}

                    <UpdateProfileForm
                        setModalOpen={setModalOpen}
                        setSnackbarMessage={setSnackbarMessage}
                    />

                    {/* </Box> */}
                    <Snackbar
                        open={modalOpen}
                        autoHideDuration={6000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        onClose={() => setModalOpen(false)}
                        message={snackbarMessage}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default UpdateProfile;
