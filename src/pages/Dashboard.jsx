import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box, Grid } from '@mui/material';
import user from '&/services/user';
import InfoCards from '&/components/Dashboard/InfoCards';
import Loader from '&/components/common/Loader';

const Dashboard = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => user.getDashboardData(),
    });
    if (isLoading) {
        return <Loader />;
    }
    const dashboardData = data?.response || {};
    console.log('Dashboard Data', data);
    return (
        <Container maxWidth={false} className='bg-slate-100 h-screen'>
            <Grid container>
                <Grid item xs={12}>
                    <InfoCards dashboardData={dashboardData} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
