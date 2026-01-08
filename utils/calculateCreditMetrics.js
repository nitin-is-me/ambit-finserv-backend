/* eslint-disable max-lines, no-nested-ternary */
/**
 * Calculate all 20 credit metrics from CIBIL API response
 * Based on the copilot_prompt.md specifications
 */

// Account Type Mapping
const ACCOUNT_TYPES = {
  SECURED: {
    '01': 'Auto Loan (Personal)',
    '02': 'Housing Loan',
    '04': 'Property Loan',
    '06': 'Gold Loan',
    31: 'Secured Credit Card',
  },
  UNSECURED: {
    '05': 'Personal Loan',
    '07': 'Consumer Loan',
    10: 'Credit Card',
    17: 'Professional Loan',
  },
};

// Payment status code to days conversion
const paymentStatusToDays = {
  0: 0, // On-time
  1: 30, // 30 DPD
  2: 60, // 60 DPD
  3: 90, // 90 DPD
  4: 120, // 120 DPD
  5: 150, // 150 DPD
  6: 180, // 180+ DPD
};

/**
 * Parse date string with timezone offset
 * Input format: "2025-07-22+05:30" or "2025-07-22T10:30:00+05:30"
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Remove timezone offset
  const cleanDate = dateStr.split('+')[0];
  // Parse as UTC - use 'Z' suffix to force UTC interpretation
  const date = new Date(`${cleanDate}Z`);
  return date;
}

/**
 * Main function to calculate all credit metrics
 */
function calculateCreditMetrics(apiResponse) {
  try {
    // Navigate to TrueLinkCreditReport
    let trueLinkCreditReport =
      apiResponse?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess?.Asset
        ?.TrueLinkCreditReport;

    // Fallback paths
    if (!trueLinkCreditReport) {
      trueLinkCreditReport =
        apiResponse?.data?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess
          ?.Asset?.TrueLinkCreditReport ||
        apiResponse?.GetCustomerAssetsResponse?.GetCustomerAssetsSuccess
          ?.TrueLinkCreditReport ||
        apiResponse?.TrueLinkCreditReport ||
        apiResponse?.data?.TrueLinkCreditReport;
    }

    if (!trueLinkCreditReport) {
      return getDefaultMetrics();
    }

    const borrower = trueLinkCreditReport.Borrower || {};
    const creditScore = borrower.CreditScore || {};

    // Get report date from CreditScore source
    const reportDate = parseDate(
      creditScore?.Source?.InquiryDate ||
        borrower.Birth?.Source?.InquiryDate ||
        trueLinkCreditReport.Sources?.Source?.InquiryDate,
    );

    // Get tradelines and inquiries arrays (they are under Borrower, not TrueLinkCreditReport)
    const tradeLines = Array.isArray(borrower.TradeLinePartition)
      ? borrower.TradeLinePartition
      : Array.isArray(trueLinkCreditReport.TradeLinePartition)
        ? trueLinkCreditReport.TradeLinePartition
        : [];

    const inquiries = Array.isArray(borrower.InquiryPartition)
      ? borrower.InquiryPartition
      : Array.isArray(trueLinkCreditReport.InquiryPartition)
        ? trueLinkCreditReport.InquiryPartition
        : [];

    // Initialize metrics object
    const metrics = {};

    // ============================================
    // 1. CIBIL SCORE (extract and convert)
    // ============================================
    metrics.cibil_score = parseInt(creditScore?.riskScore) || 0;

    // ============================================
    // 2. POPULATION RANK
    // ============================================
    metrics.population_rank = parseInt(creditScore?.populationRank) || 0;

    // ============================================
    // 3. SCORE MODEL
    // ============================================
    metrics.score_model = creditScore?.CreditScoreModel?.symbol || 'CIBILTUSC3';

    // ============================================
    // 4. CREDIT ACCOUNTS COUNT
    // ============================================
    metrics.credit_accounts_count = tradeLines.length;

    // ============================================
    // 5. INQUIRIES COUNT
    // ============================================
    metrics.inquiries_count = inquiries.length;

    // ============================================
    // 6-8. INQUIRIES BY TIME PERIOD
    // ============================================
    let inquiriesLast1Month = 0;
    let inquiriesLast3Months = 0;
    let inquiriesLast6Months = 0;

    if (reportDate) {
      const oneMonthAgo = new Date(reportDate);
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

      const threeMonthsAgo = new Date(reportDate);
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

      const sixMonthsAgo = new Date(reportDate);
      sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

      inquiries.forEach(inquiry => {
        const inquiryObj = inquiry.Inquiry || inquiry;
        // Try multiple possible paths for inquiry date
        const inquiryDate = parseDate(
          inquiryObj?.inquiryDate || // Real CIBIL: Inquiry.inquiryDate
            inquiryObj?.InquiryDate || // Alternative: Inquiry.InquiryDate
            inquiryObj?.Source?.InquiryDate, // Alternative: Inquiry.Source.InquiryDate
        );

        if (inquiryDate) {
          if (inquiryDate >= oneMonthAgo) {
            inquiriesLast1Month++;
          }
          if (inquiryDate >= threeMonthsAgo) {
            inquiriesLast3Months++;
          }
          if (inquiryDate >= sixMonthsAgo) {
            inquiriesLast6Months++;
          }
        }
      });
    }

    metrics.inquiries_last_1_month = inquiriesLast1Month;
    metrics.inquiries_last_3_months = inquiriesLast3Months;
    metrics.inquiries_last_6_months = inquiriesLast6Months;

    // ============================================
    // 9-11. LOAN AMOUNTS (Secured, Unsecured, Total)
    // ============================================
    let totalSecuredLoans = 0;
    let totalUnsecuredLoans = 0;
    let totalLiabilities = 0;
    let totalHighCredit = 0;

    tradeLines.forEach(tradeLine => {
      const tradeline = tradeLine.Tradeline || tradeLine;
      const accountType =
        tradeLine?.accountTypeSymbol || tradeline?.accountTypeSymbol || '';
      const currentBalance = parseFloat(tradeline?.currentBalance) || 0;
      const highBalance = parseFloat(tradeline?.highBalance) || 0;

      // Add to total liabilities (all accounts)
      totalLiabilities += currentBalance;
      totalHighCredit += highBalance;

      // Classify as secured or unsecured
      if (ACCOUNT_TYPES.SECURED[accountType]) {
        totalSecuredLoans += currentBalance;
      } else if (ACCOUNT_TYPES.UNSECURED[accountType]) {
        totalUnsecuredLoans += currentBalance;
      }
    });

    metrics.total_secured_loans = totalSecuredLoans;
    metrics.total_unsecured_loans = totalUnsecuredLoans;
    metrics.total_liabilities = totalLiabilities;

    // ============================================
    // 12. HIGH CREDIT ALL LOANS
    // ============================================
    metrics.high_credit_all_loans = totalHighCredit;

    // ============================================
    // 13-17. PAYMENT HISTORY & DELAYS
    // ============================================
    let maxDelayStatus = 0;
    let totalPayments = 0;
    let timelyPayments = 0;
    let bouncesLast3Months = 0;
    let bouncesLast6Months = 0;
    let bouncesLast12Months = 0;

    // Initialize SMA and NPA flags
    let hasSMA = false;
    let hasNPA = false;

    if (reportDate) {
      const threeMonthsAgo = new Date(reportDate);
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);

      const sixMonthsAgo = new Date(reportDate);
      sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

      const twelveMonthsAgo = new Date(reportDate);
      twelveMonthsAgo.setDate(twelveMonthsAgo.getDate() - 365);

      tradeLines.forEach(tradeLine => {
        const tradeline = tradeLine.Tradeline || tradeLine;
        const grantedTrade = tradeline?.GrantedTrade || {};
        const payStatusHistory = grantedTrade?.PayStatusHistory || {};
        let monthlyPayStatusArray = payStatusHistory?.MonthlyPayStatus || [];

        // Ensure it's an array (in case it's an array-like object)
        if (!Array.isArray(monthlyPayStatusArray)) {
          monthlyPayStatusArray = Object.values(monthlyPayStatusArray);
        }

        monthlyPayStatusArray.forEach(payStatus => {
          const status = payStatus?.status || '0';
          const statusNum = parseInt(status);
          const paymentDate = parseDate(payStatus?.date);

          // Skip non-actual payment statuses from payment calculations
          // XXX = no data, STD = standard, LSS = less than standard
          if (status === 'XXX' || status === 'STD' || status === 'LSS') {
            return;
          }

          // Track maximum delay
          if (statusNum > maxDelayStatus) {
            maxDelayStatus = statusNum;
          }

          // Count total and timely payments (excluding XXX and STD)
          totalPayments++;
          if (statusNum === 0) {
            timelyPayments++;
          }

          // Count bounces in time periods
          // A bounce is any status that is NOT "0" (on-time)
          const isBounce = statusNum !== 0;

          if (isBounce && paymentDate) {
            if (paymentDate >= threeMonthsAgo) {
              bouncesLast3Months++;
            }
            if (paymentDate >= sixMonthsAgo) {
              bouncesLast6Months++;
            }
            if (paymentDate >= twelveMonthsAgo) {
              bouncesLast12Months++;
            }
          }

          // Check for SMA (Special Mention Account)
          // SMA = statuses 24, 26, 27, 29 or "SMA", "SMA-0", "SMA-1" (30-90 DPD range in CIBIL)
          const smaCodes = ['24', '26', '27', '29', 'SMA', 'SMA-0', 'SMA-1'];
          if (
            smaCodes.includes(status) &&
            paymentDate &&
            paymentDate >= twelveMonthsAgo
          ) {
            hasSMA = true;
          }

          // Check for NPA (Non-Performing Asset)
          // NPA = statuses 903, "DBT", "NPA", "90+" (90+ DPD in CIBIL)
          const npaCodes = ['903', 'DBT', 'NPA', '90+'];
          if (
            npaCodes.includes(status) &&
            paymentDate &&
            paymentDate >= twelveMonthsAgo
          ) {
            hasNPA = true;
          }
        });
      });
    }

    metrics.maximum_delay_emi_payment =
      paymentStatusToDays[String(maxDelayStatus)] || 0;
    metrics.bounces_last_3_months = bouncesLast3Months;
    metrics.bounces_last_6_months = bouncesLast6Months;
    metrics.bounces_last_12_months = bouncesLast12Months;

    // ============================================
    // 14. TIMELY EMI PAYMENT PERCENTAGE
    // ============================================
    metrics.timely_emi_payment_percentage =
      totalPayments > 0
        ? parseFloat(((timelyPayments / totalPayments) * 100).toFixed(2))
        : 100.0;

    // ============================================
    // 18. SMA TAGGING
    // ============================================
    metrics.sma_tagging = hasSMA ? 'YES' : 'NO';

    // ============================================
    // 19. NPA TAGGING
    // ============================================
    metrics.npa_tagging = hasNPA ? 'YES' : 'NO';

    // ============================================
    // 20. WRITE-OFF TAGGING
    // ============================================
    let hasWriteOff = false;

    if (reportDate) {
      const twelveMonthsAgo = new Date(reportDate);
      twelveMonthsAgo.setDate(twelveMonthsAgo.getDate() - 365);

      tradeLines.forEach(tradeLine => {
        const tradeline = tradeLine.Tradeline || tradeLine;
        const writeOffAmount = parseFloat(tradeline?.writtenOffAmtTotal) || 0;
        const dateReported = parseDate(tradeline?.dateReported);

        if (
          writeOffAmount > 0 &&
          dateReported &&
          dateReported >= twelveMonthsAgo
        ) {
          hasWriteOff = true;
        }
      });
    }

    metrics.write_off_tagging_last_12_months = hasWriteOff ? 'YES' : 'NO';

    return metrics;
  } catch (error) {
    return getDefaultMetrics();
  }
}

/**
 * Return default metrics object
 */
function getDefaultMetrics() {
  return {
    bounces_last_12_months: 0,
    bounces_last_3_months: 0,
    bounces_last_6_months: 0,
    cibil_score: 0,
    credit_accounts_count: 0,
    high_credit_all_loans: 0,
    inquiries_count: 0,
    inquiries_last_1_month: 0,
    inquiries_last_3_months: 0,
    inquiries_last_6_months: 0,
    maximum_delay_emi_payment: 0,
    npa_tagging: 'NO',
    population_rank: 0,
    score_model: 'CIBILTUSC3',
    sma_tagging: 'NO',
    timely_emi_payment_percentage: 100.0,
    total_liabilities: 0,
    total_secured_loans: 0,
    total_unsecured_loans: 0,
    write_off_tagging_last_12_months: 'NO',
  };
}

module.exports = calculateCreditMetrics;
