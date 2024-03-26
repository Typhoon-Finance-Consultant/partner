import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Container } from '@mui/material';
import InvoiceFilter from '&/components/Invoices/InvoiceFilter';
import InvoiceTable from '&/components/Invoices/InvoiceTable';
import Loader from '&/components/common/Loader';
import { payoutList } from '&/services/loans';

const Invoices = () => {
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        limit: 20,
        offset: 0,
    });
    const body = {};
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['payoutList', formData, pagination],
        queryFn: async () => payoutList(body),
    });
    const setPageData = useCallback(data => setPagination(data), [pagination]);

    const payoutData = data?.response;
    if (isLoading) {
        return <Loader />;
    }

    return (
        <Container maxWidth={false} className="h-full bg-slate-100 p-4">
            <InvoiceFilter formData={formData} setFormData={setFormData} />
            <InvoiceTable
                payoutData={payoutData}
                setPageData={setPageData}
                pagination={pagination}
            />
        </Container>
    );
};

export default Invoices;
