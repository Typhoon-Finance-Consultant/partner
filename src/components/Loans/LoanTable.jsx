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
        results: loanList,
        count,
        total_pages,
        current_page,
        page_size,
    } = loanData;
    return (
        <Box className="pb-4 sm:pb-10">
            <Paper
                elevation={2}
                sx={{
                    overflow: 'hidden',
                }}>
                {/* Pagination Controls */}
                <Box className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 border-t">
                    <Box className="flex items-center gap-2">
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}>
                            Rows per page:
                        </Typography>
                        <FormControl size="small">
                            <Select
                                value={page_size}
                                onChange={e =>
                                    onPageSizeChange(Number(e.target.value))
                                }
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 60, sm: 80 },
                                }}>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box className="flex items-center gap-2">
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}>
                            {`${(current_page - 1) * page_size + 1}-${Math.min(current_page * page_size, count)} of ${count}`}
                        </Typography>
                    </Box>

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
                                minHeight: { xs: 40, sm: 52 },
                                paddingLeft: 0,
                            },
                            '.MuiTablePagination-actions': {
                                marginLeft: 0,
                            },
                        }}
                    />
                </Box>
                <TableContainer
                    sx={{
                        overflowX: 'auto',
                        maxHeight: { xs: 'calc(100vh - 250px)', sm: 'none' },
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
                        sx={{
                            minWidth: { xs: 800, sm: 'auto' },
                        }}>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Loan ID
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Application Date
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        minWidth: 120,
                                    }}>
                                    Applicant Name
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Amount Disbursed
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Loan Provider
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        minWidth: 120,
                                    }}>
                                    Status
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Payout %
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Commission
                                </TableCell>
                                <TableCell
                                    className="font-bold"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1.5, sm: 2 },
                                        whiteSpace: 'nowrap',
                                    }}>
                                    Staff Assigned
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loanList
                                ?.slice()
                                .sort(
                                    (a, b) =>
                                        new Date(b.created_date) -
                                        new Date(a.created_date),
                                )
                                .map(loan => (
                                    <TableRow
                                        key={loan.loan_id}
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
                                                to={`/loan-details/${loan.loan_id}`}
                                                className="text-red-600 hover:underline">
                                                {loan.loan_id}
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
                                            {dayjs(loan.created_date).format(
                                                'DD/MM/YYYY',
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
                                            {loan.primary_applicant.full_name}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {loan.amount_disbursed}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {loan?.provider?.name}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {loan.status}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {(loan.partner_commission * 100) /
                                                loan.amount_disbursed ||
                                                'Not Calculated'}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {loan.partner_commission}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontSize: {
                                                    xs: '0.75rem',
                                                    sm: '0.875rem',
                                                },
                                                py: { xs: 1, sm: 2 },
                                            }}>
                                            {loan.assigned_to}
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination Controls */}
                <Box className="flex flex-col sm:flex-row justify-between items-center gap-3 p-3 sm:p-4 border-t">
                    <Box className="flex items-center gap-2">
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}>
                            Rows per page:
                        </Typography>
                        <FormControl size="small">
                            <Select
                                value={page_size}
                                onChange={e =>
                                    onPageSizeChange(Number(e.target.value))
                                }
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 60, sm: 80 },
                                }}>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box className="flex items-center gap-2">
                        <Typography
                            variant="body2"
                            className="text-gray-600"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}>
                            {`${(current_page - 1) * page_size + 1}-${Math.min(current_page * page_size, count)} of ${count}`}
                        </Typography>
                    </Box>

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
                                minHeight: { xs: 40, sm: 52 },
                                paddingLeft: 0,
                            },
                            '.MuiTablePagination-actions': {
                                marginLeft: 0,
                            },
                        }}
                    />
                </Box>
            </Paper>
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
