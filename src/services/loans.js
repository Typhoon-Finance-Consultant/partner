import { coreApi } from './axiosConfig';
import { handleResponse } from './common';

export const loansList = (data, page = 1, pageSize = 20) => {
    const response = coreApi.makeAuthenticatedPostCall(
        `loans/list?page=${page}&page_size=${pageSize}`,
        data,
    );
    return handleResponse(response);
};

export const loanDetails = id => {
    const response = coreApi.makeAuthenticatedGetCall(`loans/details/${id}`);
    return handleResponse(response);
};

export const payoutList = data => {
    const response = coreApi.makeAuthenticatedPostCall('payouts/list', data);
    return handleResponse(response);
};

export const payoutDetails = id => {
    const response = coreApi.makeAuthenticatedGetCall(`payouts/details/${id}`);
    return handleResponse(response);
};

export const updateBankAccount = data => {
    const response = coreApi.makeAuthenticatedPostCall('bank/update', data);
    return handleResponse(response);
};

export const getBankList = () => {
    const response = coreApi.makeAuthenticatedGetCall('bank/list');
    return handleResponse(response);
};

export const getDocumentList = data => {
    const response = coreApi.makeAuthenticatedPostCall('document/list', data);
    return handleResponse(response);
};

export const uploadDocument = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'document/upload',
        data,
        {
            'Content-Type': 'multipart/form-data',
        },
    );
    return handleResponse(response);
};

export const updateAddress = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/address/update',
        data,
    );
    return handleResponse(response);
};

export const updateIncomeProfile = data => {
    const response = coreApi.makeAuthenticatedPostCall('income/update', data);
    return handleResponse(response);
};

export const getEmployerList = () => {
    const response = coreApi.makeAuthenticatedGetCall('income/employer/list');
    return handleResponse(response);
};

export const handleLeadCreation = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'partner/leads/create',
        data,
    );
    return handleResponse(response);
};

export const checkLeadStatus = leadID => {
    const response = coreApi.makeAuthenticatedGetCall(
        `partner/lead-status/${leadID}`,
    );
    return handleResponse(response);
};

export const submitLoanApplication = data => {
    const response = coreApi.makeAuthenticatedPostCall('loans/create', data);
    return handleResponse(response);
};

export const updateBasicDetails = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/basic/update',
        data,
    );
    return handleResponse(response);
};

export const handleLeadVerification = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/verification',
        data,
    );
    return handleResponse(response);
};

export const updateLoanReference = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/reference/update',
        data,
    );
    return handleResponse(response);
};

export const updateLoanRequirements = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'loan/requirement/update',
        data,
    );
    return handleResponse(response);
};

export const getBankDetailsUsingIFSC = data => {
    const response = coreApi.makeAuthenticatedGetCall(
        `bank/get-ifsc-details?ifsc=${data}`,
        data,
    );
    return handleResponse(response);
};

// New function to get IFSC details with external API fallback
export const getBankDetailsUsingIFSCWithFallback = async ifscCode => {
    try {
        // First try the external Razorpay API
        const externalResponse = await fetch(
            `https://ifsc.razorpay.com/${ifscCode}`,
        );
        const externalData = await externalResponse.json();

        // Check if external API returned valid data
        if (externalData && externalData.IFSC && externalData.BANK) {
            return {
                code: 200,
                response: {
                    BANK: externalData.BANK,
                    BRANCH: externalData.BRANCH,
                    CITY: externalData.CITY,
                    STATE: externalData.STATE,
                    ADDRESS: externalData.ADDRESS,
                    IFSC: externalData.IFSC,
                },
                source: 'external',
            };
        }

        // If external API fails, fallback to internal server API

        const serverResponse = await getBankDetailsUsingIFSC(ifscCode);
        return {
            ...serverResponse,
            source: 'server',
        };
    } catch (error) {
        console.error(
            'External IFSC API error, falling back to server API:',
            error,
        );

        // Fallback to internal server API
        try {
            const serverResponse = await getBankDetailsUsingIFSC(ifscCode);
            return {
                ...serverResponse,
                source: 'server',
            };
        } catch (serverError) {
            console.error(
                'Both external and server IFSC APIs failed:',
                serverError,
            );
            throw serverError;
        }
    }
};

export const getPinCode = data => {
    const response = coreApi.makeAuthenticatedGetCall(
        `loan/address/pincode?pincode=${data}`,
        data,
    );
    return handleResponse(response);
};

// New function to get pincode details with external API fallback
export const getPinCodeWithFallback = async pincode => {
    try {
        // First try the external API
        const externalResponse = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`,
        );
        const externalData = await externalResponse.json();

        // Check if external API returned valid data
        if (
            externalData &&
            externalData.length > 0 &&
            externalData[0].Status === 'Success' &&
            externalData[0].PostOffice &&
            externalData[0].PostOffice.length > 0
        ) {
            const postOffice = externalData[0].PostOffice[0];
            return {
                code: 200,
                response: {
                    city: postOffice.District, // Using District as city
                    state: postOffice.State,
                    pincode: postOffice.Pincode,
                },
                source: 'external',
            };
        }

        // If external API fails, fallback to internal server API

        const serverResponse = await getPinCode(pincode);
        return {
            ...serverResponse,
            source: 'server',
        };
    } catch (error) {
        console.error('External API error, falling back to server API:', error);

        // Fallback to internal server API
        try {
            const serverResponse = await getPinCode(pincode);
            return {
                ...serverResponse,
                source: 'server',
            };
        } catch (serverError) {
            console.error('Both external and server APIs failed:', serverError);
            throw serverError;
        }
    }
};

export const lendenDedupe = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/dedupe',
        data,
    );
    return handleResponse(response);
};

export const lendenPreApproval = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/preapproval-offer',
        data,
    );
    return handleResponse(response);
};

export const lendenCreateLead = data => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/create',
        data,
    );
    return handleResponse(response);
};

export const lendenLeadStatus = leadID => {
    const response = coreApi.makeAuthenticatedGetCall(
        `lendenclub/prod/lead/status/${leadID}`,
    );
    return handleResponse(response);
};
