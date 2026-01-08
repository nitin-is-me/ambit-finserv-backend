const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');
const {
  funAtWorkImageUpdateValidation,
} = require('../../validation/funAtWorkValidation');

const addSingleFunAtWork = async (req, res) => {
  try {
    await funAtWorkImageUpdateValidation.validateAsync(req.body);

    const {imageId} = req.params;

    const existingDocument = await FunAtWork.findById(imageId);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const existingImages = existingDocument.image;
    existingImages.push({
      url: req.body.image[0].url,
      description: req.body.image[0].description,
    });

    existingDocument.image = existingImages;

    const updatedDocument = await existingDocument.save();

    res.status(201).json({
      success: true,
      message: 'Single image added successfully',
      data: updatedDocument,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addSingleFunAtWork;
