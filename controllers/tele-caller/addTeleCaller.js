const TeleCaller = require('../../model/teleCallerModel');
const {
  teleCallerAddValidation,
} = require('../../validation/teleCallerValidation');

const addTeleCaller = async (req, res) => {
  try {
    // Validate request data
    const {error} = teleCallerAddValidation.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const {mobile_number, disposition, date, time, type} = req.body;

    // Create tele-caller entry
    const teleCallerData = new TeleCaller({
      mobile_number,
      disposition,
      date,
      time,
      type: type || 'call',
    });

    const savedTeleCaller = await teleCallerData.save();

    return res.status(201).json({
      success: true,
      message: 'Tele-caller entry added successfully',
      data: savedTeleCaller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add tele-caller entry',
      error: error.message,
    });
  }
};

module.exports = addTeleCaller;
