import React, { useState } from 'react';
import {
    Paper,
    Grid,
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useLendenClub } from '&/hooks/useLendenClub';
import { mapLoanDataToLendenPayload } from '&/helpers/lenden';

const LoanDetailHeader = ({ loanData }) => {
    const navigate = useNavigate();
    const { submitLoan, loading } = useLendenClub();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleVerifyClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmDialog(false);
        try {
            // Prepare payload
            // Note: useLendenClub hook handles consent generation internally
            const payload = mapLoanDataToLendenPayload(loanData).payload;

            // Remove redundant fields that useLendenClub will add/manage
            delete payload.consent_data;
            delete payload.redirection_url; // Hook sets default

            await submitLoan(
                payload,
                // Success Callback
                data => {
                    if (data.isDuplicate) {
                        setSnackbar({
                            open: true,
                            message: `Customer exists. Status: ${data.existingLead.status}`,
                            severity: 'warning',
                        });
                    } else {
                        // Success - redirect to Loans page with Lenden tab selected
                        navigate('/loans', { state: { activeTab: 1 } });
                    }
                },
                // Error Callback
                errMsg => {
                    setSnackbar({
                        open: true,
                        message: errMsg,
                        severity: 'error',
                    });
                },
            );
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.message || 'Verification Failed',
                severity: 'error',
            });
        }
    };

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
                                    onClick={handleVerifyClick}
                                    disabled={loading}
                                    sx={{
                                        fontSize: {
                                            xs: '0.75rem',
                                            sm: '0.875rem',
                                        },
                                        py: { xs: 1, sm: 0.75 },
                                    }}>
                                    {loading ? (
                                        <>
                                            <CircularProgress
                                                size={16}
                                                sx={{ mr: 1 }}
                                                color="inherit"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit to LendenClub'
                                    )}
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

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                aria-labelledby="submit-dialog-title"
                aria-describedby="submit-dialog-description">
                <DialogTitle id="submit-dialog-title">
                    Submit Application to Lender?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="submit-dialog-description">
                        You are about to submit this loan application to
                        LendenClub. You will be redirected to their platform to
                        complete KYC and other formalities. Do you want to
                        proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowConfirmDialog(false)}
                        color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        autoFocus>
                        Yes, Submit
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default React.memo(LoanDetailHeader);
