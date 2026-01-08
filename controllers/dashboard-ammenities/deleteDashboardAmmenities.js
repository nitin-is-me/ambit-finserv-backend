const {customErrorMessages} = require('../../utils/helpers');
const DashboardAmenities = require('../../model/dashboardAmmenities');

const deleteDashboardAmmenity = async (req, res) => {
  try {
    const {id} = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const dashboardAmmenities = await DashboardAmenities.findByIdAndDelete(id);

    if (!dashboardAmmenities) {
      return res.status(404).json({
        success: false,
        message: 'dashboard ammenity not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'dashboard ammenity deleted successfully',
      data: dashboardAmmenities,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteDashboardAmmenity;
