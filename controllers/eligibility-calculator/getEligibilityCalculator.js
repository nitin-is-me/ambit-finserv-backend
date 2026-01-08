const EligibilityCalculator = require('../../model/eligibilityCalculatorModel');
const {customErrorMessages} = require('../../utils/helpers');
const {
  createDateRangeFilter,
  createPaginationParams,
  validateSearchParams,
  createSearchMetadata,
} = require('../../utils/searchHelpers');

const getEligibilityCalculators = async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      excel,
      search,
      is_otp_verified,
      city,
      state,
    } = req.query;

    // Validate search parameters
    const validation = validateSearchParams({
      page,
      limit,
      fromDate,
      toDate,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid search parameters',
        errors: validation.errors,
      });
    }

    // Build filter object
    const filter = {};

    // Add date range filter
    const dateFilter = createDateRangeFilter(fromDate, toDate);
    Object.assign(filter, dateFilter);

    // Add OTP verification filter
    if (is_otp_verified !== undefined) {
      filter.is_otp_verified = is_otp_verified === 'true';
    }

    // Add city filter
    if (city) {
      filter.city = new RegExp(city, 'i');
    }

    // Add state filter
    if (state) {
      filter.state = new RegExp(state, 'i');
    }

    // Add search filter for name or phone number
    if (search) {
      filter.$or = [
        {name: new RegExp(search, 'i')},
        {phone_number: new RegExp(search, 'i')},
      ];
    }

    // Create pagination parameters
    const {pageNumber, pageSize, skip} = createPaginationParams(page, limit);

    // Get total count
    const totalCount = await EligibilityCalculator.countDocuments(filter);

    let eligibilityCalculators = [];

    if (excel) {
      eligibilityCalculators = await EligibilityCalculator.find(filter)
        .sort({createdAt: -1})
        .select('-__v -otp'); // Exclude OTP from response
    } else {
      eligibilityCalculators = await EligibilityCalculator.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(pageSize)
        .select('-__v -otp'); // Exclude OTP from response
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    // Create pagination object
    const pagination = {
      totalEntries: totalCount,
      totalPages,
      currentPage: pageNumber,
      pageSize,
    };

    // Create search metadata
    const metadata = createSearchMetadata(search, totalCount, pagination);

    // Add statistics
    const stats = await EligibilityCalculator.aggregate([
      {$match: filter},
      {
        $group: {
          _id: null,
          totalVerified: {
            $sum: {$cond: ['$is_otp_verified', 1, 0]},
          },
          totalUnverified: {
            $sum: {$cond: ['$is_otp_verified', 0, 1]},
          },
          totalByCity: {
            $push: '$city',
          },
          totalByState: {
            $push: '$state',
          },
        },
      },
    ]);

    const statistics =
      stats.length > 0
        ? stats[0]
        : {
            totalVerified: 0,
            totalUnverified: 0,
            totalByCity: [],
            totalByState: [],
          };

    res.status(200).json({
      success: true,
      message: 'Eligibility calculations fetched successfully',
      data: eligibilityCalculators,
      statistics: {
        total_verified: statistics.totalVerified,
        total_unverified: statistics.totalUnverified,
        total_entries: totalCount,
      },
      ...metadata,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message});
  }
};

module.exports = getEligibilityCalculators;
