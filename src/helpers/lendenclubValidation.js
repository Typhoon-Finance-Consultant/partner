// src/helpers/lendenclubValidation.js

export const validateLendenClubPayload = payload => {
    const errors = [];
    const basic = payload.basic_details || {};
    const address = payload.address_details || {};
    const professional = payload.professional_details || {};
    const loan = payload.loan_details || {};

    // Basic Details Validation
    if (!basic.mobile_number || !/^[6-9]\d{9}$/.test(basic.mobile_number)) {
        errors.push(
            'Invalid Mobile Number (must be 10 digits starting with 6-9)',
        );
    }
    if (!basic.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email)) {
        errors.push('Invalid Email Address');
    }
    if (!basic.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(basic.pan)) {
        errors.push('Invalid PAN Format (AAAAA9999A)');
    }
    if (!basic.first_name) errors.push('First Name is required');
    if (!basic.last_name) errors.push('Last Name is required');
    if (!basic.date_of_birth) errors.push('Date of Birth is required');
    if (!['M', 'F'].includes(basic.gender))
        errors.push("Gender must be 'M' or 'F'");

    // Address Details Validation
    if (!address.address_line) errors.push('Address Line is required');
    if (!address.pincode || !/^\d{6}$/.test(String(address.pincode))) {
        errors.push('Invalid Pincode (must be 6 digits)');
    }
    if (!address.state_code || address.state_code.length !== 2) {
        errors.push('Invalid State Code (must be 2 letters)');
    }
    if (!address.city) errors.push('City is required');

    // Professional Details Validation
    if (!professional.company_name) errors.push('Company Name is required');
    if (!professional.income || professional.income <= 0) {
        errors.push('Income must be a positive number');
    }
    if (!['SALARIED', 'SELF_EMPLOYED'].includes(professional.occupation_type)) {
        errors.push('Invalid Occupation Type');
    }

    // Loan Details Validation
    if (!loan.amount || loan.amount <= 0) {
        errors.push('Loan Amount must be a positive number');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const formatDateToISO = dateString => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
};

export const normalizeGender = gender => {
    if (!gender) return 'M';
    const g = gender.toUpperCase();
    if (g === 'MALE' || g === 'M') return 'M';
    if (g === 'FEMALE' || g === 'F') return 'F';
    return 'M'; // Default to Male if unknown per API spec preference or handle error
};

export const normalizeOccupationType = type => {
    // Logic usually handled in transformation, but helper can be here if needed
    return type;
};
