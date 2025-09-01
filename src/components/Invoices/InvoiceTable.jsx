import React from 'react';
import {
    TableHead,
    Table,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,
    Box,
    Paper,
    Button,
} from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { coreApi } from '../../services/axiosConfig';

const InvoiceTable = ({ payoutData }) => {
    if (!payoutData) {
        return <>No Invoices Found</>;
    }
    const { payout_data: invoiceList, count } = payoutData;
    console.log('Invoice Data', invoiceList);

    const handleOpenInvoice = async invoiceUrl => {
        try {
            // Extract the path from the invoice URL (remove the leading /api part since baseURL already includes it)
            const invoicePath = invoiceUrl.replace('/api/', '');

            // Create the full URL without port number
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                /:\d+/,
                '',
            ); // Remove port
            const fullUrl = `${baseUrl}${invoicePath}`;

            // Make authenticated request using fetch with manual headers
            const token = await coreApi.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/pdf',
                },
            });

            if (response.ok) {
                // Create a blob from the response data
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Open the PDF in a new window
                window.open(url, '_blank');

                // Clean up the object URL after a short delay
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            } else {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                );
            }
        } catch (error) {
            console.error('Error opening invoice:', error);
            alert('Failed to open invoice. Please try again.');
        }
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Paper>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice ID</TableCell>
                                <TableCell>Invoice Duration</TableCell>
                                <TableCell>Invoice Status</TableCell>
                                <TableCell>Invoice Amount</TableCell>

                                {/* <TableCell>GST</TableCell>
                                <TableCell>Deductions</TableCell> */}
                                <TableCell>Total Payout</TableCell>
                                <TableCell>Invoice Link</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoiceList?.map(invoice => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        <Link
                                            to={`/invoice-details/${invoice.id}`}>
                                            {invoice.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(invoice.to_date).format(
                                            'MMM YYYY',
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.payout_status}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.payout_amount}
                                    </TableCell>

                                    {/* <TableCell>
                                        {parseFloat(invoice.sgst) +
                                            parseFloat(invoice.cgst) +
                                            parseFloat(invoice.igst)}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.deductions || 0}

                                    </TableCell> */}
                                    <TableCell>
                                        {invoice.total_payable}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.invoice ? (
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={() =>
                                                    handleOpenInvoice(
                                                        invoice.invoice,
                                                    )
                                                }
                                                style={{
                                                    color: 'blue',
                                                    textDecoration: 'none',
                                                    textTransform: 'none',
                                                }}>
                                                Open Invoice
                                            </Button>
                                        ) : (
                                            <span style={{ color: 'gray' }}>
                                                No Invoice
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

const propsAreEqual = (prevProps, nextProps) => {
    return prevProps === nextProps;
};

export default React.memo(InvoiceTable, propsAreEqual);
