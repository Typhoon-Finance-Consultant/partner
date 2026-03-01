import React from 'react';
import IconCard from '../common/Cards/IconCard';
import { PendingActions, TaskAlt, Sync, Checklist } from '@mui/icons-material';

const InfoCards = ({ dashboardData }) => {
    const { loans } = dashboardData;
    return (
        <div className="grid gap-2 sm:gap-4 grid-cols-4 lg:grid-cols-4 py-2 sm:py-5 px-2 sm:px-0">
            <IconCard
                boxTitle="Draft Loans"
                boxValue={loans?.draft_loans || 0}
                iconName={
                    <PendingActions color="primary" sx={{ fontSize: 50 }} />
                }
            />
            <IconCard
                boxTitle="In Process Loans"
                boxValue={loans?.in_process_loans || 0}
                iconName={<Sync color="primary" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Disbursed Loans"
                boxValue={loans?.disbursed_loans || 0}
                iconName={<TaskAlt color="primary" sx={{ fontSize: 50 }} />}
            />
            <IconCard
                boxTitle="Total Loans"
                boxValue={loans?.total_loan_count || 0}
                iconName={<Checklist color="primary" sx={{ fontSize: 50 }} />}
            />
        </div>
    );
};

export default InfoCards;
