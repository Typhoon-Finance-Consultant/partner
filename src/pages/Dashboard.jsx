import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box, Grid, Alert, Typography, Divider } from '@mui/material';
import user from '&/services/user';
import { loansList } from '&/services/loans';
import InfoCards from '&/components/Dashboard/InfoCards';
import Loader from '&/components/common/Loader';
import { Link } from 'react-router-dom';
import LoanTable from '&/components/Loans/LoanTable';

const Dashboard = () => {
    // Dashboard data queries
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => user.getDashboardData(),
    });
    
    const { data: userData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => user.me(),
    });
    
    // State for loan table - similar to Loans.jsx
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        limit: 10, // Setting lower limit for dashboard
        offset: 0,
    });

    // Parameters for loans API
    const loanQueryParams = {
        from_date: !!formData.fromDate ? formData.fromDate.format('DD/MM/YYYY') : undefined,
        to_date: !!formData.toDate ? formData.toDate.format('DD/MM/YYYY') : undefined,
        status: formData.status,
        search_string: formData.searchString,
        limit: pagination.limit,
        offset: pagination.offset,
    };

    // Loan data query
    const { 
        data: loanData, 
        isLoading: isLoanLoading, 
        refetch: refetchLoans
    } = useQuery({
        queryKey: ['dashboardLoanList', JSON.stringify(loanQueryParams)],
        queryFn: async () => loansList(loanQueryParams),
    });
    
    // Callback to update pagination
    const setPageData = useCallback(data => setPagination(data), []);
    
    // Handler for form updates
    const handleFormUpdate = newFormData => {
        setFormData(newFormData);
        refetchLoans();
    };

    if (isLoading || isProfileLoading || isLoanLoading) {
        return <Loader />;
    }
    
    const dashboardData = data?.response || {};
    const userProfile = userData?.code === 200 ? userData.response : {};
    const loansResponse = loanData?.response;
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
            
            {/* Loan Table Section */}
            <Box >
                <Typography variant="h5" className="my-4 font-bold">
                    Recent Loans
                </Typography>
                
              
                
                {!loansResponse?.loan_data?.length > 0 ? (
                    <Box className="mx-auto w-full justify-center align-middle my-10">
                        <Typography className="text-center" variant="h6">
                            No Loans Found
                        </Typography>
                    </Box>
                ) : (
                    <LoanTable
                        loanData={loansResponse}
                        pagination={pagination}
                        setPagination={setPageData}
                    />
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;
