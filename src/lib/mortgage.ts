export interface MortgageInput {
  price: number;
  downPct: number; // 0–1
  ratePct: number; // annual, e.g. 6.5
  termYears: 15 | 30;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPI: number; // principal + interest
  monthlyTax: number; // CA prop tax est. ~1.1%/yr
  monthlyInsurance: number;
  monthlyTotal: number;
  downPayment: number;
}

const CA_PROP_TAX_RATE = 0.011;
const ANNUAL_INSURANCE_EST = 1_800;

export function computeMortgage({ price, downPct, ratePct, termYears }: MortgageInput): MortgageResult {
  const downPayment = price * downPct;
  const loanAmount = price - downPayment;
  const r = ratePct / 100 / 12;
  const n = termYears * 12;
  const monthlyPI = r === 0 ? loanAmount / n : (loanAmount * r) / (1 - Math.pow(1 + r, -n));
  const monthlyTax = (price * CA_PROP_TAX_RATE) / 12;
  const monthlyInsurance = ANNUAL_INSURANCE_EST / 12;
  return {
    loanAmount,
    monthlyPI,
    monthlyTax,
    monthlyInsurance,
    monthlyTotal: monthlyPI + monthlyTax + monthlyInsurance,
    downPayment,
  };
}
