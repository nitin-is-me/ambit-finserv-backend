/**
 * Search helper utilities for loan applications and other entities
 */

/**
 * Create a search filter for loan applications
 * @param {string} searchTerm - The search term to look for
 * @returns {Object} MongoDB filter object with $or conditions
 */
const createLoanApplicationSearchFilter = searchTerm => {
  if (!searchTerm || !searchTerm.trim()) {
    return {};
  }

  const trimmedSearch = searchTerm.trim();
  const searchRegex = new RegExp(trimmedSearch, 'i');

  return {
    $or: [
      {lead_id: searchRegex},
      {token_id: searchRegex},
      {first_name: searchRegex},
      {middle_name: searchRegex},
      {last_name: searchRegex},
      {email: searchRegex},
      {mobile_number: searchRegex},
      {pan_number: searchRegex},
      {aadhar_number: searchRegex},
      {dl_number: searchRegex},
      {pin_code: searchRegex},
      {city_name: searchRegex},
      {state_name: searchRegex},
      {loan_amount: searchRegex},
      {loan_duration: searchRegex},
      {resident_ownership: searchRegex},
      {customer_profile: searchRegex},
      {business_name: searchRegex},
      {business_pincode: searchRegex},
      {last_twelve_month_sales: searchRegex},
      {constitution: searchRegex},
      {number_of_years_in_business: searchRegex},
      {business_annual_turnover: searchRegex},
      {ownership_proof: searchRegex},
      {income: searchRegex},
      {loan_type: searchRegex},
      {utm_source: searchRegex},
      {utm_campaign: searchRegex},
      {utm_medium: searchRegex},
      {uniqueID: searchRegex},
    ],
  };
};

/**
 * Create a date range filter
 * @param {string} fromDate - Start date (YYYY-MM-DD)
 * @param {string} toDate - End date (YYYY-MM-DD)
 * @returns {Object} MongoDB filter object for date range
 */
const createDateRangeFilter = (fromDate, toDate) => {
  const filter = {};

  if (fromDate && toDate) {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    filter.createdAt = {$gte: from, $lte: to};
  } else if (fromDate) {
    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);
    filter.createdAt = {$gte: from};
  } else if (toDate) {
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    filter.createdAt = {$lte: to};
  }

  return filter;
};

/**
 * Create pagination parameters
 * @param {number|string} page - Page number
 * @param {number|string} limit - Items per page
 * @returns {Object} Pagination object with skip and limit
 */
const createPaginationParams = (page = 1, limit = 10) => {
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  return {
    pageNumber,
    pageSize,
    skip,
  };
};

/**
 * Create a generic search filter for any entity
 * @param {string} searchTerm - The search term
 * @param {Array} searchableFields - Array of field names to search in
 * @returns {Object} MongoDB filter object
 */
const createGenericSearchFilter = (searchTerm, searchableFields) => {
  if (!searchTerm || !searchTerm.trim() || !searchableFields.length) {
    return {};
  }

  const trimmedSearch = searchTerm.trim();
  const searchRegex = new RegExp(trimmedSearch, 'i');

  const orConditions = searchableFields.map(field => ({
    [field]: searchRegex,
  }));

  return {
    $or: orConditions,
  };
};

/**
 * Escape special regex characters in search terms
 * @param {string} searchTerm - The search term to escape
 * @returns {string} Escaped search term
 */
const escapeRegex = searchTerm =>
  searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Create a case-insensitive search regex
 * @param {string} searchTerm - The search term
 * @returns {RegExp} Case-insensitive regex
 */
const createSearchRegex = searchTerm => {
  if (!searchTerm || !searchTerm.trim()) {
    return null;
  }

  const escapedTerm = escapeRegex(searchTerm.trim());
  return new RegExp(escapedTerm, 'i');
};

/**
 * Validate search parameters
 * @param {Object} params - Search parameters
 * @returns {Object} Validation result
 */
const validateSearchParams = params => {
  const errors = [];

  // Validate page number
  if (
    params.page &&
    (Number.isNaN(Number(params.page)) || parseInt(params.page) < 1)
  ) {
    errors.push('Page number must be a positive integer');
  }

  // Validate limit
  if (
    params.limit &&
    (Number.isNaN(Number(params.limit)) || parseInt(params.limit) < 1)
  ) {
    errors.push('Limit must be a positive integer');
  }

  // Validate date format
  if (params.fromDate && !isValidDate(params.fromDate)) {
    errors.push('Invalid fromDate format. Use YYYY-MM-DD');
  }

  if (params.toDate && !isValidDate(params.toDate)) {
    errors.push('Invalid toDate format. Use YYYY-MM-DD');
  }

  // Validate date range
  if (params.fromDate && params.toDate) {
    const from = new Date(params.fromDate);
    const to = new Date(params.toDate);
    if (from > to) {
      errors.push('fromDate cannot be after toDate');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
const isValidDate = dateString => {
  const date = new Date(dateString);
  return date instanceof Date && !Number.isNaN(date.getTime());
};

/**
 * Create search response metadata
 * @param {string} searchTerm - The search term used
 * @param {number} totalResults - Total number of results
 * @param {Object} pagination - Pagination info
 * @returns {Object} Search metadata
 */
const createSearchMetadata = (searchTerm, totalResults, pagination) => ({
  search: searchTerm
    ? {
        query: searchTerm,
        fields: 'All searchable fields',
        totalResults,
      }
    : null,
  pagination,
});

module.exports = {
  createLoanApplicationSearchFilter,
  createDateRangeFilter,
  createPaginationParams,
  createGenericSearchFilter,
  escapeRegex,
  createSearchRegex,
  validateSearchParams,
  isValidDate,
  createSearchMetadata,
};
