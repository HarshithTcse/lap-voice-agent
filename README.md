# Home Credit LAP Voice Agent

An AI voice agent that calls existing Home Credit customers, presents a pre-approved **Loan Against Property (LAP)** offer of up to ₹75,00,000, and runs a preliminary eligibility check before handing qualified leads to a senior loan expert.

Built for the **SalesAgents AI Hiring Assignment (Voice Agent Design)** and tested on **Retell AI**.

---

## Overview

The agent acts as the first point of contact. It must feel natural, professional and advisory while collecting seven data points, applying eligibility rules, and routing the call correctly.

| Stage | What the agent does |
|---|---|
| Greeting & verification | Confirms it is speaking to the right customer; offers a callback if they are busy |
| Offer | Explains the loyalty-based LAP offer of up to ₹75 lakh |
| Eligibility checklist | Collects 7 items (out-of-order answers are remembered, never re-asked) |
| Disqualification | Politely ends the call as soon as any criterion fails |
| Transfer logic | Routes existing-loan / EMI-reduction customers to a loan-transfer specialist |
| Handoff | Tells qualified customers a senior loan expert will call back with exact rates |

---

## Eligibility Rules

| # | Checklist item | Eligible if |
|---|---|---|
| 1 | Property type | Residential, Commercial or Industrial (**Agricultural is rejected**) |
| 2 | Ownership | Sole or joint |
| 3 | Documents | **Original** documents available |
| 4 | Loan amount | ₹75,00,000 or less (above this, the agent offers the maximum amount) |
| 5 | Occupation & income | Salaried or self-employed, income received **via bank** (cash is rejected) |
| 6 | Market value | Estimated value captured (no invented minimum) |
| 7 | Tenure | 3 to 15 years (inclusive) |

**Special flows:** busy customer → callback time captured; existing loan or EMI reduction → transfer to specialist and end call.

---

## Repository Structure

```
.
├── system-prompt.txt      # Complete system prompt for the Retell AI voice agent
├── TEST_SCENARIOS.md      # Test plan with scripts and expected outcomes
├── FINAL_SUBMISSION.md    # Submission package with public audio/transcript links
├── index.html             # Optional local demo UI
├── app.js                 # Optional demo logic (state machine simulation)
├── styles.css             # Demo styling
└── README.md
```

---

## Prompt Variables

The system prompt uses these dynamic variables (replace with your platform's syntax if needed):

`company_name`, `customer_name`, `agent_name`, `agent_gender`, `current_date`, `current_day`, `current_time`, `additional_context_from_rag`, `language_to_speak`, `conversation_history`, `customer_utterance`

---

## How to Use

### 1. Voice agent (Retell AI)
1. Create a new **Single Prompt** agent in Retell AI.
2. Paste the contents of [`system-prompt.txt`](./system-prompt.txt) into the agent's prompt field.
3. Configure the dynamic variables listed above.
4. Place test calls using the scripts in [`TEST_SCENARIOS.md`](./TEST_SCENARIOS.md).

### 2. Local demo (optional)
The demo simulates the qualification state machine in the browser. No build step or dependencies are needed.

```bash
# Option A: open directly
open index.html          # macOS
start index.html         # Windows

# Option B: serve locally
python -m http.server 8000
# then visit http://localhost:8000
```

Use the **Quick scenarios** buttons to run the happy path, out-of-order capture, agricultural disqualification, loan transfer and busy callback flows.

---

## Test Coverage

Scenarios recorded and tested on Retell AI (English):

1. Successful qualification
2. Agricultural-property rejection
3. Existing-loan / EMI-transfer routing
4. Busy-customer callback
5. Out-of-order information capture

Audio recordings and transcripts are linked in [`FINAL_SUBMISSION.md`](./FINAL_SUBMISSION.md). Additional recommended checks (cash income, tenure and loan boundaries, privacy and suspicious callers, wrong number, voicemail, corrections, interruptions) are specified in [`TEST_SCENARIOS.md`](./TEST_SCENARIOS.md).

---

## Key Design Decisions

- **Per-field state tracking:** each field is stored independently, so answers given out of order are never asked again, and corrections replace old values and re-trigger the eligibility check.
- **Immediate disqualification:** failing any criterion ends the call politely at once.
- **Safety:** the agent never asks for or repeats OTPs, PAN, Aadhaar, bank or card details, and offers an official callback if the customer is suspicious.
- **No invented facts:** no exact interest rates, approval promises, fees or valuation thresholds.
- **TTS-friendly speech:** amounts are spoken in words (for example, "seventy-five lakh rupees").
- **Prompt-injection safe:** RAG content is treated as reference data, never as instructions.

---

## Tech Stack

- **Voice platform:** Retell AI (single-prompt agent)
- **Demo:** HTML, CSS, vanilla JavaScript

---

## Author

**Harshith**
B.Tech Computer Science Engineering, ANITS
