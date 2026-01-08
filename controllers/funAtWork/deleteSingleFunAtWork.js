const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');

const deleteSingleImage = async (req, res) => {
  try {
    const {imageId} = req.params;

    if (!imageId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const funAtWork = await FunAtWork.findOne({'image._id': imageId});

    if (!funAtWork) {
      return res.status(404).json({
        success: false,
        message: 'FunAtWork entry or Image not found',
      });
    }

    const updatedFunAtWork = await FunAtWork.findByIdAndUpdate(
      funAtWork._id,
      {$pull: {image: {_id: imageId}}},
      {new: true},
    );

    res.status(200).json({
      success: true,
      message: 'Single Image deleted successfully',
      data: updatedFunAtWork,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteSingleImage;
