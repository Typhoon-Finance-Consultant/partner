import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box, Grid, Alert } from '@mui/material';
import user from '&/services/user';
import InfoCards from '&/components/Dashboard/InfoCards';
import Loader from '&/components/common/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => user.getDashboardData(),
    });
    const { data: userData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => user.me(),
    });
    if (isLoading || isProfileLoading) {
        return <Loader />;
    }
    const dashboardData = data?.response || {};
    const userProfile = userData?.code === 200 ? userData.response : {};

    console.log('Dashboard Data', data);
    const hasBank = userProfile?.bank_account;
    return (
        <Container
            maxWidth={false}
            className="bg-slate-200 min-h-lvh mt-5 sm:mt-0">
            {!hasBank ? (
                <Box className="py-5 mx-5">
                    <Alert severity="warning">
                        Profile is incomplete, Please{' '}
                        <Link className="text-sky-500" to="/update-profile">
                            click here
                        </Link>{' '}
                        to continue
                    </Alert>
                </Box>
            ) : null}
            <Grid container>
                <Grid item xs={12}>
                    <InfoCards dashboardData={dashboardData} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
