import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Container, Box, Typography } from '@mui/material';
import InvoiceFilter from '&/components/Invoices/InvoiceFilter';
import InvoiceTable from '&/components/Invoices/InvoiceTable';
import Loader from '&/components/common/Loader';
import { payoutList } from '&/services/loans';
import dayjs from 'dayjs';

const Invoices = () => {
    const [formData, setFormData] = useState({});
    const [pagination, setPagination] = useState({
        limit: 20,
        offset: 0,
    });

    const body = {
        status: formData?.status,
        search_string: formData?.searchString,
        invoice_month: formData?.invoiceMonth
            ? dayjs(formData?.invoiceMonth).format('MM')
            : null,
        invoice_year: formData?.invoiceMonth
            ? dayjs(formData?.invoiceMonth).format('YYYY')
            : null,
        limit: pagination.limit,
        offset: pagination.offset,
    };
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['payoutList', JSON.stringify(body)],
        queryFn: async () => payoutList(body),
    });
    const setPageData = useCallback(data => setPagination(data), [pagination]);
    const handleFormUpdate = newFormData => {
        setFormData(newFormData);
        refetch();
    };
    const payoutData = data?.response;
    if (isLoading) {
        return <Loader />;
    }

    return (
        <Container maxWidth={false} className="h-full bg-slate-200 p-4">
            <InvoiceFilter
                formData={formData}
                setFormData={setFormData}
                refetch={refetch}
                handleFormUpdate={handleFormUpdate}
            />
            {!payoutData?.payout_data?.length > 0 ? (
                <Box className="mx-auto w-full min-h-lvh justify-center  align-middle sm:mt-20">
                    <Typography className="text-center sm:mt-20" variant="h3">
                        No Invoices Found
                    </Typography>
                </Box>
            ) : (
                <InvoiceTable
                    payoutData={payoutData}
                    setPageData={setPageData}
                    pagination={pagination}
                />
            )}
        </Container>
    );
};

export default Invoices;
