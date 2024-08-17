import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box, Typography } from '@mui/material';
import { loansList } from '&/services/loans';
import LoanFilters from '&/components/Loans/LoanFilters';
import LoanTable from '&/components/Loans/LoanTable';
import Loader from '&/components/common/Loader';

const Loans = () => {
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        limit: 20,
        offset: 0,
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
        limit: pagination.limit,
        offset: pagination.offset,
    };
    console.log('Body_____Data', body);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['loanList', JSON.stringify(body)],
        queryFn: async () => loansList(body),
    });
    const setPageData = useCallback(data => setPagination(data), [pagination]);
    const handleFormUpdate = newFormData => {
        setFormData(newFormData);
        refetch();
    };

    const loanData = data?.response;
    if (isLoading) {
        return <Loader />;
    }
    console.log('Use Effect Data Form', formData);
    return (
        <Container maxWidth={false} className="bg-slate-200 min-h-lvh">
            <LoanFilters
                formData={formData}
                setFormData={setFormData}
                handleFormUpdate={handleFormUpdate}
                refetch={refetch}
            />
            {!loanData?.loan_data?.length > 0 ? (
                <Box className="mx-auto w-full min-h-lvh justify-center  align-middle sm:mt-20">
                    <Typography className="text-center sm:mt-20" variant="h3">
                        No Loans Found
                    </Typography>
                </Box>
            ) : (
                <LoanTable
                    loanData={loanData}
                    pagination={pagination}
                    setPagination={setPageData}
                />
            )}
        </Container>
    );
};

export default Loans;
