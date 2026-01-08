const TeleCaller = require('../../model/teleCallerModel');

const deleteTeleCaller = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Tele-caller ID is required',
      });
    }

    // Check if tele-caller entry exists
    const existingTeleCaller = await TeleCaller.findById(id);
    if (!existingTeleCaller) {
      return res.status(404).json({
        success: false,
        message: 'Tele-caller entry not found',
      });
    }

    // Delete tele-caller entry
    await TeleCaller.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Tele-caller entry deleted successfully',
      data: existingTeleCaller,
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
      message: 'Failed to delete tele-caller entry',
      error: error.message,
    });
  }
};

module.exports = deleteTeleCaller;
