import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { payoutDetails } from '&/services/loans';
import Loader from '&/components/common/Loader';
import { Container, Box, Paper, Typography, Button } from '@mui/material';
import LabelValue from '&/components/common/TextInfo/LabelValue';
import InvoiceDetailsTable from '&/components/Invoices/Details';

const InvoiceDetails = () => {
    const { invoiceID } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: ['invoiceDetails'],
        queryFn: async () => payoutDetails(invoiceID),
    });
    if (isLoading) {
        return <Loader loaderText="Loading Invoice Details" />;
    }
    const invoiceData = data?.code === 200 ? data.response : {};
    return (
        <Container maxWidth={false} className="h-full bg-slate-100 p-4">
            <div className="p-4 flex justify-between mb-1 align-middle">
                <Button>
                    <Link to="/invoices" replace>
                        Go Back
                    </Link>
                </Button>
                <LabelValue labelName="Invoice ID" labelValue={invoiceID} />
            </div>
            <InvoiceDetailsTable invoiceData={invoiceData} />
        </Container>
    );
};

export default InvoiceDetails;
