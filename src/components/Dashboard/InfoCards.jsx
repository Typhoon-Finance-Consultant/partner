import React from 'react';
import IconCard from '../common/Cards/IconCard';
import {
    PendingActions,
    TaskAlt,
    Sync,
    Checklist,
} from '@mui/icons-material';

const InfoCards = ({ dashboardData }) => {
    const { loans } = dashboardData;
    return (
        <div className="grid gap-4 md:grid-cols-4 xs:grid-cols-1 md:py-5 xs:mt-5">
            <IconCard
                boxTitle="Draft Loans"
                boxValue={loans?.draft_loans || 0}
                iconName={
                    <PendingActions color="white" sx={{ fontSize: 50 }} />
                }
            />
            <IconCard
                boxTitle="In Process Loans"
                
                boxValue={loans?.in_process_loans|| 0}
                iconName={<Sync color="white" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Disbursed Loans"
                boxValue={loans?.disbursed_loans || 0}
                iconName={<TaskAlt color="white" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Total Loans"
                boxValue={loans?.total_loan_count || 0}
                iconName={<Checklist color="white" sx={{ fontSize: 50 }} />}
            />
        </div>
    );
};

export default InfoCards;
