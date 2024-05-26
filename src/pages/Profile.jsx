import React from 'react';
import { Container, Box, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import user from '&/services/user';
import Loader from '&/components/common/Loader';
import BasicDetails from '&/components/Profile/BasicDetails';
import BankDetails from '&/components/Profile/BankDetails';

const Profile = props => {
    const { data, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => user.me(),
    });

    if (isLoading) {
        return <Loader />;
    }
    console.log('Profile Data', data);
    const profileData = data?.response || {};
    const hasBank = profileData?.bank_account;

    return (
        <Container maxWidth={false} className="bg-slate-200 h-screen">
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
            <Box className="py-8 d">
                <Box className="mb-10 divide-solid ">
                    <BasicDetails profileData={profileData} />
                </Box>
                <Box className="mb-10 divide-solid ">
                    <BankDetails profileData={profileData} />
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
