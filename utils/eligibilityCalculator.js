/**
 * Calculate loan eligibility based on various factors
 * @param {Object} data - User data for eligibility calculation
 * @returns {Object} Eligibility calculation results
 */
const calculateEligibility = data => {
  const {
    monthly_income = 0,
    monthly_expenses = 0,
    loan_amount = 0,
    loan_duration = 12,
    credit_score = 750,
    existing_loans = 0,
    employment_type,
    work_experience = 0,
    business_annual_turnover = 0,
    number_of_years_in_business = 0,
    customer_profile,
    loan_type = 'Udyam Loan',
  } = data;

  // Convert string values to numbers, default to 0 if invalid
  const monthlyIncome = parseFloat(monthly_income) || 0;
  const monthlyExpenses = parseFloat(monthly_expenses) || 0;
  const loanAmount = parseFloat(loan_amount) || 0;
  const loanDuration = parseFloat(loan_duration) || 12;
  const creditScore = parseFloat(credit_score) || 750;
  const existingLoans = parseFloat(existing_loans) || 0;
  const workExp = parseFloat(work_experience) || 0;
  const businessTurnover = parseFloat(business_annual_turnover) || 0;
  const yearsInBusiness = parseFloat(number_of_years_in_business) || 0;

  // Calculate debt-to-income ratio
  const debtToIncomeRatio =
    monthlyIncome > 0 ? (monthlyExpenses + existingLoans) / monthlyIncome : 0;

  // Calculate loan-to-income ratio
  const monthlyEMI = calculateEMI(
    loanAmount,
    loanDuration,
    getInterestRate(creditScore, loan_type),
  );
  const loanToIncomeRatio = monthlyIncome > 0 ? monthlyEMI / monthlyIncome : 0;

  // Eligibility scoring system (0-100)
  let eligibilityScore = 0;
  const rejectionReasons = [];

  // Credit Score Assessment (30 points)
  if (creditScore >= 750) {
    eligibilityScore += 30;
  } else if (creditScore >= 700) {
    eligibilityScore += 25;
  } else if (creditScore >= 650) {
    eligibilityScore += 20;
  } else if (creditScore >= 600) {
    eligibilityScore += 15;
  } else {
    eligibilityScore += 5;
    rejectionReasons.push('Low credit score');
  }

  // Income Assessment (25 points)
  if (monthlyIncome >= 50000) {
    eligibilityScore += 25;
  } else if (monthlyIncome >= 30000) {
    eligibilityScore += 20;
  } else if (monthlyIncome >= 20000) {
    eligibilityScore += 15;
  } else if (monthlyIncome >= 15000) {
    eligibilityScore += 10;
  } else {
    eligibilityScore += 5;
    rejectionReasons.push('Insufficient monthly income');
  }

  // Debt-to-Income Ratio Assessment (20 points)
  if (debtToIncomeRatio <= 0.3) {
    eligibilityScore += 20;
  } else if (debtToIncomeRatio <= 0.4) {
    eligibilityScore += 15;
  } else if (debtToIncomeRatio <= 0.5) {
    eligibilityScore += 10;
  } else {
    eligibilityScore += 5;
    rejectionReasons.push('High debt-to-income ratio');
  }

  // Employment Stability (15 points)
  if (employment_type === 'Salaried' && workExp >= 2) {
    eligibilityScore += 15;
  } else if (employment_type === 'Business Owner' && yearsInBusiness >= 3) {
    eligibilityScore += 15;
  } else if (employment_type === 'Self-Employed' && workExp >= 3) {
    eligibilityScore += 12;
  } else if (workExp >= 1) {
    eligibilityScore += 8;
  } else {
    eligibilityScore += 3;
    rejectionReasons.push('Insufficient work experience');
  }

  // Business Turnover (for business loans) (10 points)
  if (
    customer_profile === 'Business Owner' ||
    customer_profile === 'Self-Employed'
  ) {
    if (businessTurnover >= 1000000) {
      eligibilityScore += 10;
    } else if (businessTurnover >= 500000) {
      eligibilityScore += 8;
    } else if (businessTurnover >= 250000) {
      eligibilityScore += 5;
    } else {
      eligibilityScore += 2;
      rejectionReasons.push('Low business turnover');
    }
  } else {
    eligibilityScore += 10; // Full points for salaried individuals
  }

  // Determine eligibility
  const isEligible =
    eligibilityScore >= 60 &&
    debtToIncomeRatio <= 0.6 &&
    loanToIncomeRatio <= 0.4;

  // Calculate maximum loan amount
  const maxLoanAmount = calculateMaxLoanAmount(
    monthlyIncome,
    creditScore,
    loanDuration,
  );

  // Calculate recommended tenure
  const recommendedTenure = calculateRecommendedTenure(
    loanAmount,
    monthlyIncome,
    creditScore,
  );

  // Determine risk level
  let riskLevel = 'Medium';
  if (eligibilityScore >= 80) {
    riskLevel = 'Low';
  } else if (eligibilityScore < 50) {
    riskLevel = 'High';
  }

  // Calculate interest rate
  const interestRate = getInterestRate(creditScore, loan_type);

  // Calculate final EMI
  const finalEMI = calculateEMI(loanAmount, loanDuration, interestRate);

  return {
    is_eligible: isEligible,
    eligibility_percentage: Math.round(eligibilityScore),
    max_loan_amount: Math.round(maxLoanAmount),
    recommended_tenure: recommendedTenure,
    interest_rate: interestRate,
    monthly_emi: Math.round(finalEMI),
    risk_level: riskLevel,
    rejection_reasons: rejectionReasons,
    calculated_at: new Date(),
  };
};

/**
 * Calculate EMI using the formula
 * @param {number} principal - Loan amount
 * @param {number} tenure - Loan tenure in months
 * @param {number} rate - Annual interest rate
 * @returns {number} Monthly EMI
 */
const calculateEMI = (principal, tenure, rate) => {
  const monthlyRate = rate / (12 * 100);
  const emi =
    (principal * monthlyRate * (1 + monthlyRate) ** tenure) /
    ((1 + monthlyRate) ** tenure - 1);
  return emi;
};

/**
 * Get interest rate based on credit score and loan type
 * @param {number} creditScore - Credit score
 * @param {string} loanType - Type of loan
 * @returns {number} Interest rate
 */
const getInterestRate = (creditScore, loanType) => {
  let baseRate = 12; // Base rate 12%

  // Adjust based on credit score
  if (creditScore >= 750) {
    baseRate = 10;
  } else if (creditScore >= 700) {
    baseRate = 11;
  } else if (creditScore >= 650) {
    baseRate = 12;
  } else if (creditScore >= 600) {
    baseRate = 13;
  } else {
    baseRate = 15;
  }

  // Adjust based on loan type
  switch (loanType) {
    case 'Udyam Loan':
      baseRate += 1;
      break;
    case 'Vyapar Loan':
      baseRate += 0.5;
      break;
    case 'Used Car Loan':
      baseRate += 2;
      break;
    case 'Used Commercial Vehicle Loan':
      baseRate += 1.5;
      break;
    default:
      break;
  }

  return baseRate;
};

/**
 * Calculate maximum loan amount based on income and credit score
 * @param {number} monthlyIncome - Monthly income
 * @param {number} creditScore - Credit score
 * @param {number} tenure - Loan tenure in months
 * @returns {number} Maximum loan amount
 */
const calculateMaxLoanAmount = (monthlyIncome, creditScore, tenure) => {
  const maxEMI = monthlyIncome * 0.4; // 40% of monthly income
  const interestRate = getInterestRate(creditScore, 'Udyam Loan');
  const monthlyRate = interestRate / (12 * 100);

  const maxLoanAmount =
    (maxEMI * ((1 + monthlyRate) ** tenure - 1)) /
    (monthlyRate * (1 + monthlyRate) ** tenure);

  return Math.min(maxLoanAmount, 10000000); // Cap at 1 crore
};

/**
 * Calculate recommended tenure based on loan amount and income
 * @param {number} loanAmount - Loan amount
 * @param {number} monthlyIncome - Monthly income
 * @param {number} creditScore - Credit score
 * @returns {number} Recommended tenure in months
 */
const calculateRecommendedTenure = (loanAmount, monthlyIncome, creditScore) => {
  const maxEMI = monthlyIncome * 0.4;
  const interestRate = getInterestRate(creditScore, 'Udyam Loan');

  // Try different tenures to find the best fit
  for (let tenure = 12; tenure <= 60; tenure += 6) {
    const emi = calculateEMI(loanAmount, tenure, interestRate);
    if (emi <= maxEMI) {
      return tenure;
    }
  }

  return 60; // Default to maximum tenure
};

module.exports = {
  calculateEligibility,
  calculateEMI,
  getInterestRate,
  calculateMaxLoanAmount,
  calculateRecommendedTenure,
};
