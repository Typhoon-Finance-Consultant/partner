# LendenClub Partner Portal Integration Guide

**Official LendenClub Documentation:** https://documenter.getpostman.com/view/15341834/2sBXVcmtNy

## Overview

This guide explains how to integrate the **Partner Portal Frontend** with the **Typhoon Backend** for LendenClub loan processing.

**Key Difference from Customer Portal:**

- Partners submit applications **on behalf of customers**.
- Partners must be authenticated with their own credentials.
- The backend automatically tags leads as `PARTNER` initiated based on the authenticated user's profile.
- Endpoints are **identical** to the Customer Portal; the backend handles the differentiation internally.

**Architecture:**

```
Partner React Portal → Django Backend (Auth: Partner) → LendenClub API
```

---

## Authentication

All endpoints require the **Partner's JWT Bearer token**:

```javascript
headers: {
  'Authorization': `Bearer ${partnerAccessToken}`,
  'Content-Type': 'application/json'
}
```

---

## Workflow Summary for Partners

1.  **Dedupe Check**: Verify if the _customer_ (not the partner) already exists.
2.  **Pre-approval Offer**: Submit _customer_ details to check eligibility.
3.  **Create Lead**: Generate the loan application for the _customer_ and get the redirection link.

---

## 1. DEDUPE CHECK (Partner)

**Purpose:** Check if the **customer** matches an existing LendenClub record.
**Endpoint:** `POST /api/lendenclub/prod/dedupe`

### Request Payload

Input the **customer's** details.

```json
{
  "payload": {
    "mobile_number": "9876543210", // Customer's Mobile
    "pan": "ABCDE1234F", // Customer's PAN
    "email": "customer@example.com", // Customer's Email
    "regulated_entity_id": "<RE_CODE>" // Provided by Admin
  }
}
```

### Response Handling

The response structure is identical to the customer portal.

- `status: "success"` + `data.status: "ACCEPT"` → **Proceed to Pre-approval**
- `status: "success"` + `data.status: "REJECT"` → **Stop**. Retrieve `data.existing_lead_status` to show the partner accurately why the lead is blocked (e.g., "Loan Sanctioned", "Rejected").

---

## 2. PRE-APPROVAL OFFER (Partner)

**Purpose:** Check eligibility for the customer.
**Endpoint:** `POST /api/lendenclub/prod/preapproval-offer`

### Request Payload

**Important:** Use the customer's personal and professional details.

```json
{
  "payload": {
    "basic_details": {
      "mobile_number": "9876543210", // Customer Mobile
      "email": "customer@example.com",
      "first_name": "CustomerFirst",
      "last_name": "CustomerLast",
      "pan": "ABCDE1234F",
      "date_of_birth": "1990-10-15", // ISO Format (YYYY-MM-DD)
      "gender": "M"
    },
    "address_details": {
      "type": "PERMANENT", // Use PERMANENT for consistency
      "address_line": "Customer Address Line 1",
      "locality": "Area Name",
      "pincode": 400058,
      "state_code": "MH", // 2-Letter Code
      "city": "Mumbai"
    },
    "professional_details": {
      "occupation_type": "SALARIED",
      "company_name": "Customer Company Name",
      "income": 50000,
      "salary_received_type": "DIRECT_ACCOUNT_TRANSFER"
    },
    "loan_details": {
      "amount": 100000,
      "tenure": { "type": "MONTHLY", "value": 12 }
    },
    "consent_data": [
      {
        "consent_type": "bureau_consent",
        "ip_address": "103.21.58.132", // User's IP (or Partner's)
        "device_id": "partner-portal-web",
        "visit_id": "...", // Optional
        "content": "I hereby give my consent..." // Standard Consent Text
      },
      {
        "consent_type": "login",
        "ip_address": "103.21.58.132",
        "device_id": "partner-portal-web",
        "content": "I hereby authorize..."
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

**Note on Consents:**
Even though the partner is performing the action, the **content** of the consent usually implies the customer has agreed offline or via the partner's interface. Ensure your UI collects this consent physically or digitally from the customer before the partner clicks submit.

---

## 3. CREATE LEAD (Partner)

**Purpose:** Finalize the application and get the link for the customer to complete KYC.
**Endpoint:** `POST /api/lendenclub/prod/lead/create`

### Request Payload

Same as Pre-approval, but includes `redirection_url`.

```json
{
  "payload": {
    // ... All fields from Pre-approval ...
    "redirection_url": "https://partner.typhoonfincare.in/leads/success", // Partner Portal Success Page
    "regulated_entity_id": "<RE_CODE>"
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
    "redirection_link": "https://staging-plxx.xxx.com/?xxx", // Share this with Customer
    "status": "ACCEPT"
  }
}
```

**Action Required:**
Display the `redirection_link` to the partner. The partner must **share this link with the customer** (via WhatsApp/Email/SMS) so the customer can complete the KYC, E-Mandate, and Agreement steps on their own device.

---

## 4. TRACKING STATUS

Partners can check the status of their leads.

**Endpoint:** `POST /api/lendenclub/prod/dedupe` (Reuse Dedupe logic)
**Behavior:** If the lead exists, the dedupe endpoint returns the **current status object** in the rejection payload. This allows partners to see if the customer has completed the steps sent in the redirection link.

```json
// Example Status Response inside Dedupe Reject
"existing_lead_status": {
    "event_name": "KYC",
    "status": "COMPLETED",  // Customer finished KYC
    "event_time": "..."
}
```

## Common Errors & Troubleshooting

| Error                                           | Cause                            | Fix                                                                       |
| :---------------------------------------------- | :------------------------------- | :------------------------------------------------------------------------ |
| `Validation Failed: address_details.state_code` | Invalid State Code               | Use 2-letter codes (e.g., 'MH', 'DL'). Do not send full state names.      |
| `CONSENT_FIELD_MISSING`                         | Missing fields in `consent_data` | Ensure `device_id`, `ip_address`, `content`, and `consent_type` are sent. |
| `401 Unauthorized`                              | Invalid Token                    | Refresh the Partner's JWT token.                                          |
| `Dedupe: REJECT`                                | Customer exists                  | Check `existing_lead_status` to inform the partner of the current state.  |
