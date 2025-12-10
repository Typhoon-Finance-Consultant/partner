import React from 'react';
import { Paper, Grid, Box, Typography, Button } from '@mui/material';

const LoanDetailHeader = ({ loanData }) => {
    return (
        <Paper className="p-3 sm:p-4 mb-3 sm:mb-5" elevation={2}>
            <Box>
                <Grid container>
                    <Grid item xs={12}>
                        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-3 sm:mb-4">
                            <Typography
                                variant="h5"
                                sx={{
                                    fontSize: { xs: '1.125rem', sm: '1.5rem' },
                                    fontWeight: 'bold',
                                }}
                                className="break-words">
                                Name: {loanData.primary_applicant.full_name}
                            </Typography>
                            <Box className="w-full sm:w-auto">
                                <Button
                                    size="small"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1, sm: 0.75 },
                                    }}>
                                    Submit for Verification
                                </Button>
                            </Box>
                        </Box>

                        <Box className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 py-3 sm:py-5">
                            <Box className="">
                                <Typography
                                    className="font-bold text-gray-400"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}>
                                    Email:
                                </Typography>
                                <Typography
                                    className="break-all"
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem',
                                            md: '1.125rem',
                                        },
                                    }}>
                                    {loanData.primary_applicant.email}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography
                                    className="font-bold text-gray-400"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}>
                                    Mobile Number:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem',
                                            md: '1.125rem',
                                        },
                                    }}>
                                    {loanData.primary_applicant.mobile_number}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    className="font-bold text-gray-400"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}>
                                    Status:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem',
                                            md: '1.125rem',
                                        },
                                    }}>
                                    {loanData.status}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    className="font-bold text-gray-400"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}>
                                    Loan Type
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem',
                                            md: '1.125rem',
                                        },
                                    }}>
                                    {loanData.loan_type}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    className="font-bold text-gray-400"
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                    }}>
                                    Interest Rate
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '0.875rem',
                                            sm: '1rem',
                                            md: '1.125rem',
                                        },
                                    }}>
                                    {loanData.interest_rate}%
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default React.memo(LoanDetailHeader);
