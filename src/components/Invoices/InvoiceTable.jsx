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

    // Sort invoices by to_date in descending order (latest first)
    const sortedInvoiceList = invoiceList
        ? [...invoiceList].sort((a, b) => {
              return dayjs(b.to_date).valueOf() - dayjs(a.to_date).valueOf();
          })
        : [];

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
            <Paper elevation={2}>
                <TableContainer
                    sx={{
                        overflowX: 'auto',
                        maxHeight: { xs: 'calc(100vh - 200px)', sm: 'none' },
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderRadius: 4,
                        },
                    }}>
                    <Table
                        stickyHeader
                        sx={{ minWidth: { xs: 700, sm: 'auto' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Invoice ID
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Invoice Duration
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Invoice Status
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Invoice Amount
                                </TableCell>

                                {/* <TableCell>GST</TableCell>
                                <TableCell>Deductions</TableCell> */}
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Total Payout
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Invoice Link
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedInvoiceList?.map(invoice => (
                                <TableRow
                                    key={invoice.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}>
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
                                        <Link
                                            to={`/invoice-details/${invoice.id}`}
                                            className="text-red-600 hover:underline">
                                            {invoice.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
                                        {dayjs(invoice.to_date).format(
                                            'MMM YYYY',
                                        )}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
                                        {invoice.payout_status}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
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
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
                                        {invoice.total_payable}
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            fontSize: {
                                                xs: '0.75rem',
                                                sm: '0.875rem',
                                            },
                                            py: { xs: 1, sm: 2 },
                                        }}>
                                        {invoice.invoice ? (
                                            <Button
                                                variant="text"
                                                size="small"
                                                onClick={() =>
                                                    handleOpenInvoice(
                                                        invoice.invoice,
                                                    )
                                                }
                                                sx={{
                                                    color: 'primary',
                                                    textDecoration: 'none',
                                                    textTransform: 'none',
                                                    fontSize: {
                                                        xs: '0.75rem',
                                                        sm: '0.875rem',
                                                    },
                                                    py: { xs: 0.5, sm: 1 },
                                                }}>
                                                Open Invoice
                                            </Button>
                                        ) : (
                                            <span
                                                style={{
                                                    color: 'gray',
                                                    fontSize: 'inherit',
                                                }}>
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
