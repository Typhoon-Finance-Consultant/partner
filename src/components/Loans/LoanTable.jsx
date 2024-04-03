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

const LoanTable = ({ loanData }) => {
    const { loan_data: loanList, count } = loanData;
    console.log('Loan Data', loanList);
    return (
        <Box>
            <Paper
                sx={{
                    overflowX: 'scroll',
                }}>
                <TableContainer
                    sx={{
                        overflowX: 'scroll',
                    }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Loan ID</TableCell>
                                <TableCell>Application Date</TableCell>
                                <TableCell>Applicant Name</TableCell>
                                <TableCell>Loan Amount </TableCell>
                                <TableCell>Amount Disbursed </TableCell>

                                <TableCell>ROI </TableCell>
                                <TableCell>Status </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loanList?.map(loan => (
                                <TableRow key={loan.loan_id}>
                                    <TableCell>
                                        <Link
                                            to={`/loan-details/${loan.loan_id}`}>
                                            {' '}
                                            {loan.loan_id}
                                        </Link>{' '}
                                    </TableCell>
                                    <TableCell>
                                        {dayjs(loan.created_date).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {loan.primary_applicant.full_name}
                                    </TableCell>
                                    <TableCell>{loan.amount}</TableCell>
                                    <TableCell>
                                        {loan.amount_disbursed}
                                    </TableCell>
                                    <TableCell>{loan.interest_rate}</TableCell>
                                    <TableCell>{loan.status}</TableCell>
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
    console.log(prevProps, 'nn \n', nextProps);
    console.log('Are equal', prevProps === nextProps);
};

export default React.memo(LoanTable, propsAreEqual);
