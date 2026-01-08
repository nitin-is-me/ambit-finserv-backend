const {customErrorMessages} = require('../../utils/helpers');
const JobResume = require('../../model/job_resume');

const updateAnnualReports = async (req, res) => {
  try {
    const {
      _id,
      first_name,
      last_name,
      email,
      mobile_number,
      current_location,
      state,
      preferred_location,
      resume,
    } = req.body;

    const jobresume = await JobResume.updateOne(
      {_id},
      {
        first_name,
        last_name,
        email,
        mobile_number,
        current_location,
        state,
        preferred_location,
        resume,
      },
    );

    res.status(201).json({
      success: true,
      message: 'Job Resume updated successfully',
      data: jobresume,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateAnnualReports;
