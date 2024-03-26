import React from 'react';
import { Paper, Box, Divider } from '@mui/material';
import LabelValue from '&/components/common/TextInfo/LabelValue';
import dayjs from 'dayjs';

const InvoiceDetailsTable = ({ invoiceData }) => {
    return (
        <Paper className="p-4">
            <Box>
                <LabelValue
                    labelName="Invoice ID"
                    labelValue={invoiceData.payout_id}
                    rowClassName=""
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Invoice From"
                    labelValue={dayjs(invoiceData.from_date).format(
                        'DD/MMM/YYYY',
                    )}
                />
                <Divider className="my-2" />

                <LabelValue
                    labelName="Invoice to"
                    labelValue={dayjs(invoiceData.to_date).format(
                        'DD/MMM/YYYY',
                    )}
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Invoice Link"
                    labelValue={invoiceData.invoice}
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Status"
                    labelValue={invoiceData.payout_status}
                />
                <Divider className="my-2" />

                <LabelValue
                    labelName="Total Payout"
                    labelValue={invoiceData.payout_amount}
                />
                <Divider className="my-2" />

                <LabelValue labelName="CGST" labelValue={invoiceData.cgst} />
                <Divider className="my-2" />
                <LabelValue labelName="SGST" labelValue={invoiceData.sgst} />
                <Divider className="my-2" />
                <LabelValue labelName="IGST" labelValue={invoiceData.igst} />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Other Deductions"
                    labelValue={invoiceData.other_deductables_total}
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Final Payable Amount"
                    labelValue={invoiceData.total_payable}
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Payment Date"
                    labelValue={
                        invoiceData.payout_date &&
                        dayjs(invoiceData.payout_date).format('DD/MMM/YYYY')
                    }
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Bank Reference Number"
                    labelValue={invoiceData.bank_reference_number}
                />
                <Divider className="my-2" />

                <LabelValue
                    labelName="Remark"
                    labelValue={invoiceData.remark}
                />
                <Divider className="my-2" />
            </Box>
        </Paper>
    );
};

export default InvoiceDetailsTable;
