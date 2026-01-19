import React from 'react';
import {
    Box,
    Paper,
    TablePagination,
    FormControl,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const LoanTable = ({
    loanData,
    pagination,
    onPageChange,
    onPageSizeChange,
}) => {
    const {
        results: loanList = [],
        count,
        total_pages,
        current_page,
        page_size,
    } = loanData;

    return (
        <Box className="pb-4">
            <Box className="grid gap-3">
                {loanList
                    ?.slice()
                    .sort(
                        (a, b) =>
                            new Date(b.created_date) - new Date(a.created_date),
                    )
                    .map(loan => (
                        <Paper key={loan.loan_id} elevation={2} sx={{ p: 2 }}>
                            <Box className="flex justify-between items-start gap-2 mb-2">
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                        }}>
                                        <Link
                                            to={`/loan-details/${loan.loan_id}`}
                                            className="text-red-600 hover:underline">
                                            {loan.loan_id}
                                        </Link>
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            color: '#6b7280',
                                        }}>
                                        {dayjs(loan.created_date).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </Typography>
                                </Box>
                                <Box className="text-right">
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            color: '#374151',
                                            fontWeight: 600,
                                        }}>
                                        {loan.status}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className="grid grid-cols-2 md:grid-cols-6 gap-x-4 gap-y-1.5">
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Applicant:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                        }}>
                                        {loan.primary_applicant.full_name}
                                    </Typography>
                                </Box>
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Amount Disbursed:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                        }}>
                                        {loan.amount_disbursed}
                                    </Typography>
                                </Box>
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Loan Provider:
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.85rem' }}>
                                        {loan?.provider?.name}
                                    </Typography>
                                </Box>
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Payout %:
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.85rem' }}>
                                        {(loan.partner_commission * 100) /
                                            loan.amount_disbursed ||
                                            'Not Calculated'}
                                    </Typography>
                                </Box>
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Commission:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                        }}>
                                        {loan.partner_commission}
                                    </Typography>
                                </Box>
                                <Box className="flex flex-col">
                                    <Typography
                                        sx={{
                                            fontSize: '0.75rem',
                                            color: '#6b7280',
                                        }}>
                                        Staff Assigned:
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.85rem' }}>
                                        {loan.assigned_to}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
            </Box>
            {/* Pagination Controls */}
            <Box className="flex flex-col gap-3 p-3 border-t mt-3">
                <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-2">
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: '0.75rem',
                            }}>
                            Rows per page:
                        </Typography>
                        <FormControl size="small" sx={{ minWidth: 60 }}>
                            <Select
                                value={page_size}
                                onChange={e =>
                                    onPageSizeChange(Number(e.target.value))
                                }
                                sx={{
                                    fontSize: '0.75rem',
                                }}>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: '0.75rem',
                            }}>
                            {`${(current_page - 1) * page_size + 1}-${Math.min(current_page * page_size, count)} of ${count}`}
                        </Typography>
                    </Box>
                </Box>
                <Box className="flex justify-center">
                    <TablePagination
                        component="div"
                        count={count}
                        page={current_page - 1}
                        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
                        rowsPerPage={page_size}
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={() => ''}
                        sx={{
                            '.MuiTablePagination-toolbar': {
                                display: 'flex',
                                justifyContent: 'center',
                                minHeight: 40,
                                paddingLeft: 0,
                            },
                            '.MuiTablePagination-actions': {
                                marginLeft: 0,
                            },
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

const propsAreEqual = (prevProps, nextProps) => {
    // Compare loanData shallowly (results, count, page info)
    const prevLoanData = prevProps.loanData;
    const nextLoanData = nextProps.loanData;
    const loanDataEqual =
        prevLoanData === nextLoanData ||
        (prevLoanData?.count === nextLoanData?.count &&
            prevLoanData?.current_page === nextLoanData?.current_page &&
            prevLoanData?.page_size === nextLoanData?.page_size &&
            prevLoanData?.total_pages === nextLoanData?.total_pages &&
            JSON.stringify(prevLoanData?.results) ===
                JSON.stringify(nextLoanData?.results));

    // Compare pagination object
    const paginationEqual =
        JSON.stringify(prevProps.pagination) ===
        JSON.stringify(nextProps.pagination);

    // Compare handlers
    const handlersEqual =
        prevProps.onPageChange === nextProps.onPageChange &&
        prevProps.onPageSizeChange === nextProps.onPageSizeChange;

    return loanDataEqual && paginationEqual && handlersEqual;
};

export default React.memo(LoanTable, propsAreEqual);
