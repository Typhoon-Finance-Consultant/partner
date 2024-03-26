import React from 'react';
import IconCard from '../common/Cards/IconCard';
import {
    PendingActions,
    TaskAlt,
    Dangerous,
    Checklist,
} from '@mui/icons-material';

const InfoCards = ({ dashboardData }) => {
    const { loans } = dashboardData;
    return (
        <div className="grid gap-4 md:grid-cols-4 xs:grid-cols-1 md:py-5">
            <IconCard
                boxTitle="Pending Loans"
                boxValue={loans.pending_loan}
                iconName={
                    <PendingActions color="white" sx={{ fontSize: 50 }} />
                }
            />
            <IconCard
                boxTitle="Disbursed Loans"
                
                boxValue={loans.processed_loan}
                iconName={<TaskAlt color="white" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Rejected Loans"
                boxValue={loans.rejected_loan}
                iconName={<Dangerous color="white" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Total Loans"
                boxValue={loans.total_loan_count}
                iconName={<Checklist color="white" sx={{ fontSize: 50 }} />}
            />
        </div>
    );
};

export default InfoCards;
