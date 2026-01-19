// src/helpers/consentHelper.js

// Get or generate persistent device ID
export const getDeviceId = () => {
    const storageKey = 'lendenclub_device_id';
    let deviceId = localStorage.getItem(storageKey);

    if (!deviceId) {
        deviceId = `DEV_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(storageKey, deviceId);
    }

    return deviceId;
};

// Get user's IP (backend should override with actual IP)
export const getClientIP = () => {
    return '0.0.0.0'; // Placeholder - backend populates actual IP
};

// Get geolocation coordinates (async)
export const getGeolocation = () => {
    return new Promise(resolve => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                error => {
                    console.warn('Geolocation not available:', error.message);
                    resolve({ latitude: 0, longitude: 0 });
                },
                { timeout: 5000 },
            );
        } else {
            resolve({ latitude: 0, longitude: 0 });
        }
    });
};

// Generate complete consent data array
export const generateConsentData = async () => {
    const deviceId = getDeviceId();
    const ipAddress = getClientIP();
    const location = await getGeolocation();

    const bureauConsentContent = `I hereby give my consent to Varthana Finance Private Limited and its assigns and successors and its authorized representatives to access the credit information of mine as is available with credit information company (CIBIL/Equifax/Experian/CRIF High Mark) now and anytime in future for the purpose of accessing my eligibility for availing Personal Loan from Varthana Finance Private Limited, which I will be applying. I also hereby authorise Varthana Finance Private Limited to share my contact and credit information with affiliates, group companies, service providers and any other third party for related purposes mentioned above.`;

    const loginConsentContent = `I hereby authorize LendenClub and its affiliates to use my contact details and personal information for the purpose of processing my loan application and providing related services. I agree to receive communications via phone, SMS, email, and WhatsApp regarding my application and loan account.`;

    return [
        {
            consent_type: 'bureau_consent',
            ip_address: ipAddress,
            device_id: deviceId,
            latitude: location.latitude,
            longitude: location.longitude,
            content: bureauConsentContent,
            // Backend generates consent_dtm automatically
        },
        {
            consent_type: 'login',
            ip_address: ipAddress,
            device_id: deviceId,
            latitude: location.latitude,
            longitude: location.longitude,
            content: loginConsentContent,
            // Backend generates consent_dtm automatically
        },
    ];
};
