// src/hooks/useLendenClub.js
import { useState, useCallback } from 'react';
import {
    dedupeCheck,
    getPreapprovalOffer,
    createLead,
    checkLeadStatus,
    getLeadDetail,
} from '&/services/lendenclub';
import { generateConsentData } from '&/helpers/consentHelper';

export const useLendenClub = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Wrapper for async operations to handle loading/error automatically
    const wrapAsync = useCallback(async callback => {
        setLoading(true);
        setError(null);
        try {
            return await callback();
        } catch (err) {
            console.error('LendenClub Operation Error:', err);
            const errMsg = err.message || 'Operation failed';
            setError(errMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const checkDuplicate = useCallback(
        async (mobile, pan, email) => {
            return wrapAsync(async () => {
                const res = await dedupeCheck(mobile, pan, email);
                if (res.status !== 'success') {
                    throw new Error(res.message || 'Dedupe check failed');
                }
                return res.data;
            });
        },
        [wrapAsync],
    );

    const getOffer = useCallback(
        async payload => {
            return wrapAsync(async () => {
                const res = await getPreapprovalOffer(payload);
                if (res.status !== 'success') {
                    throw new Error(res.message || 'Offer check failed');
                }
                return res.data;
            });
        },
        [wrapAsync],
    );

    const getStatus = useCallback(async leadId => {
        // This is a lightweight call, maybe we don't want global loading state?
        // For now, let's keep it wrapped but maybe we can make loading optional
        const res = await checkLeadStatus(leadId); // Not wrapping to avoid UI flickering if polling
        if (res.status !== 'success') {
            throw new Error(res.message || 'Status check failed');
        }
        return res.data;
    }, []);

    const getNewLink = useCallback(
        async (leadId, redirectUrl) => {
            return wrapAsync(async () => {
                const res = await getLeadDetail(leadId, redirectUrl);
                if (res.status !== 'success') {
                    throw new Error(res.message || 'Link generation failed');
                }
                return res.data;
            });
        },
        [wrapAsync],
    );

    const submitLoan = useCallback(async (loanPayload, onSuccess, onError) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Generate Consent Data
            const consents = await generateConsentData();

            // 2. Prepare Payload (merge consents)
            const fullPayload = {
                ...loanPayload,
                consent_data: consents,
            };

            // 3. Dedupe Check
            const { mobile_number, pan, email } = fullPayload.basic_details;
            const dedupeRes = await dedupeCheck(mobile_number, pan, email);

            if (dedupeRes.status !== 'success') {
                throw new Error(dedupeRes.message || 'Dedupe check failed');
            }

            if (dedupeRes.data?.status === 'REJECT') {
                // Return existing lead info instead of throwing if rejected/duplicate
                if (onSuccess) {
                    onSuccess({
                        status: 'REJECT',
                        existingLead: dedupeRes.data.existing_lead_status,
                        isDuplicate: true,
                    });
                }
                return; // Stop execution
            }

            // 4. Pre-approval Offer
            const offerRes = await getPreapprovalOffer(fullPayload);

            if (offerRes.status !== 'success') {
                throw new Error(
                    offerRes.message || 'Pre-approval check failed',
                );
            }

            if (offerRes.data?.status === 'REJECT') {
                throw new Error(
                    offerRes.data.message ||
                        'Loan application rejected by lender',
                );
            }

            // 5. Create Lead
            // Ensure redirection_url is set
            if (!fullPayload.redirection_url) {
                fullPayload.redirection_url = window.location.origin;
            }

            const leadRes = await createLead(fullPayload);

            if (leadRes.status !== 'success') {
                throw new Error(leadRes.message || 'Lead creation failed');
            }

            // Success!
            if (onSuccess) {
                onSuccess({
                    status: 'SUCCESS',
                    leadId: leadRes.data.lead_id,
                    redirectionLink: leadRes.data.redirection_link,
                    isDuplicate: false,
                });
            }
        } catch (err) {
            console.error('LendenClub Integration Error:', err);
            const errorMessage = err.message || 'Something went wrong';
            setError(errorMessage);
            if (onError) onError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        submitLoan,
        checkDuplicate,
        getOffer,
        getStatus,
        getNewLink,
    };
};
