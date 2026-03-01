import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import RepaymentSchedule from './RepaymentSchedule';
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
 * Formats a date string to DD/MM/YYYY HH:MM
 */
const formatDateTime = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// ----- Lead Detail Popup -----
const detailSections = [
    {
        title: 'Application',
        fields: app => [
            { label: 'Internal ID', value: app.id },
            { label: 'Lead ID', value: app.ldc_lead_id },
            { label: 'Provider', value: app.provider },
            { label: 'Product Type', value: app.product_type },
            { label: 'Status', value: app.status },
            { label: 'Status Activity', value: app.status_activity },
            { label: 'Loan Status', value: app.loan_status_label },
            {
                label: 'Stage',
                value: app.stage_label
                    ? `${app.stage_label} (${app.current_stage})`
                    : app.current_stage,
            },
            { label: 'Stage Description', value: app.stage_description },
            {
                label: 'Journey Progress',
                value:
                    app.journey_progress != null
                        ? `${app.journey_progress}%`
                        : null,
            },
            { label: 'Journey Outcome', value: app.journey_outcome },
            {
                label: 'Journey Complete',
                value:
                    app.is_journey_complete != null
                        ? app.is_journey_complete
                            ? 'Yes'
                            : 'No'
                        : null,
            },
            {
                label: 'Can Continue',
                value:
                    app.can_continue != null
                        ? app.can_continue
                            ? 'Yes'
                            : 'No'
                        : null,
            },
            {
                label: 'Duplicate',
                value:
                    app.is_duplicate != null
                        ? app.is_duplicate
                            ? 'Yes'
                            : 'No'
                        : null,
            },
            { label: 'Rejection Stage', value: app.rejection_stage },
            { label: 'Error', value: app.error_message },
        ],
    },
    {
        title: 'Loan Details',
        fields: app => [
            {
                label: 'Loan Amount',
                value: app.final_loan_amount
                    ? `₹${parseFloat(app.final_loan_amount).toLocaleString()}`
                    : null,
            },
            {
                label: 'Tenure',
                value: app.final_tenure ? `${app.final_tenure} months` : null,
            },
            {
                label: 'Interest Rate',
                value: app.final_interest_rate
                    ? `${app.final_interest_rate}%`
                    : null,
            },
            {
                label: 'Processing Fee',
                value: app.final_processing_fee
                    ? `₹${parseFloat(app.final_processing_fee).toLocaleString()}`
                    : null,
            },
        ],
    },
    {
        title: 'Customer',
        fields: app => {
            const u = app.user || {};
            return [
                { label: 'User ID', value: u.user_id },
                { label: 'Name', value: u.full_name },
                { label: 'Mobile', value: u.mobile_number },
                { label: 'Email', value: u.email },
                { label: 'PAN', value: u.pan },
                { label: 'Gender', value: u.gender },
                { label: 'DOB', value: u.dob ? formatDate(u.dob) : null },
                { label: 'Marital Status', value: u.marital_status },
                { label: 'User Group', value: u.user_group },
            ];
        },
    },
    {
        title: 'Source & Tracking',
        fields: app => [
            { label: 'Initiator', value: app.initiator_name },
            { label: 'Initiator Type', value: app.initiator_type },
            { label: 'LDC Response Code', value: app.ldc_response_code },
            { label: 'LDC Response', value: app.ldc_response_message },
            { label: 'Submission Attempts', value: app.submission_attempts },
            { label: 'Customer Retries', value: app.customer_retry_count },
            {
                label: 'Last Submission',
                value: app.last_submission_at
                    ? formatDateTime(app.last_submission_at)
                    : null,
            },
        ],
    },
    {
        title: 'Dates',
        fields: app => [
            { label: 'Created', value: formatDateTime(app.created_date) },
            { label: 'Updated', value: formatDateTime(app.updated_date) },
            { label: 'Last Event', value: app.last_event_name },
            {
                label: 'Last Event Time',
                value: formatDateTime(app.last_event_time),
            },
        ],
    },
    {
        title: 'Frontend Status',
        fields: app => {
            const fs = app.frontend_status || {};
            return [
                { label: 'UI Stage', value: fs.ui_stage },
                { label: 'UI Action', value: fs.ui_action },
                { label: 'UI Message', value: fs.ui_message },
                {
                    label: 'Redirect URL',
                    value: fs.ui_redirect_url,
                    isUrl: true,
                },
            ];
        },
    },
];

const LeadDetailPopup = ({ application, open, onClose }) => {
    const [linkCopied, setLinkCopied] = useState(false);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
        }
    }, [open]);

    if (!open) return null;

    const handleBackdropClick = e => {
        if (e.target === e.currentTarget) onClose();
    };

    const redirectUrl =
        application.redirection_link ||
        application.frontend_status?.ui_redirect_url;

    const handleCopyRedirectLink = async () => {
        if (!redirectUrl) return;
        try {
            await navigator.clipboard.writeText(redirectUrl);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = redirectUrl;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    return createPortal(
        <div className="ldc-popup-backdrop" onClick={handleBackdropClick}>
            <div className="ldc-popup">
                <div className="ldc-popup-header">
                    <h3 className="ldc-popup-title">
                        {application.user?.full_name || 'Lead Details'}
                    </h3>
                    <button
                        className="ldc-popup-close"
                        onClick={onClose}
                        aria-label="Close">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="ldc-popup-body">
                    {detailSections.map(section => {
                        const fields = section
                            .fields(application)
                            .filter(
                                f =>
                                    f.value != null &&
                                    f.value !== '' &&
                                    f.value !== undefined,
                            );
                        if (fields.length === 0) return null;
                        return (
                            <div
                                key={section.title}
                                className="ldc-popup-section">
                                <h4 className="ldc-popup-section-title">
                                    {section.title}
                                </h4>
                                <div className="ldc-popup-fields">
                                    {fields.map(f => (
                                        <div
                                            key={f.label}
                                            className="ldc-popup-field">
                                            <span className="ldc-popup-field-label">
                                                {f.label}
                                            </span>
                                            {f.isUrl ? (
                                                <a
                                                    className="ldc-popup-field-value ldc-popup-link"
                                                    href={f.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    {f.value.length > 60
                                                        ? f.value.slice(0, 60) +
                                                          '…'
                                                        : f.value}
                                                </a>
                                            ) : (
                                                <span className="ldc-popup-field-value">
                                                    {String(f.value)}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer with copy link */}
                {redirectUrl && (
                    <div className="ldc-popup-footer">
                        <button
                            className="ldc-btn-copy-link ldc-popup-copy-btn"
                            onClick={handleCopyRedirectLink}>
                            {linkCopied ? (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Link Copied!
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    Copy Redirection Link
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body,
    );
};

// ----- UI Stage color & icon mappings -----
const stageThemes = {
    ACTION_REQUIRED: {
        color: '#f59e0b',
        bg: '#fffbeb',
        border: '#fde68a',
        icon: '',
    },
    SUBMITTED: {
        color: '#0e7c07',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: '',
    },
    IN_PROGRESS: {
        color: '#64748b',
        bg: '#f8fafc',
        border: '#e2e8f0',
        icon: '',
    },
    APPROVED: {
        color: '#0e7c07',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: '',
    },
    ACTIVE: {
        color: '#0e7c07',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        icon: '',
    },
    REJECTED: {
        color: '#ef4444',
        bg: '#fef2f2',
        border: '#fecaca',
        icon: '',
    },
    SUPPORT_REQUIRED: {
        color: '#ef4444',
        bg: '#fef2f2',
        border: '#fecaca',
        icon: '',
    },
};

const defaultTheme = {
    color: '#64748b',
    bg: '#f8fafc',
    border: '#e2e8f0',
    icon: '',
};

// ----- Journey outcome card class mapping -----
const outcomeCardClass = {
    pending_action: 'ldc-card--highlighted',
    in_progress: '',
    success: 'ldc-card--success',
    rejected: 'ldc-card--muted',
    failed: 'ldc-card--muted',
};

/**
 * LendenClub Application Card component for the partner portal.
 * Displays application status, offer details, repayment schedule,
 * and action buttons (refresh status, contact support, etc.)
 *
 * @param {Object} props
 * @param {Object} props.application - LendenClub application data
 * @param {Function} props.onSmartRetry - Handler for smart-retry (refresh status)
 */
const LendenClubApplicationCard = ({ application, onSmartRetry }) => {
    const [retrying, setRetrying] = useState(false);
    const [copied, setCopied] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);

    const fs = application.frontend_status;
    const uiStage = fs?.ui_stage || 'IN_PROGRESS';
    const uiAction = fs?.ui_action || 'NONE';
    const uiMessage =
        fs?.ui_message ||
        application.stage_description ||
        'Application in progress';
    const theme = stageThemes[uiStage] || defaultTheme;
    const journeyOutcome = application.journey_outcome || 'in_progress';
    const cardClass = outcomeCardClass[journeyOutcome] ?? '';

    // --- Smart-retry handler ---
    const handleSmartRetry = async () => {
        if (!onSmartRetry || retrying) return;
        setRetrying(true);
        try {
            await onSmartRetry(application.id);
        } finally {
            setRetrying(false);
        }
    };

    // --- Copy link handler ---
    const handleCopyLink = async url => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = url;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // --- Action button / widget ---
    const renderAction = () => {
        switch (uiAction) {
            case 'REFRESH_STATUS':
                return (
                    <div className="ldc-action-area">
                        <button
                            className="ldc-btn-refresh-status"
                            onClick={handleSmartRetry}
                            disabled={retrying}>
                            {retrying ? (
                                <span className="ldc-btn-spinner" />
                            ) : (
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round">
                                    <path d="M23 4v6h-6" />
                                    <path d="M1 20v-6h6" />
                                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                                </svg>
                            )}
                            {retrying ? 'Checking...' : 'Refresh Status'}
                        </button>
                        <span className="ldc-retry-counter">
                            Attempt {application.customer_retry_count ?? 0} of 5
                        </span>
                    </div>
                );

            case 'CONTACT_SUPPORT':
                return (
                    <div className="ldc-action-area ldc-action-area--support">
                        <div className="ldc-support-info">
                            <span className="ldc-support-icon"></span>
                            <div>
                                <strong>Contact Support</strong>
                                <p className="ldc-support-text">
                                    {uiMessage ||
                                        'Please contact our support team for assistance.'}
                                </p>
                                <a
                                    href="tel:+918069081111"
                                    className="ldc-support-link">
                                    Call: +91 80690 81111
                                </a>
                            </div>
                        </div>
                    </div>
                );

            case 'CONTINUE': {
                const redirectUrl = fs?.ui_redirect_url;
                return redirectUrl ? (
                    <div className="ldc-action-area">
                        <button
                            className="ldc-btn-continue"
                            onClick={() => window.open(redirectUrl, '_blank')}>
                            Continue Application →
                        </button>
                        <button
                            className="ldc-btn-copy-link"
                            onClick={() => handleCopyLink(redirectUrl)}>
                            {copied ? (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                ) : null;
            }

            case 'CONTINUE_APPLICATION': {
                const appUrl = fs?.ui_redirect_url;
                return appUrl ? (
                    <div className="ldc-action-area">
                        <button
                            className="ldc-btn-continue"
                            onClick={() => window.open(appUrl, '_blank')}>
                            Complete Application →
                        </button>
                        <button
                            className="ldc-btn-copy-link"
                            onClick={() => handleCopyLink(appUrl)}>
                            {copied ? (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>
                ) : null;
            }

            case 'WAIT':
                return (
                    <div className="ldc-action-area ldc-action-area--wait">
                        <span className="ldc-wait-spinner" />
                        <span className="ldc-wait-text">{uiMessage}</span>
                    </div>
                );

            case 'DASHBOARD':
                return (
                    <div className="ldc-action-area">
                        <button
                            className="ldc-btn-dashboard"
                            onClick={handleSmartRetry}>
                            View Loan
                        </button>
                    </div>
                );

            case 'NONE':
            default:
                return null;
        }
    };

    // --- Offer stats ---
    const renderOfferStats = () => {
        if (!application.final_loan_amount) return null;
        return (
            <div className="ldc-offer-stats">
                <div className="ldc-stat-item">
                    <span className="ldc-stat-label">Loan Amount</span>
                    <span className="ldc-stat-value">
                        ₹
                        {parseFloat(
                            application.final_loan_amount,
                        ).toLocaleString()}
                    </span>
                </div>
                {application.final_tenure && (
                    <div className="ldc-stat-item">
                        <span className="ldc-stat-label">Tenure</span>
                        <span className="ldc-stat-value">
                            {application.final_tenure} Months
                        </span>
                    </div>
                )}
                {application.final_interest_rate && (
                    <div className="ldc-stat-item">
                        <span className="ldc-stat-label">Interest</span>
                        <span className="ldc-stat-value">
                            {(
                                parseFloat(application.final_interest_rate) / 12
                            ).toFixed(1)}
                            % P.M.
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const hasRepaymentSchedule =
        application.last_event_data?.repayment_schedule?.length > 0;

    return (
        <div
            className={`ldc-application-card ${cardClass}`}
            style={{ borderLeft: `4px solid ${theme.color}` }}>
            {/* ---- Header ---- */}
            <div className="ldc-card-header">
                <div className="ldc-header-content">
                    <div
                        className="ldc-title-section"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                            <h3
                                className="ldc-card-title ldc-card-title--clickable"
                                onClick={() => setDetailOpen(true)}>
                                {application.user?.full_name ||
                                    application.stage_label ||
                                    'Loan Application'}
                            </h3>
                            <span className="ldc-lead-id">
                                {application.stage_label || 'Loan Application'}
                                {application.ldc_lead_id
                                    ? ` · #${application.ldc_lead_id}`
                                    : ''}
                                {application.provider
                                    ? ` · ${application.provider}`
                                    : ''}
                            </span>
                        </div>
                    </div>
                    <div className="ldc-status-section">
                        <span
                            className="ldc-status-badge"
                            style={{
                                backgroundColor: theme.bg,
                                color: theme.color,
                                border: `1px solid ${theme.border}`,
                            }}>
                            {theme.icon ? `${theme.icon} ` : ''}
                            {uiStage.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {/* UI Message */}
                <p className="ldc-card-subtitle">{uiMessage}</p>
            </div>

            {/* ---- Body ---- */}
            <div className="ldc-card-body">
                {/* Offer stats if available */}
                {renderOfferStats()}

                {/* Repayment schedule */}
                {hasRepaymentSchedule && (
                    <RepaymentSchedule
                        lastEventData={application.last_event_data}
                    />
                )}

                {/* Action button / widget */}
                {renderAction()}
            </div>

            {/* ---- Footer ---- */}
            <div className="ldc-card-footer">
                <span>Created: {formatDate(application.created_date)}</span>
                <span>
                    Last updated: {formatDateTime(application.updated_date)}
                </span>
            </div>

            {/* ---- Detail Popup ---- */}
            <LeadDetailPopup
                application={application}
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
            />
        </div>
    );
};

export default React.memo(LendenClubApplicationCard);
