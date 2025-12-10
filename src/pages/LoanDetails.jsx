import React, { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Tab,
    Tabs,
    Paper,
    Typography,
    // Grid,
    Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { loanDetails } from '&/services/loans';
import { PendingActions } from '@mui/icons-material';
import Loader from '&/components/common/Loader';
import BankAccount from '&/components/Loans/Forms/BankAccount';
import LabelValue from '&/components/common/TextInfo/LabelValue';
import LoanDetailHeader from '&/components/Loans/DetailHeader';
// import Requirements from '&/components/Loans/Forms/Requirements';
import Documents from '&/components/Loans/Forms/Documents';
import Address from '&/components/Loans/Forms/Address';
import IncomeProfile from '&/components/Loans/Forms/IncomeProfile';
import BasicDetails from '&/components/Loans/Forms/BasicProfile';
import References from '&/components/Loans/Forms/References';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const LoanDetails = props => {
    const { loanID } = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const { data, isLoading } = useQuery({
        queryKey: ['loanDetails', loanID],
        queryFn: async () => loanDetails(loanID),
    });
    const handleTabChange = useCallback(
        (event, newValue) => {
            setActiveTab(newValue);
        },
        [activeTab, loanID],
    );

    if (isLoading) {
        return <Loader text="Fetching Loan Details" />;
    }

    const loanData = data?.code === 200 ? data.response?.loan_data : {};
    return (
        <Container
            maxWidth={false}
            className="bg-slate-200 min-h-screen px-2 sm:px-3">
            <div className="py-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 'auto' } }}>
                    <Link to="/loans" replace className="no-underline">
                        Go Back
                    </Link>
                </Button>
                <LabelValue labelName="Loan ID" labelValue={loanID} />
            </div>
            <Box className="w-full pb-4">
                <LoanDetailHeader loanData={loanData} />
                <Paper elevation={2}>
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                minHeight: { xs: 48, sm: 60 },
                                py: { xs: 1, sm: 1.5 },
                            },
                        }}>
                        <Tab label="Basic Profile" />
                        <Tab
                            label="Income Profile"
                            iconPosition="end"
                            icon={
                                loanData?.income_profile ? null : (
                                    <PendingActions fontSize="small" />
                                )
                            }
                        />
                        <Tab
                            label="Address"
                            iconPosition="end"
                            icon={
                                loanData?.address ? null : (
                                    <PendingActions fontSize="small" />
                                )
                            }
                        />
                        <Tab
                            label="Bank"
                            iconPosition="end"
                            icon={
                                loanData?.bank ? null : (
                                    <PendingActions fontSize="small" />
                                )
                            }
                        />

                        <Tab
                            label="References"
                            iconPosition="end"
                            icon={
                                loanData?.references ? null : (
                                    <PendingActions fontSize="small" />
                                )
                            }
                        />
                        <Tab label="Documents" />

                        {/* <Tab label="Requirements" /> */}
                    </Tabs>
                    {/* <CustomTabPanel value={activeTab} index={6}>
                        <Requirements
                            requirementsData={loanData}
                            loanID={loanID}
                        />
                    </CustomTabPanel> */}
                    <CustomTabPanel value={activeTab} index={0}>
                        <BasicDetails
                            profileData={loanData}
                            loanID={loanID}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={2}>
                        <Address
                            address={loanData?.address}
                            loanID={loanID}
                            status={loanData.status}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={3}>
                        <BankAccount
                            bankData={loanData?.bank}
                            loanID={loanID}
                            status={loanData.status}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={1}>
                        <IncomeProfile
                            loanID={loanID}
                            incomeProfile={loanData?.income_profile}
                            status={loanData.status}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={4}>
                        <References
                            loanID={loanID}
                            references={loanData?.references}
                            status={loanData.status}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={5}>
                        <Documents
                            documentData={loanData.documents}
                            loanID={loanID}
                            status={loanData.status}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </CustomTabPanel>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoanDetails;
