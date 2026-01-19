// src/helpers/stateCodeMapper.js
import { STATE_CODE_MAP } from './lenden'; // Reuse existing map

export const getStateCode = stateName => {
    if (!stateName) return '';
    // Basic lookup
    let code = STATE_CODE_MAP[stateName];
    if (code) return code;

    // Case-insensitive lookup
    const lowerName = stateName.toLowerCase().trim();
    const entry = Object.entries(STATE_CODE_MAP).find(
        ([key]) => key.toLowerCase() === lowerName,
    );
    return entry ? entry[1] : '';
};
