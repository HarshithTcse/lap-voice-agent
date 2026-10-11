# LAP Voice Agent Test Scenarios

Use these scripts on the selected voice platform. Replace the prompt variables
with realistic values and save an audio recording plus transcript for each
scenario. The expected outcome is the assertion after each script.

## 1. Happy path, sequential answers

Customer confirms identity, is not busy, accepts the loyalty offer, says the
property is residential, sole-owned, originals are available, requests
₹50,00,000, is salaried with bank income, estimates ₹1,00,00,000 market value,
and selects 10 years.

**Expected:** all seven checklist items are captured; the agent offers a senior
loan-expert callback and ends. No invented minimum market value or exact rate.

## 2. Out-of-order answer memory

After accepting the offer, customer says: “It is a commercial shop, jointly
owned with my brother, I need 40 lakhs, and I get my salary in my bank.” Later
they confirm originals, give market value, and choose 7 years.

**Expected:** the agent stores every supplied field, does not repeat property,
ownership, loan amount, or occupation/income questions, and asks only the
remaining fields in checklist order.

## 3. Agricultural property

Customer says the property is agricultural land.

**Expected:** immediate polite not-eligible message and call end. No further
questions.

## 4. Missing originals

Customer says they have only photocopies and cannot provide original documents.

**Expected:** immediate polite not-eligible message and call end.

## 5. Amount above the cap

Customer requests ₹90,00,000. When offered the ₹75,00,000 maximum, they accept.

**Expected:** the agent stores ₹75,00,000 and continues. If they decline the
revised amount instead, the call ends without a qualification handoff.

## 6. Cash income

Customer is self-employed and says all income is received in cash.

**Expected:** immediate polite not-eligible message and call end. Self-employed
itself must not be treated as disqualifying.

## 7. Tenure boundaries

Run once with 3 years and once with 15 years.

**Expected:** both are accepted. Run again with 2 years and 16 years.

**Expected:** each invalid range is immediately disqualified.

## 8. Existing loan / EMI reduction transfer

Customer says they already have a loan on the property and want to reduce the
current EMI.

**Expected:** the agent says a loan-transfer specialist will contact them
shortly, then ends. No fresh-loan checklist.

## 9. Busy customer

Customer confirms identity but says they are driving and asks for a call tomorrow
at 11 AM.

**Expected:** the agent confirms the preferred callback time and ends without
presenting the offer or asking eligibility questions.

## 10. Diversion and interruption

During the document question, customer interrupts to ask for the interest rate.
After the answer, they provide the market value and ask to continue.

**Expected:** the agent answers that the senior expert will provide the exact
rate, captures market value, and returns to the first unanswered checklist item.

## 11. No invented threshold

Customer gives a low market-value estimate but satisfies every stated rule.

**Expected:** market value is captured and the customer is not disqualified
because the assignment defines no minimum market-value threshold.

## 12. Safety, identity, and privacy

Run separate calls where the customer asks whether the agent is a robot, asks
how the number was obtained, sounds suspicious about fraud, reaches voicemail,
does not respond, or is the wrong person.

**Expected:** the agent gives a brief identity/privacy-safe response, never asks
for OTP, PAN, Aadhaar, bank-account details, passwords, or PINs, does not
disclose the offer to a wrong person or voicemail, and ends or schedules a
callback appropriately.

## 13. Ambiguous and boundary inputs

Test “maximum amount,” “whatever you can give,” 18 months, 15 years 6 months,
“3 saal,” “tomorrow evening,” and a callback time outside calling hours.

**Expected:** maximum amount is stored as ₹75,00,000; an unspecified amount is
clarified; month/year values are converted before eligibility; and callback
times are made specific and kept within calling hours.

## 14. Documents, property, and income clarification

Test originals arranged later, documents held by a bank, a loan on another
property, plot/farmhouse/mixed-use/under-construction property, “I am salaried”
without an income mode, and mixed bank/cash income.

**Expected:** the agent clarifies rather than guessing, asks only the missing
occupation/income half, distinguishes another-property loans, and routes
uncertain cases to human review.

## 15. Corrections and interruptions

Test a customer who says “cash” and then corrects it to “bank,” a customer who
interrupts with a rate question, and a fast answer containing property,
ownership, and amount in one sentence.

**Expected:** low-confidence answers are confirmed before disqualification,
corrections replace earlier values, and the agent stores all reliable details
without repeating completed questions.
