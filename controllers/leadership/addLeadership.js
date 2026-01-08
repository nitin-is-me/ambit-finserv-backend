const {customErrorMessages} = require('../../utils/helpers');
const {leadershipValidation} = require('../../validation/leadershipValidation');
const Leadership = require('../../model/leadershipModel');

const addLeadership = async (req, res) => {
  try {
    await leadershipValidation.validateAsync(req.body);

    const {name, image, description, designation} = req.body;

    const newLeadership = await Leadership.create({
      name,
      image,
      description,
      designation,
    });

    res.status(201).json({
      success: true,
      message: 'Leadership added successfully',
      data: newLeadership,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addLeadership;
