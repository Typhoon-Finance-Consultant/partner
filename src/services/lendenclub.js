// src/services/lendenclub.js
import { coreApi } from './axiosConfig';
import { handleResponse } from './common';

const LENDENCLUB_ENTITY_ID =
    import.meta.env.VITE_LENDENCLUB_ENTITY_ID || 'RRSPO';

export const dedupeCheck = (mobileNumber, pan, email) => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/dedupe',
        {
            payload: {
                mobile_number: mobileNumber,
                pan: pan,
                email: email,
                regulated_entity_id: LENDENCLUB_ENTITY_ID,
            },
        },
    );
    return handleResponse(response);
};

export const getPreapprovalOffer = payload => {
    const payloadWithEntity = {
        ...payload,
        regulated_entity_id: LENDENCLUB_ENTITY_ID,
    };
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/preapproval-offer',
        { payload: payloadWithEntity },
    );
    return handleResponse(response);
};

export const createLead = payload => {
    const payloadWithEntity = {
        ...payload,
        regulated_entity_id: LENDENCLUB_ENTITY_ID,
    };
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/create',
        { payload: payloadWithEntity },
    );
    return handleResponse(response);
};

export const getLeadDetail = (leadId, redirectionUrl) => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/detail',
        {
            payload: {
                lead_id: leadId,
                redirection_url: redirectionUrl,
                regulated_entity_id: LENDENCLUB_ENTITY_ID,
            },
        },
    );
    return handleResponse(response);
};

export const checkLeadStatus = leadId => {
    const response = coreApi.makeAuthenticatedGetCall(
        `lendenclub/prod/lead/status/${leadId}?regulated_entity_id=${LENDENCLUB_ENTITY_ID}`,
    );
    return handleResponse(response);
};

/**
 * Smart-retry: refresh the status of a LendenClub application.
 * Triggers the backend to re-check the lead status with LendenClub.
 * @param {number} internalLeadId - The internal LendenClub application ID
 * @returns {Promise} - { status, data, message }
 */
export const smartRetry = internalLeadId => {
    const response = coreApi.makeAuthenticatedPostCall(
        'lendenclub/prod/lead/smart-retry',
        { internal_lead_id: internalLeadId },
    );
    return handleResponse(response);
};

/**
 * Refresh an expired continuation link for a LendenClub lead.
 * @param {string} ldcLeadId - The LDC lead ID (e.g. L2702267943858C290)
 * @returns {Promise} - { status, data, message } where data contains the updated lead object
 */
export const refreshLeadLink = ldcLeadId => {
    const response = coreApi.makeAuthenticatedGetCall(
        `lendenclub/prod/lead/refresh-link/${ldcLeadId}`,
    );
    return handleResponse(response);
};
