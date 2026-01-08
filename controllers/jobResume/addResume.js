const JobResume = require('../../model/job_resume');
const {customErrorMessages} = require('../../utils/helpers');
const {
  jobResumeAddValidation,
} = require('../../validation/jobResumeValidation');

const addJobResume = async (req, res) => {
  try {
    await jobResumeAddValidation.validateAsync(req.body);
    const newJobResume = await JobResume.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Jobs added successfully',
      data: newJobResume,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addJobResume;
