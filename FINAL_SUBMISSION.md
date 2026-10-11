# Home Credit LAP Voice Agent — Final Submission

## Candidate deliverables

### 1. System Prompt

Submit [`system-prompt.txt`](./system-prompt.txt) as the complete system
prompt used in the Retell AI voice agent.

The prompt covers:

- Customer greeting and identity verification.
- Busy-customer callback handling.
- The loyalty-based LAP offer up to ₹75,00,000.
- Sequential collection of all seven eligibility checklist items.
- Out-of-order information capture without repeating answered questions.
- Agricultural-property and unavailable-original-document rejection.
- Loan amounts above ₹75,00,000 and the maximum-amount confirmation flow.
- Salaried/self-employed occupation with bank-income validation.
- Market-value capture without an invented minimum threshold.
- Inclusive tenure validation from 3 through 15 years.
- Existing-loan/EMI-reduction transfer routing.
- Interruption and diversion handling.
- Final senior-loan-expert handoff only after all required fields are complete.

The prompt includes all assignment variables:

`company_name`, `customer_name`, `agent_name`, `agent_gender`,
`current_date`, `current_day`, `current_time`,
`additional_context_from_rag`, `language_to_speak`,
`conversation_history`, and `customer_utterance`.

### 2. Public call recordings and call logs

The voice agent was configured and tested in Retell AI. The following public
Google Drive links contain the audio recordings and matching transcripts/call
logs:

| Scenario | Public audio recording | Public transcript / call log |
|---|---|---|
| Successful qualification | [Open audio](https://drive.google.com/file/d/1vjVvXD6_TytY_NYDLB7X-sh9gp69y0bw/view?usp=sharing) | [Open transcript](https://drive.google.com/file/d/1XEc0F8M7KAlVoXio0eYr-xT51B4poHJI/view?usp=sharing) |
| Agricultural-property rejection | [Open audio](https://drive.google.com/file/d/1EGy3I1UCfJEwMlPn__9SCTMlFlL1alOF/view?usp=sharing) | [Open transcript](https://drive.google.com/file/d/1JO0pI1iNHZSKZDQ5h7G-l4eKVpjdW2Xm/view?usp=sharing) |
| Existing-loan / EMI-transfer routing | [Open audio](https://drive.google.com/file/d/1eJdjf8zDtYs9xAGtB0yAcwhyz25eXiPA/view?usp=sharing) | [Open transcript](https://drive.google.com/file/d/18JmUJyxJXXtMSoSfn0czFJm0JJv4Yn8p/view?usp=sharing) |
| Busy-customer callback | [Open audio](https://drive.google.com/file/d/1eDTdGCZr9ZkT8D2Jzt-kUunx3fFNWkgZ/view?usp=sharing) | [Open transcript](https://drive.google.com/file/d/1O_towz0zL-YFiaujelHfP02eQ2kHANRB/view?usp=sharing) |
| Out-of-order information capture | [Open audio](https://drive.google.com/file/d/1V-mJ03drIhBkjKHEEtBTf03t_FCuyKzD/view?usp=sharing) | [Open transcript](https://drive.google.com/file/d/13v9jTc4Pw09l_-bXSN96WMMdHR1K8olB/view?usp=sharing) |

## Platform and test coverage

- **Voice platform:** Retell AI.
- **Language tested:** English.
- **Agent type:** Single-prompt voice agent.
- **Scenarios tested:** successful qualification, agricultural rejection,
  existing-loan transfer, busy callback, and out-of-order information capture.

The linked recordings cover the five scenarios listed above. The expanded
validation matrix in [`TEST_SCENARIOS.md`](./TEST_SCENARIOS.md) also specifies
additional recommended checks for cash income, tenure and loan boundaries,
privacy/suspicious callers, wrong numbers, voicemail, ambiguous documents and
property types, mixed income, corrections, and interruptions. Those additional
checks are not represented by public links in this submission unless a new link
is added below.

## Submission contents

Submit these two items:

1. [`system-prompt.txt`](./system-prompt.txt)
2. This document, [`FINAL_SUBMISSION.md`](./FINAL_SUBMISSION.md)

Supporting test plan: [`TEST_SCENARIOS.md`](./TEST_SCENARIOS.md).
