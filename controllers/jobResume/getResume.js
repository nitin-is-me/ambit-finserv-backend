const JobResume = require('../../model/job_resume');
const {customErrorMessages} = require('../../utils/helpers');

const getJobResume = async (req, res) => {
  try {
    const {fromDate, toDate, type_of_resume} = req.query;

    // Create filter object
    const filter = {};

    // Add date range filter if fromDate and toDate are provided
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      filter.createdAt = {
        $gte: new Date(fromDate),
      };
    } else if (toDate) {
      filter.createdAt = {
        $lte: new Date(toDate),
      };
    }
    if (type_of_resume) {
      filter.type_of_resume = type_of_resume;
    }

    const jobresume = await JobResume.find(filter).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: 'Job resume fetched successfully',
      data: jobresume,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getJobResume;
