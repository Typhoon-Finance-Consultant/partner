import React from 'react';
import './LendenClub.css';

/**
 * Formats a date string to DD/MM/YYYY
 */
const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Repayment Schedule table component.
 * Renders EMI schedule from last_event_data.repayment_schedule
 */
const RepaymentSchedule = ({ lastEventData }) => {
    if (
        !lastEventData?.repayment_schedule ||
        lastEventData.repayment_schedule.length === 0
    ) {
        return null;
    }

    return (
        <div className="ldc-repayment-section">
            <h4 className="ldc-section-title">Repayment Schedule</h4>
            <div className="ldc-table-container">
                <table className="ldc-repayment-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastEventData.repayment_schedule.map(emi => (
                            <tr key={emi.emiNumber}>
                                <td>{emi.emiNumber}</td>
                                <td>{formatDate(emi.dueDate)}</td>
                                <td>
                                    ₹
                                    {parseFloat(emi.emiAmount).toLocaleString()}
                                </td>
                                <td>
                                    ₹
                                    {parseFloat(
                                        emi.principalAmount,
                                    ).toLocaleString()}
                                </td>
                                <td>
                                    ₹
                                    {parseFloat(
                                        emi.interestAmount,
                                    ).toLocaleString()}
                                </td>
                                <td>
                                    ₹
                                    {parseFloat(
                                        emi.outstandingPrincipal,
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(RepaymentSchedule);
