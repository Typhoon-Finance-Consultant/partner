import React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Typography, Paper } from '@mui/material';

import LabelValue from '&/components/common/TextInfo/LabelValue';

const BasicDetails = ({ profileData }) => {
    return (
        <>
            <Typography variant="h5" className="ml-4">
                {' '}
                Bank Details{' '}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper className="p-5 mt-4 text-justify">
                        <LabelValue
                            labelName="Account Holder Name"
                            labelValue={
                                profileData?.bank_account
                                    ?.name_as_on_bank_account
                            }
                        />
                        <LabelValue
                            labelName="Bank Name"
                            labelValue={profileData?.bank_account?.bank.name}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="Account Verified"
                            labelValue={profileData?.bank_account.is_verified}
                            rowClassName="mt-4"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className="p-5 mt-4 text-justify">
                        <LabelValue
                            labelName="Account Number"
                            labelValue={
                                profileData?.bank_account.account_number
                            }
                        />
                        <LabelValue
                            labelName="Account Type"
                            labelValue={profileData?.bank_account.account_type}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="IFSC"
                            labelValue={profileData?.bank_account.ifsc}
                            labelValueClassName="uppercase"
                            rowClassName="mt-4"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default BasicDetails;
