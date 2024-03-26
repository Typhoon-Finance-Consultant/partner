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
} from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const InvoiceTable = ({ payoutData }) => {
    if (!payoutData) {
        return <>No Invoices Found</>;
    }
    const { payout_data: invoiceList, count } = payoutData;
    console.log('Invoice Data', invoiceList);

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
                                <TableCell>GST</TableCell>
                                <TableCell>Deductions</TableCell>
                                <TableCell>Total Payout</TableCell>
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
                                    <TableCell>
                                        {parseFloat(invoice.sgst) +
                                            parseFloat(invoice.cgst) +
                                            parseFloat(invoice.igst)}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.deductions || 0}
                                    </TableCell>
                                    <TableCell>
                                        {invoice.total_payable}
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
