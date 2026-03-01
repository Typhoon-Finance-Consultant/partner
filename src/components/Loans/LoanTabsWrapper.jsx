import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Tab,
    Tabs,
    Badge,
    Typography,
    Snackbar,
    Alert,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LendenClubApplicationCard from './LendenClubApplicationCard';
import { smartRetry } from '&/services/lendenclub';

/**
 * TabPanel component — renders content for the active tab
 */
function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`loan-tabpanel-${index}`}
            aria-labelledby={`loan-tab-${index}`}
            {...other}>
            {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
        </div>
    );
}

/**
 * Deduplicates applications by ldc_lead_id (keeping the latest by created_date),
 * then sorts newest-first. Mirrors the logic in loan-portal's DashboardPage.tsx.
 */
const deduplicateAndSort = (applications = []) => {
    const uniqueAppsMap = new Map();
    const appsWithoutLeadId = [];

    applications.forEach(app => {
        if (!app.ldc_lead_id) {
            appsWithoutLeadId.push(app);
        } else {
            const existing = uniqueAppsMap.get(app.ldc_lead_id);
            if (
                !existing ||
                new Date(app.created_date) > new Date(existing.created_date)
            ) {
                uniqueAppsMap.set(app.ldc_lead_id, app);
            }
        }
    });

    const result = [
        ...appsWithoutLeadId,
        ...Array.from(uniqueAppsMap.values()),
    ];
    result.sort(
        (a, b) =>
            new Date(b.created_date).getTime() -
            new Date(a.created_date).getTime(),
    );
    return result;
};

/**
 * Reusable tab wrapper for switching between Typhoon Loans and Lenden Loans.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.typhoonContent - Content to render in the Typhoon Loans tab
 * @param {Array} props.lendenApplications - Raw lendenclub_applications from API response
 * @param {number} props.typhoonCount - Badge count for Typhoon tab
 * @param {Function} props.onLendenRefresh - Callback to re-fetch the full loans list after a smart-retry
 */
const LoanTabsWrapper = ({
    typhoonContent,
    lendenApplications = [],
    typhoonCount,
    onLendenRefresh,
}) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab ?? 0);
    const [toast, setToast] = useState(null);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCloseToast = () => setToast(null);

    const showToast = (message, severity) => {
        setToast({ message, severity });
    };

    // Smart-retry handler — mirrors loan-portal's DashboardPage logic
    const handleSmartRetry = useCallback(
        async internalLeadId => {
            try {
                const resp = await smartRetry(internalLeadId);
                const status = resp?.status;
                const respData = resp?.data;

                switch (status) {
                    case 'success': {
                        showToast('Application status updated!', 'success');
                        // If a redirection link came back, auto-open it
                        if (respData?.redirection_link) {
                            window.open(respData.redirection_link, '_blank');
                        }
                        // Refresh the full list to get latest state
                        if (onLendenRefresh) await onLendenRefresh();
                        break;
                    }
                    case 'pending': {
                        showToast(
                            `Still processing — Attempt ${respData?.retry_count ?? '?'} of ${respData?.max_retries ?? 5}. You can try again.`,
                            'info',
                        );
                        if (onLendenRefresh) await onLendenRefresh();
                        break;
                    }
                    case 'max_retries_reached': {
                        showToast(
                            'Maximum retries reached. Please contact support for assistance.',
                            'error',
                        );
                        if (onLendenRefresh) await onLendenRefresh();
                        break;
                    }
                    case 'no_payload': {
                        showToast(
                            'No application data found. Please contact support.',
                            'error',
                        );
                        if (onLendenRefresh) await onLendenRefresh();
                        break;
                    }
                    case 'error':
                    default: {
                        showToast(
                            resp?.message ||
                                'Something went wrong. Please try again.',
                            'error',
                        );
                        if (onLendenRefresh) await onLendenRefresh();
                        break;
                    }
                }
            } catch (error) {
                console.error('Smart-retry failed:', error);
                showToast(
                    'Failed to refresh status. Please check your connection and try again.',
                    'error',
                );
            }
        },
        [onLendenRefresh],
    );

    const processedApplications = deduplicateAndSort(lendenApplications);

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="Loan type tabs"
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        },
                    }}>
                    <Tab
                        icon={<AccountBalanceIcon fontSize="small" />}
                        iconPosition="start"
                        label={
                            <Box className="flex items-center gap-1">
                                Typhoon Loans
                                {typhoonCount !== undefined &&
                                    typhoonCount > 0 && (
                                        <Badge
                                            badgeContent={typhoonCount}
                                            color="primary"
                                            max={999}
                                            sx={{ ml: 1.5 }}
                                        />
                                    )}
                            </Box>
                        }
                        id="loan-tab-0"
                        aria-controls="loan-tabpanel-0"
                    />
                    <Tab
                        icon={<HandshakeIcon fontSize="small" />}
                        iconPosition="start"
                        label={
                            <Box className="flex items-center gap-1">
                                Lenden Loans
                                {processedApplications.length > 0 && (
                                    <Badge
                                        badgeContent={
                                            processedApplications.length
                                        }
                                        color="secondary"
                                        max={999}
                                        sx={{ ml: 1.5 }}
                                    />
                                )}
                            </Box>
                        }
                        id="loan-tab-1"
                        aria-controls="loan-tabpanel-1"
                    />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                {typhoonContent}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                {processedApplications.length === 0 ? (
                    <div className="ldc-empty-state">
                        <div className="ldc-empty-icon">📄</div>
                        <h3 className="ldc-empty-title">
                            No LendenClub applications yet
                        </h3>
                        <p className="ldc-empty-text">
                            Submit a loan for verification to see LendenClub
                            applications here.
                        </p>
                    </div>
                ) : (
                    <Box>
                        {processedApplications.map(app => (
                            <LendenClubApplicationCard
                                key={app.id}
                                application={app}
                                onSmartRetry={handleSmartRetry}
                            />
                        ))}
                    </Box>
                )}
            </TabPanel>

            {/* Toast / Snackbar */}
            <Snackbar
                open={!!toast}
                autoHideDuration={5000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                {toast ? (
                    <Alert
                        onClose={handleCloseToast}
                        severity={toast.severity}
                        sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Box>
    );
};

export default React.memo(LoanTabsWrapper);
