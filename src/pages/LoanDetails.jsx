import React, { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Tab,
    Tabs,
    Paper,
    Typography,
    Grid,
    Button,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { loanDetails } from '&/services/loans';
import { PendingActions } from '@mui/icons-material';

import Loader from '&/components/common/Loader';
import BankAccount from '&/components/Loans/Forms/BankAccount';
import LabelValue from '&/components/common/TextInfo/LabelValue';
import LoanDetailHeader from '&/components/Loans/DetailHeader';
import Requirements from '&/components/Loans/Forms/Requirements';
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
        <Container maxWidth={false} className="bg-slate-200 h-screen">
            <div className="p-4 flex justify-between align-middle">
                <Button>
                    <Link to="/loans" replace>
                        Go Back
                    </Link>
                </Button>
                <LabelValue labelName="Loan ID" labelValue={loanID} />
            </div>
            <Box className="w-full ">
                <LoanDetailHeader loanData={loanData} />
                <Paper>
                    <Tabs
                        //  orientation="vertical"
                        variant="scrollable"
                        scrollButtons="auto"
                        value={activeTab}
                        onChange={handleTabChange}>
                        <Tab label="Basic Profile" />
                        <Tab label="Documents" />
                        <Tab label="Bank"  iconPosition="end"
                            icon={
                                loanData?.bank ? null : (
                                    <PendingActions fontSize="small" />
                                )
                            }/>

                        <Tab label="Address" 
                        iconPosition="end"
                        icon={
                            loanData?.address ? null : (
                                <PendingActions fontSize="small" />
                            )
                        }
                        />

                        <Tab label="Income Profile" 
                        
                        iconPosition="end"
                        icon={
                            loanData?.income_profile ? null : (
                                <PendingActions fontSize="small" />
                            )
                        }
                        />
                        <Tab label="References" 
                        iconPosition="end"
                        icon={
                            loanData?.references ? null : (
                                <PendingActions fontSize="small" />
                            )
                        }

                        />
                        <Tab label="Requirements" />
                    </Tabs>
                    <CustomTabPanel value={activeTab} index={6}>
                        <Requirements
                            requirementsData={loanData}
                            loanID={loanID}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={0}>
                        <BasicDetails profileData={loanData} loanID={loanID} />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={3}>
                        <Address address={loanData?.address} loanID={loanID} />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={2}>
                        <BankAccount
                            bankData={loanData?.bank}
                            loanID={loanID}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={4}>
                        <IncomeProfile
                            loanID={loanID}
                            incomeProfile={loanData?.income_profile}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={5}>
                        <References
                            loanID={loanID}
                            references={loanData?.references}
                        />
                    </CustomTabPanel>
                    <CustomTabPanel value={activeTab} index={1}>
                        <Documents
                            documentData={loanData.documents}
                            loanID={loanID}
                        />
                    </CustomTabPanel>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoanDetails;
