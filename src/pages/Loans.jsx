import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box, Typography } from '@mui/material';
import { loansList } from '&/services/loans';
import LoanFilters from '&/components/Loans/LoanFilters';
import LoanTable from '&/components/Loans/LoanTable';
import LoanTabsWrapper from '&/components/Loans/LoanTabsWrapper';
import Loader from '&/components/common/Loader';

const Loans = () => {
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 20,
    });

    const body = {
        from_date: !!formData.fromDate
            ? formData.fromDate.format('DD/MM/YYYY')
            : undefined,
        to_date: !!formData.toDate
            ? formData.toDate.format('DD/MM/YYYY')
            : undefined,
        status: formData.status,
        search_string: formData.searchString,
    };

    const { data, isLoading, refetch } = useQuery({
        queryKey: [
            'loanList',
            JSON.stringify(body),
            pagination.page,
            pagination.pageSize,
        ],
        queryFn: async () =>
            loansList(body, pagination.page, pagination.pageSize),
    });

    const handlePageChange = useCallback(newPage => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    const handlePageSizeChange = useCallback(newPageSize => {
        setPagination({ page: 1, pageSize: newPageSize });
    }, []);

    const handleFormUpdate = newFormData => {
        setFormData(newFormData);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const loanData = data;
    const lendenApplications = data?.lendenclub_applications || [];

    if (isLoading) {
        return <Loader />;
    }
    return (
        <Container
            maxWidth={false}
            className="bg-slate-200 min-h-screen px-0 sm:px-3">
            <LoanFilters
                formData={formData}
                setFormData={setFormData}
                handleFormUpdate={handleFormUpdate}
                refetch={refetch}
            />
            <LoanTabsWrapper
                typhoonContent={
                    !loanData?.results?.length ? (
                        <Box className="mx-auto w-full min-h-[50vh] flex items-center justify-center px-4">
                            <Typography
                                className="text-center text-gray-500"
                                sx={{
                                    fontSize: {
                                        xs: '1.5rem',
                                        sm: '2rem',
                                        md: '2.5rem',
                                    },
                                }}>
                                No Loans Found
                            </Typography>
                        </Box>
                    ) : (
                        <LoanTable
                            loanData={loanData}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )
                }
                lendenApplications={lendenApplications}
                typhoonCount={loanData?.count}
                onLendenRefresh={refetch}
            />
        </Container>
    );
};

export default Loans;
