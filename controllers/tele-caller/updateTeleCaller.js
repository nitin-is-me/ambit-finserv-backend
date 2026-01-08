const TeleCaller = require('../../model/teleCallerModel');
const {
  teleCallerUpdateValidation,
} = require('../../validation/teleCallerValidation');

const updateTeleCaller = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Tele-caller ID is required',
      });
    }

    // Validate request data
    const {error} = teleCallerUpdateValidation.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message,
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

    // Extract only the fields that are provided in the request
    const updateData = {};

    if (req.body.mobile_number !== undefined) {
      updateData.mobile_number = req.body.mobile_number;
    }
    if (req.body.disposition !== undefined) {
      updateData.disposition = req.body.disposition;
    }
    if (req.body.date !== undefined) {
      updateData.date = req.body.date;
    }
    if (req.body.time !== undefined) {
      updateData.time = req.body.time;
    }
    if (req.body.type !== undefined) {
      updateData.type = req.body.type;
    }

    // Update tele-caller entry
    const updatedTeleCaller = await TeleCaller.findByIdAndUpdate(
      id,
      updateData,
      {new: true, runValidators: true},
    );

    return res.status(200).json({
      success: true,
      message: 'Tele-caller entry updated successfully',
      data: updatedTeleCaller,
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
      message: 'Failed to update tele-caller entry',
      error: error.message,
    });
  }
};

module.exports = updateTeleCaller;
