import React from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Typography, Paper } from '@mui/material';

import LabelValue from '&/components/common/TextInfo/LabelValue';
import dayjs from 'dayjs';

const BasicDetails = ({ profileData }) => {
    return (
        <>
            <Typography variant="h5" className="ml-4">
                {' '}
                Basic Details{' '}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper className="p-5 mt-4 text-justify">
                        <LabelValue
                            labelName="Business Name"
                            labelValue={profileData?.entity_name}
                        />

                        <LabelValue
                            labelName="Contact Name"
                            labelValue={profileData?.partner.full_name}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="Email"
                            labelValue={profileData?.partner.email}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="Mobile Number"
                            labelValue={profileData?.partner.mobile_number}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="Registered on"
                            labelValue={dayjs(profileData?.created_date).format(
                                'DD MMM YYYY',
                            )}
                            rowClassName="mt-4"
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper className="p-5 mt-4 text-justify">
                        <LabelValue
                            labelName="Partner Code"
                            labelValue={profileData?.partner_code}
                        />
                        <LabelValue
                            labelName="Partner Category"
                            labelValue={profileData?.type}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="Pan"
                            labelValue={profileData?.partner.pan}
                            rowClassName="mt-4"
                        />
                        <LabelValue
                            labelName="GST Number"
                            labelValue={profileData?.gst_number}
                            rowClassName="mt-4"
                            labelValueClassName="uppercase"
                        />

                        <LabelValue
                            labelName="Address"
                            labelValue={profileData?.address}
                            rowClassName="mt-4"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default BasicDetails;
