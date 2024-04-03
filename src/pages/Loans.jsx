import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Box } from '@mui/material';
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
        queryKey: ['loanList'],
        queryFn: async () => loansList(body),
    });
    const setPageData = useCallback(data => setPagination(data), [pagination]);

    const loanData = data?.response;
    if (isLoading) {
        return <Loader />;
    }
    console.log('Use Effect Data Form', formData);
    return (
        <Container maxWidth={false} className="bg-slate-100 h-screen">
            <LoanFilters formData={formData} setFormData={setFormData} />
            <LoanTable
                loanData={loanData}
                pagination={pagination}
                setPagination={setPageData}
            />
        </Container>
    );
};

export default Loans;
