import React from 'react';
import { Paper, Grid, Box, Typography, Button } from '@mui/material';

const LoanDetailHeader = ({ loanData }) => {
    return (
        <Paper className="p-4 mb-5">
            <Box>
                <Grid container>
                    <Grid item xs={12}>
                        <Box className="flex justify-between">
                            <Typography variant="h5">
                                Name: {loanData.primary_applicant.full_name}
                            </Typography>
                            <Box>
                                <Button
                                    className=""
                                    size="small"
                                    variant="contained">
                                    Submit for Verification
                                </Button>
                            </Box>
                        </Box>

                        <Box className="grid md:grid-cols-5 xs:grid-cols-2 sm:grid-cols-2 py-5">
                            <Box className="">
                                <Typography className="font-bold text-sm text-gray-400">
                                    {' '}
                                    Email:
                                </Typography>
                                <Typography className="text-lg">
                                    {loanData.primary_applicant.email}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography className="font-bold text-sm text-gray-400">
                                    {' '}
                                    Mobile Number:{' '}
                                </Typography>
                                <Typography className="text-lg">
                                    {loanData.primary_applicant.mobile_number}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography className="font-bold text-sm text-gray-400">
                                    {' '}
                                    Status:{' '}
                                </Typography>
                                <Typography className="text-lg">
                                    {loanData.status}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography className="font-bold text-sm text-gray-400">
                                    {' '}
                                    Loan Type
                                </Typography>
                                <Typography className="text-lg">
                                    {loanData.loan_type}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography className="font-bold text-sm text-gray-400">
                                    {' '}
                                    Interest Rate
                                </Typography>
                                <Typography className="text-lg">
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
