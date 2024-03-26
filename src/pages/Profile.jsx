import React from 'react';
import { Container, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
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
    return (
        <Container maxWidth={false} className="bg-slate-100 h-screen">
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
