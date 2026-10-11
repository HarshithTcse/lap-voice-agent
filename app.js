const MAX_LOAN = 7500000;
const CHECKLIST = [
  ["property_type", "Property type"],
  ["ownership_status", "Ownership"],
  ["documents_available", "Original documents"],
  ["loan_amount", "Loan amount"],
  ["occupation_income", "Occupation and income"],
  ["market_value", "Market value"],
  ["tenure_years", "Tenure"],
];

const scenarioData = {
  happy: [
    "Yes, this is Priya.",
    "Yes, I would like to check eligibility.",
    "It is a residential house, solely owned by me. The originals are available. I need 50 lakhs, I am salaried and my income comes into my bank. The property is worth about 1 crore and I want 10 years.",
  ],
  outOfOrder: [
    "Yes, this is Priya.",
    "Yes, please continue.",
    "It is a commercial shop jointly owned with my brother, I need 40 lakhs, and my salary comes into my bank.",
    "The original documents are available, the property is worth 80 lakhs and I want 7 years.",
  ],
  agricultural: ["Yes, this is Priya.", "Yes.", "It is agricultural land."],
  transfer: ["Yes, this is Priya.", "Yes.", "I already have a loan and want to reduce my current EMI."],
  busy: ["Yes, this is Priya.", "I am driving. Please call me tomorrow at 11 AM."],
};

const state = {
  phase: "verify",
  ended: false,
  status: "in_progress",
  customer_verified: false,
  transfer_required: false,
  disqualified: false,
  callback_requested: false,
  amount_pending_confirmation: false,
  fields: {
    property_type: null,
    ownership_status: null,
    documents_available: null,
    loan_amount: null,
    occupation: null,
    income_mode: null,
    market_value: null,
    tenure_years: null,
  },
};

const transcript = document.querySelector("#transcript");
const input = document.querySelector("#customer-input");
const sendButton = document.querySelector("#send");
const statePanel = document.querySelector("#state-panel");
const progress = document.querySelector("#progress");
const statusBadge = document.querySelector("#status");

function addMessage(role, text) {
  const item = document.createElement("div");
  item.className = `message ${role}`;
  item.innerHTML = `<span class="speaker">${role === "agent" ? "Agent" : "Customer"}</span><p>${escapeHtml(text)}</p>`;
  transcript.appendChild(item);
  transcript.scrollTop = transcript.scrollHeight;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[char]));
}

function normalise(text) {
  return text.toLowerCase().replace(/[₹,]/g, " ").replace(/\s+/g, " ").trim();
}

function parseAmount(text) {
  const value = normalise(text);
  const lakh = value.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs)/);
  if (lakh) return Number(lakh[1]) * 100000;
  const crore = value.match(/(\d+(?:\.\d+)?)\s*crore/);
  if (crore) return Number(crore[1]) * 10000000;
  const rupees = value.match(/(?:rs|inr|rupees?)\s*(\d+(?:\.\d+)?)/);
  return rupees ? Number(rupees[1]) : null;
}

function captureOutOfOrder(text) {
  const value = normalise(text);
  if (!state.fields.property_type) {
    if (/\bagricultural\b|\bfarm(?:land)?\b|\bkheti\b/.test(value)) state.fields.property_type = "Agricultural";
    else if (/\bcommercial\b|\bshop\b|\boffice\b/.test(value)) state.fields.property_type = "Commercial";
    else if (/\bindustrial\b|\bfactory\b/.test(value)) state.fields.property_type = "Industrial";
    else if (/\bresidential\b|\bhouse\b|\bflat\b|\bhome\b/.test(value)) state.fields.property_type = "Residential";
  }
  if (!state.fields.ownership_status) {
    if (/\bjoint\b|\bwith my\b|\bco[- ]owner\b/.test(value)) state.fields.ownership_status = "Joint";
    else if (/\bsole(?:ly)?\b|\bonly owner\b|\bmy property\b/.test(value)) state.fields.ownership_status = "Sole";
  }
  if (!state.fields.documents_available) {
    if (/\bphotocopi|\bno originals?\b|\bmissing originals?\b/.test(value)) state.fields.documents_available = "Unavailable";
    else if (/\boriginals?\b.*\b(available|ready|home)\b|\b(available|ready|home)\b.*\boriginals?\b/.test(value)) state.fields.documents_available = "Available";
  }
  if (!state.fields.loan_amount) {
    const amount = parseAmount(value);
    if (amount !== null && /\b(need|borrow|loan|amount|lakh|lac|crore|rupees?)\b/.test(value)) state.fields.loan_amount = amount;
  }
  if (!state.fields.occupation) {
    if (/\bsalaried\b|\bsalary\b|\bjob\b/.test(value)) state.fields.occupation = "Salaried";
    else if (/\bself[- ]?employed\b|\bbusiness\b/.test(value)) state.fields.occupation = "Self-employed";
  }
  if (!state.fields.income_mode) {
    if (/\bcash\b/.test(value)) state.fields.income_mode = "Cash";
    else if (/\bbank\b|\baccount\b|\bsalary comes\b/.test(value)) state.fields.income_mode = "Bank";
  }
  if (!state.fields.market_value && /\bworth\b|\bmarket value\b|\bvalue\b/.test(value)) {
    const valueMatch = value.match(/(?:worth|market value|valued at)\s+(?:about\s+)?(.+?)(?=\s+\band\b|\s+and\s+i\b|$)/);
    const amount = parseAmount(valueMatch ? valueMatch[1] : value);
    if (amount !== null) state.fields.market_value = amount;
  }
  if (!state.fields.tenure_years) {
    const years = value.match(/(\d+)\s*(?:year|years|yr|yrs)/);
    if (years && /\b(repay|tenure|term|take|years?)\b/.test(value)) state.fields.tenure_years = Number(years[1]);
  }
}

function disqualify(reason) {
  state.disqualified = true;
  state.status = "not_eligible";
  state.ended = true;
  state.phase = "ended";
  addMessage("agent", `Thank you for sharing that. ${reason} You do not meet the criteria for this specific offer at this time. Thank you for your time.`);
  render();
  return true;
}

function finish(text, status = "completed") {
  state.status = status;
  state.ended = true;
  state.phase = "ended";
  addMessage("agent", text);
  render();
}

function checkRules() {
  const f = state.fields;
  if (f.property_type === "Agricultural") return disqualify("Agricultural property is not covered by this offer.");
  if (f.documents_available === "Unavailable") return disqualify("Original property documents are required for verification.");
  if (f.income_mode === "Cash") return disqualify("This offer requires income to be received through a bank.");
  if (f.loan_amount && f.loan_amount > MAX_LOAN && !state.amount_pending_confirmation) {
    state.amount_pending_confirmation = true;
    state.phase = "amount_confirmation";
    addMessage("agent", "This offer is available for up to ₹75,00,000. Would you like to proceed with the maximum eligible amount of ₹75,00,000?");
    return true;
  }
  if (f.tenure_years && (f.tenure_years < 3 || f.tenure_years > 15)) return disqualify("The repayment period must be between 3 and 15 years.");
  return false;
}

function nextField() {
  const f = state.fields;
  if (!f.property_type) return ["property_type", "Is the property residential, commercial, or industrial?"];
  if (!f.ownership_status) return ["ownership_status", "Is the property solely owned by you or jointly owned?"];
  if (!f.documents_available) return ["documents_available", "Are the original property documents available for verification?"];
  if (!f.loan_amount) return ["loan_amount", "Approximately how much would you like to borrow?"];
  if (!f.occupation || !f.income_mode) return ["occupation_income", "Are you salaried or self-employed, and is your income received through a bank or in cash?"];
  if (!f.market_value) return ["market_value", "Approximately what is the current market value of the property?"];
  if (!f.tenure_years) return ["tenure_years", "How many years would you like to take to repay the loan?"];
  return null;
}

function handle(text) {
  if (state.ended || !text.trim()) return;
  addMessage("customer", text.trim());
  const value = normalise(text);
  if (/\b(do not call|don't call|stop calling|not interested)\b/.test(value)) return finish("Understood. Thank you for your time. Goodbye.", "declined");
  if (/\b(already have|existing)\b.*\bloan\b|\btransfer\b|\breduce\b.*\bemi\b|\bemi\b.*\breduce\b/.test(value)) {
    state.transfer_required = true;
    return finish("A loan-transfer specialist will contact you shortly regarding your existing loan or EMI request. Thank you.", "transfer");
  }
  if (/\b(busy|driving|call me later|callback|not a good time)\b/.test(value)) {
    state.callback_requested = true;
    return finish("Of course. Please share your preferred callback time. I will arrange a callback and end this call now. Thank you.", "callback_requested");
  }
  if (state.phase === "verify") {
    if (/\b(yes|speaking|that's me|correct)\b/.test(value)) {
      state.customer_verified = true;
      state.phase = "offer";
      addMessage("agent", "Thank you for confirming. Because of your loyalty, you have a pre-approved Home Credit Loan Against Property offer of up to ₹75,00,000, subject to eligibility and final review. Would you like to check your eligibility?");
    } else addMessage("agent", "May I confirm that I am speaking with Priya?");
    return render();
  }
  if (state.phase === "offer") {
    if (/\b(yes|sure|okay|interested|continue)\b/.test(value)) {
      state.phase = "transfer";
      addMessage("agent", "Is this for a new loan against the property, or do you already have a property loan or want to reduce an existing EMI?");
    } else if (/\b(no|not)\b/.test(value)) finish("Understood. Thank you for your time. Goodbye.", "declined");
    else addMessage("agent", "Would you like to check eligibility for this offer?");
    return render();
  }
  if (state.phase === "transfer") {
    state.phase = "qualification";
    captureOutOfOrder(text);
  } else if (state.phase === "amount_confirmation") {
    if (/\b(yes|proceed|okay|maximum)\b/.test(value)) {
      state.fields.loan_amount = MAX_LOAN;
      state.amount_pending_confirmation = false;
    } else if (/\b(no|decline)\b/.test(value)) return finish("Understood. Thank you for your time. Goodbye.", "declined");
  } else captureOutOfOrder(text);
  if (checkRules()) return render();
  const next = nextField();
  if (!next) return finish("Thank you. You have completed the preliminary check. A senior loan expert will call you shortly to discuss exact interest rates and the next steps. This is subject to final review. Goodbye.");
  state.phase = next[0] === "loan_amount" && state.amount_pending_confirmation ? "amount_confirmation" : "qualification";
  addMessage("agent", next[1]);
  render();
}

function render() {
  const f = state.fields;
  const answered = [f.property_type, f.ownership_status, f.documents_available, f.loan_amount, f.occupation && f.income_mode, f.market_value, f.tenure_years].filter(Boolean).length;
  progress.textContent = `${answered}/7 checklist items`;
  statusBadge.textContent = state.status.replaceAll("_", " ");
  statusBadge.className = `badge ${state.status}`;
  statePanel.innerHTML = CHECKLIST.map(([key, label]) => {
    const value = key === "occupation_income" ? [f.occupation, f.income_mode].filter(Boolean).join(" / ") : f[key];
    return `<div class="state-row"><span>${label}</span><strong>${value || "Unknown"}</strong></div>`;
  }).join("");
  sendButton.disabled = state.ended;
  input.disabled = state.ended;
}

function reset() {
  window.location.reload();
}

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value;
  input.value = "";
  handle(text);
});
document.querySelector("#reset").addEventListener("click", reset);
document.querySelectorAll("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => scenarioData[button.dataset.scenario].forEach((line, index) => {
    setTimeout(() => handle(line), index * 500);
  }));
});

addMessage("agent", "Hello, this is the Home Credit team. Am I speaking with Priya?");
render();
