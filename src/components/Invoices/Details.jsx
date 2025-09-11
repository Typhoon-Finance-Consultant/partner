import React from 'react';
import { Paper, Box, Divider, Button } from '@mui/material';
import LabelValue from '&/components/common/TextInfo/LabelValue';
import dayjs from 'dayjs';
import { coreApi } from '../../services/axiosConfig';

const InvoiceDetailsTable = ({ invoiceData }) => {
    const handleOpenInvoice = async invoiceUrl => {
        try {
            // Extract the path from the invoice URL (remove the leading /api part since baseURL already includes it)
            const invoicePath = invoiceUrl.replace('/api/', '');

            // Create the full URL without port number
            const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(
                /:\d+/,
                '',
            ); // Remove port
            const fullUrl = `${baseUrl}${invoicePath}`;

            // Make authenticated request using fetch with manual headers
            const token = await coreApi.getToken();
            if (!token) {
                alert('Authentication required. Please login again.');
                return;
            }

            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/pdf',
                },
            });

            if (response.ok) {
                // Create a blob from the response data
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Open the PDF in a new window
                window.open(url, '_blank');

                // Clean up the object URL after a short delay
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            } else {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                );
            }
        } catch (error) {
            console.error('Error opening invoice:', error);
            alert('Failed to open invoice. Please try again.');
        }
    };

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
                    labelValue={
                        invoiceData.invoice ? (
                            <Button
                                variant="text"
                                size="small"
                                onClick={() =>
                                    handleOpenInvoice(invoiceData.invoice)
                                }
                                style={{
                                    color: 'blue',
                                    textDecoration: 'none',
                                    textTransform: 'none',
                                    padding: 0,
                                    minWidth: 'auto',
                                }}>
                                Open Invoice
                            </Button>
                        ) : (
                            <span style={{ color: 'gray' }}>No Invoice</span>
                        )
                    }
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
                    labelName="TDS Deduction"
                    labelValue={invoiceData.tds_deduction}
                />
                <Divider className="my-2" />
                <LabelValue
                    labelName="Advance Deduction"
                    labelValue={invoiceData.advance_deduction}
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
