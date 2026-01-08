const {customErrorMessages} = require('../../utils/helpers');
const DashboardAmenities = require('../../model/dashboardAmmenities');

const updateDashboardAmmenity = async (req, res) => {
  try {
    const {statistics, loans, dashboard_description, _id} = req.body;

    const updatedDashboardAmmenity = await DashboardAmenities.updateOne(
      {_id},
      {statistics, loans, dashboard_description},
    );

    res.status(201).json({
      success: true,
      message: 'dashbboard ammenity updated successfully',
      data: updatedDashboardAmmenity,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateDashboardAmmenity;
