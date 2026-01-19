# LendenClub Frontend Integration Guide (React)

**Official LendenClub Documentation:** https://documenter.getpostman.com/view/15341834/2sBXVcmtNy

## Overview

This guide explains how to integrate your React frontend with the Django backend for LendenClub (Vartis Glide 2.0) loan processing.

**Architecture:**

```
React Frontend → Django Backend → LendenClub API (Vartis One)
```

- Frontend sends data in **nested structure** (basic_details, address_details, professional_details, loan_details, consent_data)
- Backend **validates**, **transforms dates**, and **generates consent timestamps**
- Backend encrypts and forwards to LendenClub API
- Backend stores **all** requests/responses and maintains lead status for reuse

**Customer Journey Flow (backend-managed)**

1. Call **DEDUPE**. If LendenClub says customer exists, backend auto-runs **STATUS CHECK** for the latest matching lead and returns its status. If ACCEPT, continue; if REJECT, stop.
2. Call **PREAPPROVAL OFFER** only when dedupe ACCEPT and no existing lead.
3. If PREAPPROVAL is ACCEPT, call **CREATE LEAD**. Backend creates lead record and logs the call.
4. If CREATE LEAD lacks a redirection link, backend auto-calls **GET LEAD DETAIL** to fetch it before responding.
5. User continues on the `redirection_link`; backend receives **LEAD EVENT CALLBACK** at https://staff.typhoonfincare.in/api/lendenclub/prod/webhook/callback and stores every callback.
6. Frontend can query **STATUS CHECK** anytime for any known `lead_id`.

---

## Important: Date and Consent Handling

### Dates

- **Frontend sends**: ISO format `YYYY-MM-DD` (e.g., `"1990-10-15"`)
- **Backend converts**:
  - To `YYYY/MM/DD` for PREAPPROVAL_OFFER API
  - To `DD/MM/YYYY` for CREATE_LEAD API
- **You don't need to worry about LendenClub's date format** - just send ISO dates

### Consent Timestamps

- **Frontend provides**: Basic consent structure with `consent_type`, `ip_address`, `device_id`, `content`
- **Backend generates**: The `consent_dtm` timestamp in IST timezone with format `YYYY-MM-DD HH:MM:SS.SSS +0530`
- **Why**: We don't trust client-side timestamps for security and accuracy

---

## Authentication

All endpoints require JWT Bearer token:

```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

## API Endpoints

### Base URL

```
Production: http://your-backend-url.com/api
Development: http://127.0.0.1:8000/api
```

---

## 1. DEDUPE CHECK

**Purpose:** Check if customer already exists in LendenClub system  
**Endpoint:** `POST /api/lendenclub/prod/dedupe`

### Request Payload

```json
{
  "payload": {
    "mobile_number": "9876543210",
    "pan": "ABCDE1234F",
    "email": "user@example.com",
    "regulated_entity_id": "<RE_CODE>"
  }
}
```

### Response (Success)

```json
{
  "status": "success",
  "message": "Dedupe check completed",
  "data": {
    "status": "ACCEPT",
    "message": null,
    "existing_lead_id": null,
    "existing_lead_status": null
  }
}
```

Or if customer already exists:

```json
{
  "status": "success",
  "message": "Dedupe check completed",
  "data": {
    "status": "REJECT",
    "message": "Customer already exists in system",
    "existing_lead_id": "L2911258432053xxxx",
    "existing_lead_status": {
      "event_name": "LOAN_SANCTIONED",
      "event_time": "2025-12-02 11:28:56.000 +0530",
      "status": "COMPLETED",
      "event_data": {
        "loan_amount": "50000.00",
        "tenure": 12,
        "roi": "18.00"
      }
    }
  }
}
```

**Backend behavior**

- When `data.status === "REJECT"`, backend searches stored leads for the same user/mobile/PAN. If found, it automatically calls STATUS CHECK and returns `existing_lead_status` and `existing_lead_id` so the UI can show the current state instead of restarting.
- All dedupe + status-check calls are logged for traceability.

### React Example

```javascript
const checkDedupe = async (mobileNumber, pan, email) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/lendenclub/prod/dedupe",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: {
            mobile_number: mobileNumber,
            pan: pan,
            email: email,
            regulated_entity_id: "<RE_CODE>", // Will be provided by LendenClub
          },
        }),
      }
    );

    const data = await response.json();

    if (data.status !== "success") {
      console.error("Dedupe check failed:", data.message);
      return { canProceed: false };
    }

    if (data.data.status === "ACCEPT") {
      console.log("Customer can proceed");
      return { canProceed: true };
    }

    if (data.data.existing_lead_status) {
      console.log("Existing lead found, showing current status");
      return { canProceed: false, existingLead: data.data };
    }

    console.log("Customer rejected:", data.data.message);
    return { canProceed: false };
  } catch (error) {
    console.error("Error:", error);
    return { canProceed: false };
  }
};
```

---

## 2. PREAPPROVAL OFFER

**Purpose:** Get pre-approval offer for customer  
**Endpoint:** `POST /api/lendenclub/prod/preapproval-offer`

### Request Payload Structure

**IMPORTANT:** Use this exact nested structure

```json
{
  "payload": {
    "basic_details": {
      "mobile_number": "9876543210",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "pan": "ABCDE1234F",
      "date_of_birth": "1990-10-15",
      "gender": "M"
    },
    "address_details": {
      "type": "COMMUNICATION",
      "address_line": "123 Street Name",
      "locality": "Andheri West",
      "pincode": 400058,
      "state_code": "MH",
      "city": "Mumbai"
    },
    "professional_details": {
      "occupation_type": "SALARIED",
      "company_name": "Tech Corp Ltd",
      "income": 50000,
      "salary_received_type": "DIRECT_ACCOUNT_TRANSFER"
    },
    "loan_details": {
      "amount": 100000,
      "interest": {
        "type": "FLAT",
        "frequency": "MONTHLY",
        "value": 1.5
      },
      "tenure": {
        "type": "MONTHLY",
        "value": 12
      }
    },
    "consent_data": [
      {
        "consent_type": "bureau_consent",
        "ip_address": "192.168.1.1",
        "latitude": 19.076,
        "longitude": 72.8777,
        "device_id": "device-12345",
        "content": "I authorize bureau check..."
      },
      {
        "consent_type": "login",
        "ip_address": "192.168.1.1",
        "latitude": 19.076,
        "longitude": 72.8777,
        "device_id": "device-12345",
        "content": "I agree to terms and conditions..."
      }
    ],
    "bureau_data": {
      "name": "CIBIL",
      "report": []
    },
    "regulated_entity_id": "<RE_CODE>"
  }
}
```

### Field Requirements

| Field                                         | Description      | Format                                         | Required                             |
| --------------------------------------------- | ---------------- | ---------------------------------------------- | ------------------------------------ |
| **basic_details.mobile_number**               | 10-digit mobile  | String, 6-9 start                              | ✅                                   |
| **basic_details.email**                       | Email address    | Valid email                                    | ✅                                   |
| **basic_details.first_name**                  | First name       | String                                         | ✅                                   |
| **basic_details.last_name**                   | Last name        | String                                         | ✅                                   |
| **basic_details.pan**                         | PAN number       | AAAAA9999A                                     | ✅                                   |
| **basic_details.date_of_birth**               | Date of birth    | YYYY-MM-DD (ISO)                               | ✅                                   |
| **basic_details.gender**                      | Gender           | "M" or "F"                                     | ✅                                   |
| **address_details.type**                      | Address type     | "COMMUNICATION" or "PERMANENT"                 | Optional (Mandatory for CREATE_LEAD) |
| **address_details.address_line**              | Street address   | String                                         | ✅                                   |
| **address_details.locality**                  | Area/Locality    | String                                         | ✅                                   |
| **address_details.pincode**                   | Pincode          | 6-digit number                                 | ✅                                   |
| **address_details.state_code**                | State            | 2-letter code (MH, DL, etc.)                   | ✅                                   |
| **address_details.city**                      | City name        | String                                         | ✅                                   |
| **professional_details.occupation_type**      | Occupation       | "SALARIED" or "SELF_EMPLOYED"                  | ✅                                   |
| **professional_details.company_name**         | Company          | String                                         | ✅                                   |
| **professional_details.income**               | Monthly income   | Positive number                                | ✅                                   |
| **professional_details.salary_received_type** | Salary mode      | "CASH", "CHEQUE", or "DIRECT_ACCOUNT_TRANSFER" | ✅                                   |
| **loan_details.amount**                       | Loan amount      | Positive number                                | ✅                                   |
| **loan_details.interest**                     | Interest details | Complete object or omit entirely               | Optional                             |
| **loan_details.tenure**                       | Tenure details   | Complete object or omit entirely               | Optional                             |
| **bureau_data.report**                        | Bureau report    | Array (can be empty [])                        | Optional                             |
| **consent_data**                              | Consent array    | Array (min 2: bureau + login)                  | ✅                                   |

### Response (Success)

```json
{
  "status": "success",
  "message": "Offer generated",
  "data": {
    "status": "ACCEPT",
    "message": null,
    "amount": 150000,
    "tenure": 12,
    "interest": "18.5"
  }
}
```

Or if rejected:

```json
{
  "status": "success",
  "message": "Request processed successfully",
  "data": {
    "status": "REJECT",
    "message": "Customer does not meet credit criteria"
  }
}
```

---

## 3. CREATE LEAD

**Purpose:** Create a lead in Vartis One system and get redirection link for KYC  
**Endpoint:** `POST /api/lendenclub/prod/lead/create`

**Backend behavior:**

- Stores full request/response, checksum, and encrypted payload for audit.
- If the initial CREATE LEAD response lacks `redirection_link`, backend immediately calls **GET LEAD DETAIL** with the same `redirection_url`, updates the lead record, and only then returns the link (or an explicit error if it cannot be fetched).

### Request Payload Structure

Same as PREAPPROVAL_OFFER with **two additions**:

1. `address_details.type` is **mandatory** (not optional)
2. `redirection_url` is **mandatory**

```json
{
  "payload": {
    "basic_details": {
      "mobile_number": "9876543210",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "pan": "ABCDE1234F",
      "date_of_birth": "1990-10-15",
      "gender": "M"
    },
    "address_details": {
      "type": "COMMUNICATION",
      "address_line": "123 Street Name",
      "locality": "Andheri West",
      "pincode": 400058,
      "state_code": "MH",
      "city": "Mumbai"
    },
    "professional_details": {
      "occupation_type": "SALARIED",
      "company_name": "Tech Corp Ltd",
      "income": 50000,
      "salary_received_type": "DIRECT_ACCOUNT_TRANSFER"
    },
    "loan_details": {
      "amount": 100000,
      "interest": {
        "type": "FLAT",
        "frequency": "MONTHLY",
        "value": 1.5
      },
      "tenure": {
        "type": "MONTHLY",
        "value": 12
      }
    },
    "consent_data": [
      {
        "consent_type": "bureau_consent",
        "ip_address": "192.168.1.1",
        "latitude": 19.076,
        "longitude": 72.8777,
        "device_id": "device-12345",
        "content": "I authorize bureau check..."
      },
      {
        "consent_type": "login",
        "ip_address": "192.168.1.1",
        "latitude": 19.076,
        "longitude": 72.8777,
        "device_id": "device-12345",
        "content": "I agree to terms and conditions..."
      }
    ],
    "bureau_data": {
      "name": "CIBIL",
      "report": []
    },
    "regulated_entity_id": "<RE_CODE>",
    "redirection_url": "https://yourapp.com/loan/callback"
  }
}
```

### Response (Success)

```json
{
  "status": "success",
  "message": "Lead created successfully",
  "data": {
    "lead_id": "L0512258475785B0xxx",
    "internal_lead_id": 123,
    "redirection_link": "https://staging-plxx.xxx.com/?xxx",
    "status": "ACCEPT"
  }
}
```

### What to do next

1. **Save the `lead_id`** - you'll need it for status tracking
2. **Redirect user** to `redirection_link` for KYC/onboarding
3. **User completes** KYC on Vartis One platform
4. **User is redirected** back to your `redirection_url`
5. **Your backend receives** webhook notifications as loan progresses

---

## 4. GET LEAD DETAIL

**Purpose:** Get lead details and generate new redirection link  
**Endpoint:** `POST /api/lendenclub/prod/lead/detail`

**Backend behavior:** Typically invoked automatically when CREATE LEAD does not return `redirection_link`. Frontend can also call it explicitly to refresh a stale/missing link.

### Request Payload

```json
{
  "payload": {
    "lead_id": "L2501259334745",
    "redirection_url": "https://yourapp.com/loan/callback",
    "regulated_entity_id": "<RE_CODE>"
  }
}
```

### Response (Success)

```json
{
  "status": "success",
  "message": "Lead details retrieved",
  "data": {
    "redirection_link": "https://staging-plxx.xxx.com/?xxx",
    "status": "ACCEPT"
  }
}
```

---

## 5. CHECK LEAD STATUS

**Purpose:** Get current status of a lead  
**Endpoint:** `GET /api/lendenclub/prod/lead/status/{lead_id}`  
**Alternative:** `POST /api/lendenclub/prod/lead/status` with `{"lead_id": "..."}`

### Response (Success)

```json
{
  "status": "success",
  "message": "Status retrieved",
  "data": {
    "event_name": "LOAN_SANCTIONED",
    "event_time": "2025-12-02 11:28:56.000 +0530",
    "status": "COMPLETED",
    "event_data": {
      "loan_amount": "50000.00",
      "tenure": 12,
      "roi": "18.00"
    },
    "lead_id": "L2911258432053xxxx"
  }
}
```

### Possible Event Names

| Event                | Description                 |
| -------------------- | --------------------------- |
| REQUESTED_FOR_LOAN   | Lead created                |
| BUREAU               | Bureau check                |
| BANK_STATEMENT       | Bank statement verification |
| KYC                  | KYC verification            |
| BANK_DETAILS         | Bank details verification   |
| MANDATE              | Auto-debit mandate          |
| ELIGIBILITY          | Underwriting                |
| VIDEO_KYC            | Video KYC                   |
| AGREEMENT_KFS_SIGNED | Agreement signing           |
| LOAN_SANCTIONED      | Loan approved and disbursed |
| LOAN_REPAYMENT       | Repayment status            |
| REPAYMENT_SCHEDULE   | EMI schedule                |

### Possible Status Values

- `COMPLETED` - Event completed successfully
- `IN_PROGRESS` - Event in progress
- `REJECTED` - Event rejected
- `FAILED` - Event failed
- `CANCELLED` - Event cancelled
- `OVERDUE` - Payment overdue
- `DEFAULTED` - Payment defaulted

**Backend behavior:** Status calls are logged with payload, headers, checksum, and response time. Lead records are updated so returning users can resume without re-entering data.

---

## 6. WEBHOOK CALLBACK

**Purpose:** Receive notifications from LendenClub when events occur  
**Endpoint:** `POST /api/lendenclub/prod/webhook/callback`

**Configured callback URL:** https://staff.typhoonfincare.in/api/lendenclub/prod/webhook/callback

**Note:** This is an **incoming** webhook FROM LendenClub TO your backend. You don't call this from frontend.

Your backend receives notifications like:

```json
{
  "event_name": "LOAN_SANCTIONED",
  "event_time": "2025-12-02 11:28:56.000 +0530",
  "event_data": {
    "loan_amount": "50000.00",
    "tenure": 12,
    "roi": "18.00"
  },
  "status": "COMPLETED",
  "lead_id": "L2911258432053xxxx"
}
```

**Backend behavior:** Every callback is validated and logged (headers + payload) and updates the stored lead status/event fields. Unknown leads still return HTTP 200 to avoid retries, but are logged for investigation.

---

## Complete React Example

```javascript
import { useState } from "react";

const LoanApplication = () => {
  const [formData, setFormData] = useState({
    // Basic Details
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    pan: "",
    dateOfBirth: "",
    gender: "M",

    // Address
    addressLine: "",
    locality: "",
    city: "",
    stateCode: "MH",
    pincode: "",

    // Professional
    occupationType: "SALARIED",
    companyName: "",
    income: "",
    salaryType: "DIRECT_ACCOUNT_TRANSFER",

    // Loan
    loanAmount: "",
  });

  const [userIp, setUserIp] = useState("");
  const [deviceId, setDeviceId] = useState("");

  // Get user's IP and device ID on component mount
  useEffect(() => {
    // Fetch user IP from a service
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setUserIp(data.ip))
      .catch(() => setUserIp("127.0.0.1"));

    // Generate device ID (or get from storage)
    const storedDeviceId = localStorage.getItem("device_id");
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
    } else {
      const newDeviceId = `device-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      localStorage.setItem("device_id", newDeviceId);
      setDeviceId(newDeviceId);
    }
  }, []);

  const createLead = async () => {
    try {
      const payload = {
        payload: {
          basic_details: {
            mobile_number: formData.mobileNumber,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            pan: formData.pan,
            date_of_birth: formData.dateOfBirth, // YYYY-MM-DD from input type="date"
            gender: formData.gender,
          },
          address_details: {
            type: "COMMUNICATION",
            address_line: formData.addressLine,
            locality: formData.locality,
            pincode: parseInt(formData.pincode),
            state_code: formData.stateCode,
            city: formData.city,
          },
          professional_details: {
            occupation_type: formData.occupationType,
            company_name: formData.companyName,
            income: parseInt(formData.income),
            salary_received_type: formData.salaryType,
          },
          loan_details: {
            amount: parseInt(formData.loanAmount),
            // Don't include interest/tenure unless you have complete data
            // interest: {
            //   type: "FLAT",
            //   frequency: "MONTHLY",
            //   value: 1.5,
            // },
            // tenure: {
            //   type: "MONTHLY",
            //   value: 12,
            // },
          },
          consent_data: [
            {
              consent_type: "bureau_consent",
              ip_address: userIp,
              latitude: 0, // Get from browser geolocation if needed
              longitude: 0,
              device_id: deviceId,
              content: "I authorize credit bureau check for loan processing...",
            },
            {
              consent_type: "login",
              ip_address: userIp,
              latitude: 0,
              longitude: 0,
              device_id: deviceId,
              content: "I agree to the terms and conditions...",
            },
          ],
          bureau_data: {
            name: "CIBIL",
            report: [],
          },
          regulated_entity_id: "<RE_CODE>", // Will be provided by LendenClub
          redirection_url: "https://yourapp.com/loan/callback",
        },
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/lendenclub/prod/lead/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        // Save lead ID
        const leadId = data.data.lead_id;
        localStorage.setItem("lendenclub_lead_id", leadId);

        // Redirect to Vartis One for KYC
        window.location.href = data.data.redirection_link;
      } else {
        console.error("Lead creation failed:", data.errors);
        alert(`Error: ${data.message}\n${data.errors?.join("\n")}`);
      }
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createLead();
      }}>
      {/* Your form fields here */}
      <button type="submit">Submit Loan Application</button>
    </form>
  );
};

export default LoanApplication;
```

---

## End-to-End Frontend Flow (orchestration example)

```javascript
// Backend manages dedupe → status (if duplicate) → preapproval → create lead → redirection link fetch
const submitLendenClubJourney = async (payload) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  };

  // 1) DEDUPE
  const dedupe = await fetch(
    "http://127.0.0.1:8000/api/lendenclub/prod/dedupe",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        payload: {
          mobile_number: payload.basic_details.mobile_number,
          pan: payload.basic_details.pan,
          email: payload.basic_details.email,
          regulated_entity_id: payload.regulated_entity_id,
        },
      }),
    }
  ).then((r) => r.json());

  if (dedupe.status !== "success") throw new Error(dedupe.message);
  if (dedupe.data.status === "REJECT") {
    return { kind: "existing", data: dedupe.data }; // Show existing status & stop
  }

  // 2) PREAPPROVAL
  const preapproval = await fetch(
    "http://127.0.0.1:8000/api/lendenclub/prod/preapproval-offer",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ payload }),
    }
  ).then((r) => r.json());

  if (preapproval.status !== "success") throw new Error(preapproval.message);
  if (preapproval.data.status === "REJECT")
    return { kind: "rejected", data: preapproval.data };

  // 3) CREATE LEAD (backend fetches redirection link via GET LEAD DETAIL if missing)
  const lead = await fetch(
    "http://127.0.0.1:8000/api/lendenclub/prod/lead/create",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ payload }),
    }
  ).then((r) => r.json());

  if (lead.status !== "success") throw new Error(lead.message);

  localStorage.setItem("lendenclub_lead_id", lead.data.lead_id);
  return { kind: "created", data: lead.data };
};
```

---

## State Codes Reference

| State                       | Code | State                  | Code |
| --------------------------- | ---- | ---------------------- | ---- |
| Andaman and Nicobar Islands | AN   | Andhra Pradesh         | AD   |
| Arunachal Pradesh           | AR   | Assam                  | AS   |
| Bihar                       | BH   | Chandigarh             | CH   |
| Chhattisgarh                | CT   | Dadra and Nagar Haveli | DN   |
| Daman and Diu               | DD   | Delhi                  | DL   |
| Goa                         | GA   | Gujarat                | GJ   |
| Haryana                     | HR   | Himachal Pradesh       | HP   |
| Jammu and Kashmir           | JK   | Jharkhand              | JH   |
| Karnataka                   | KA   | Kerala                 | KL   |
| Ladakh                      | LA   | Lakshadweep Islands    | LD   |
| Madhya Pradesh              | MP   | Maharashtra            | MH   |
| Manipur                     | MN   | Meghalaya              | ME   |
| Mizoram                     | MI   | Nagaland               | NL   |
| Odisha                      | OR   | Puducherry             | PY   |
| Punjab                      | PB   | Rajasthan              | RJ   |
| Sikkim                      | SK   | Tamil Nadu             | TN   |
| Telangana                   | TL   | Tripura                | TR   |
| Uttar Pradesh               | UP   | Uttarakhand            | UT   |
| West Bengal                 | WB   |

---

## Error Handling

### Validation Errors (400)

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    "basic_details.mobile_number is invalid (10 digits starting with 6-9)",
    "basic_details.gender must be \"M\" or \"F\"",
    "address_details.pincode must be 6 digits"
  ]
}
```

### Common Validation Issues

1. **Gender**: Must be `"M"` or `"F"`, not `"Male"` or `"Female"`
2. **Date**: Send in `YYYY-MM-DD` format (ISO), backend will convert
3. **Mobile**: 10 digits starting with 6, 7, 8, or 9
4. **PAN**: Format `AAAAA9999A` (5 letters, 4 digits, 1 letter)
5. **Pincode**: Exactly 6 digits
6. **State**: 2-letter code (see table above)
7. **Income/Amount**: Must be positive numbers, not 08. **Interest/Tenure**: Either include complete object OR omit entirely (no empty objects `{}`)
8. **bureau_data.report**: Must be an array `[]`, not a string `""`8. **Consent**: Must have at least 2 consents (bureau_consent and login)

---

## Testing Checklist

- [ ] Test dedupe with existing customer
- [ ] Test dedupe with new customer
- [ ] Test preapproval with valid data
- [ ] Test create lead with complete data
- [ ] Verify redirection to Vartis One works
- [ ] Test status check after lead creation
- [ ] Verify validation catches incorrect formats (gender, dates, etc.)
- [ ] Test with different state codes
- [ ] Verify consent data is sent correctly
- [ ] Check error handling for all endpoints

---

## Summary

**Key Points:**

1. Use **nested structure** (basic_details, address_details, etc.)
2. Send dates in **ISO format** (YYYY-MM-DD)
3. Don't include `consent_dtm` - backend generates it
4. Gender must be **"M" or "F"**
5. State codes are **2 letters** (MH, DL, etc.)
6. Income and amounts must be **positive numbers**
7. Save the **lead_id** for tracking
8. Redirect user to **redirection_link** for KYC

**Questions?** Refer to official documentation: https://documenter.getpostman.com/view/15341834/2sBXVcmtNy
