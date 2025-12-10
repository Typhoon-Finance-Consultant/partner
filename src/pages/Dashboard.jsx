import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Container,
    Box,
    Grid,
    Alert,
    Typography,
    Divider,
} from '@mui/material';
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

    // State for loan table - match Loans.jsx
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
    });

    // Parameters for loans API
    const loanQueryParams = {
        from_date: !!formData.fromDate
            ? formData.fromDate.format('DD/MM/YYYY')
            : undefined,
        to_date: !!formData.toDate
            ? formData.toDate.format('DD/MM/YYYY')
            : undefined,
        status: formData.status,
        search_string: formData.searchString,
    };

    // Loan data query
    const {
        data: loanData,
        isLoading: isLoanLoading,
        refetch: refetchLoans,
    } = useQuery({
        queryKey: [
            'dashboardLoanList',
            JSON.stringify(loanQueryParams),
            pagination.page,
            pagination.pageSize,
        ],
        queryFn: async () =>
            loansList(loanQueryParams, pagination.page, pagination.pageSize),
    });

    // Pagination handlers
    const handlePageChange = useCallback(newPage => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);
    const handlePageSizeChange = useCallback(newPageSize => {
        setPagination({ page: 1, pageSize: newPageSize });
    }, []);

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
    const loansResponse = loanData;
    const hasBank = userProfile?.bank_account;

    return (
        <Container
            maxWidth={false}
            className="bg-slate-200 min-h-screen px-0 sm:px-3">
            {!hasBank ? (
                <Box className="py-3 sm:py-5 px-3 sm:px-5">
                    <Alert
                        severity="warning"
                        sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                        }}>
                        Profile is incomplete, Please{' '}
                        <Link
                            className="text-sky-500 underline"
                            to="/update-profile">
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
            <Box className="px-2 sm:px-0">
                <Typography
                    variant="h5"
                    className="my-3 sm:my-4 font-bold px-1"
                    sx={{
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    }}>
                    Recent Loans
                </Typography>

                {!loansResponse?.results?.length ? (
                    <Box className="mx-auto w-full justify-center align-middle my-6 sm:my-10 px-4">
                        <Typography
                            className="text-center text-gray-500"
                            sx={{
                                fontSize: { xs: '1rem', sm: '1.25rem' },
                            }}>
                            No Loans Found
                        </Typography>
                    </Box>
                ) : (
                    <LoanTable
                        loanData={loansResponse}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                )}
            </Box>
        </Container>
    );
};

export default Dashboard;
