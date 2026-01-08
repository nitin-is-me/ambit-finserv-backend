const DashboardAmenities = require('../../model/dashboardAmmenities');
const {customErrorMessages} = require('../../utils/helpers');

const getDashboardAmmenities = async (req, res) => {
  try {
    const dashboardAmmenities = await DashboardAmenities.find({});
    res.status(200).json({
      success: true,
      message: 'dashboard ammenities fetched successfully',
      data: dashboardAmmenities,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getDashboardAmmenities;
