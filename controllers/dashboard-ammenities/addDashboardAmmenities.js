const DashboardAmenities = require('../../model/dashboardAmmenities');
const {customErrorMessages} = require('../../utils/helpers');
const {
  addDashboardAmenitiesValidation,
} = require('../../validation/dashboardAmmenitiesValidation');

const addDashboardAmenity = async (req, res) => {
  try {
    await addDashboardAmenitiesValidation.validateAsync(req.body);
    const newDashboardAmenity = await DashboardAmenities.create(req.body);
    res.status(201).json({
      success: true,
      message: 'dashboard ammenity added successfully',
      data: newDashboardAmenity,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addDashboardAmenity;
