// src/helpers/lenden.js
import dayjs from 'dayjs';
import { IncomeTypes } from './constants';

export const LENDEN_RE_CODE = import.meta.env.VITE_LENDENCLUB_ENTITY_ID;

export const STATE_CODE_MAP = {
    'Andaman and Nicobar Islands': 'AN',
    'Andhra Pradesh': 'AD',
    'Arunachal Pradesh': 'AR',
    Assam: 'AS',
    Bihar: 'BH',
    Chandigarh: 'CH',
    Chhattisgarh: 'CT',
    'Dadra and Nagar Haveli': 'DN',
    'Daman and Diu': 'DD',
    'Dadra and Nagar Haveli and Daman and Diu': 'DN', // Mapping combined to DN
    Delhi: 'DL',
    Goa: 'GA',
    Gujarat: 'GJ',
    Haryana: 'HR',
    'Himachal Pradesh': 'HP',
    'Jammu and Kashmir': 'JK',
    Jharkhand: 'JH',
    Karnataka: 'KA',
    Kerala: 'KL',
    Ladakh: 'LA',
    Lakshadweep: 'LD',
    'Lakshadweep Islands': 'LD',
    'Madhya Pradesh': 'MP',
    Maharashtra: 'MH',
    Manipur: 'MN',
    Meghalaya: 'ME',
    Mizoram: 'MI',
    Nagaland: 'NL',
    Odisha: 'OR',
    Puducherry: 'PY',
    Punjab: 'PB',
    Rajasthan: 'RJ',
    Sikkim: 'SK',
    'Tamil Nadu': 'TN',
    Telangana: 'TL',
    Tripura: 'TR',
    'Uttar Pradesh': 'UP',
    Uttarakhand: 'UT',
    'West Bengal': 'WB',
};

export const mapLoanDataToDedupePayload = loanData => {
    const basic = loanData.primary_applicant || {};

    // Validation
    const missingFields = [];
    if (!basic.mobile_number) missingFields.push('Mobile Number');
    if (!basic.email) missingFields.push('Email');
    if (!basic.pan && !basic.pan_number) missingFields.push('PAN');

    if (missingFields.length > 0) {
        throw new Error(
            `Missing required fields for dedupe: ${missingFields.join(', ')}`,
        );
    }

    return {
        payload: {
            mobile_number: basic.mobile_number,
            pan: basic.pan_number || basic.pan,
            email: basic.email,
            regulated_entity_id: LENDEN_RE_CODE,
        },
    };
};

export const mapLoanDataToLendenPayload = (loanData, extraData = {}) => {
    const basic = loanData.primary_applicant || {};
    const address = loanData.address?.permanent_address || {}; // Prefer permanent as per guide
    const income = loanData.income_profile || {};
    // Use loanData.amount as seen in other components, fallback to 0 if missing
    const loanAmount = parseInt(loanData.amount || loanData.loan_amount) || 0;
    const loanTenure = parseInt(loanData.tenure || loanData.loan_tenure) || 12;

    const formattedDob =
        basic.dob && dayjs(basic.dob).isValid()
            ? dayjs(basic.dob).format('YYYY-MM-DD')
            : '';

    // Validation Checks
    const missingFields = [];
    if (!basic.mobile_number) missingFields.push('Mobile Number');
    if (!basic.email) missingFields.push('Email');
    if (!basic.first_name) missingFields.push('First Name');
    if (!basic.last_name) missingFields.push('Last Name');
    if (!basic.pan && !basic.pan_number) missingFields.push('PAN');
    if (!formattedDob) missingFields.push('Date of Birth');
    if (!address.line1) missingFields.push('Address Line 1');
    if (!address.city) missingFields.push('City');
    if (!address.state) missingFields.push('State');
    if (!address.pincode) missingFields.push('Pincode');
    if (!loanAmount) missingFields.push('Loan Amount');
    if (!income.net_income) missingFields.push('Net Income');

    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Map Gender: "Male" -> "M", "Female" -> "F"
    const genderMap = {
        Male: 'M',
        Female: 'F',
        Other: 'O', // Lenden might not support O, guide says M or F.
    };

    // Map State
    const stateCode = STATE_CODE_MAP[address.state];
    if (!stateCode) {
        throw new Error(`Invalid or unmapped state: ${address.state}`);
    }

    // Map Occupation logic
    let occupationType = 'SALARIED';
    if (income.income_type === IncomeTypes.SELF_EMPLOYED) {
        occupationType = 'SELF_EMPLOYED'; // Guide says SELF_EMPLOYED
    }

    // Salary Received Type
    // Assuming backend or UI provides: CASH, CHEQUE, DIRECT_ACCOUNT_TRANSFER
    const salaryReceivedType =
        income.salary_payment_mode || 'DIRECT_ACCOUNT_TRANSFER';

    return {
        payload: {
            basic_details: {
                mobile_number: basic.mobile_number,
                email: basic.email,
                first_name: basic.first_name,
                last_name: basic.last_name,
                pan: basic.pan_number || basic.pan, // Check field name
                date_of_birth: formattedDob,
                gender: genderMap[basic.gender] || 'M',
            },
            address_details: {
                type: 'PERMANENT', // Guide suggests PERMANENT for partners
                address_line: `${address.line1} ${address.line2 || ''}`.trim(),
                locality: address.city, // Using City as locality if not available separately
                pincode: parseInt(address.pincode),
                state_code: stateCode,
                city: address.city,
            },
            professional_details: {
                occupation_type: occupationType,
                company_name: income.employer || income.business_name || 'Self',
                income: parseInt(income.net_income),
                salary_received_type: salaryReceivedType,
            },
            loan_details: {
                amount: loanAmount,
                tenure: {
                    type: 'MONTHLY',
                    value: loanTenure,
                },
            },
            consent_data: [
                {
                    consent_type: 'bureau_consent',
                    ip_address: extraData.ip_address || '127.0.0.1',
                    device_id: extraData.device_id || 'partner-portal-web',
                    content: 'I authorize bureau check',
                },
                {
                    consent_type: 'login',
                    ip_address: extraData.ip_address || '127.0.0.1',
                    device_id: extraData.device_id || 'partner-portal-web',
                    content: 'I agree to terms and conditions',
                },
            ],
            bureau_data: {
                name: 'CIBIL',
                report: [],
            },
            regulated_entity_id: LENDEN_RE_CODE,
            ...(extraData.redirection_url && {
                redirection_url: extraData.redirection_url,
            }),
        },
    };
};
