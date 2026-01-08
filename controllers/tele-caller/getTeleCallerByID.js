const TeleCaller = require('../../model/teleCallerModel');

const getTeleCallerByID = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Tele-caller ID is required',
      });
    }

    const teleCaller = await TeleCaller.findById(id);

    if (!teleCaller) {
      return res.status(404).json({
        success: false,
        message: 'Tele-caller entry not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tele-caller entry retrieved successfully',
      data: teleCaller,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid tele-caller ID format',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tele-caller entry',
      error: error.message,
    });
  }
};

module.exports = getTeleCallerByID;
