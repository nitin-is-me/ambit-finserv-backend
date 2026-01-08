const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');

const updateFunAtWork = async (req, res) => {
  try {
    const {_id, image} = req.body;

    const updateFunAtWorks = await FunAtWork.updateOne({_id}, {image});

    res.status(201).json({
      success: true,
      message: 'single image updated successfully',
      data: updateFunAtWorks,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateFunAtWork;
