const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');

const updateFullFunAtWork = async (req, res) => {
  try {
    const {_id, title, description} = req.body;

    const updateFullFunAtWorks = await FunAtWork.updateOne(
      {_id},
      {title, description},
    );

    res.status(201).json({
      success: true,
      message: 'Full card updated successfully',
      data: updateFullFunAtWorks,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateFullFunAtWork;
