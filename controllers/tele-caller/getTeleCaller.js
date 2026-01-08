const TeleCaller = require('../../model/teleCallerModel');
const {
  teleCallerGetValidation,
} = require('../../validation/teleCallerValidation');

const getTeleCaller = async (req, res) => {
  try {
    // Validate query parameters
    const {error, value} = teleCallerGetValidation.validate(req.query);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const {
      page,
      limit,
      mobile_number,
      type,
      date_from,
      date_to,
      disposition,
      search,
    } = value;

    // Build filter object
    const filter = {};

    if (mobile_number) {
      filter.mobile_number = mobile_number;
    }

    if (type) {
      filter.type = type;
    }

    if (disposition) {
      filter.disposition = new RegExp(disposition, 'i');
    }

    if (date_from || date_to) {
      filter.date = {};
      if (date_from) {
        filter.date.$gte = date_from;
      }
      if (date_to) {
        filter.date.$lte = date_to;
      }
    }

    if (search) {
      filter.$or = [
        {mobile_number: new RegExp(search, 'i')},
        {disposition: new RegExp(search, 'i')},
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get tele-caller entries with pagination
    const teleCallers = await TeleCaller.find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await TeleCaller.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get statistics
    const stats = await TeleCaller.aggregate([
      {$match: filter},
      {
        $group: {
          _id: null,
          total_calls: {$sum: 1},
          call_type_count: {$sum: {$cond: [{$eq: ['$type', 'call']}, 1, 0]}},
          facebook_type_count: {
            $sum: {$cond: [{$eq: ['$type', 'facebook']}, 1, 0]},
          },
          unique_mobile_numbers: {$addToSet: '$mobile_number'},
        },
      },
      {
        $project: {
          _id: 0,
          total_calls: 1,
          call_type_count: 1,
          facebook_type_count: 1,
          unique_mobile_count: {$size: '$unique_mobile_numbers'},
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Tele-caller entries retrieved successfully',
      data: teleCallers,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit: limit,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
      statistics:
        stats.length > 0
          ? stats[0]
          : {
              total_calls: 0,
              call_type_count: 0,
              facebook_type_count: 0,
              unique_mobile_count: 0,
            },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tele-caller entries',
      error: error.message,
    });
  }
};

module.exports = getTeleCaller;
