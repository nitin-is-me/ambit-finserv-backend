const {customErrorMessages} = require('../../utils/helpers');
const FunAtWork = require('../../model/funAtWorkModel');

const getSingleFunAtWork = async (req, res) => {
  try {
    const {id} = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
    }

    const funAtWork = await FunAtWork.findById(id);

    if (!funAtWork) {
      return res.status(404).json({
        success: false,
        message: 'FunAtWork entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FunAtWork entry fetched successfully',
      data: funAtWork,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getSingleFunAtWork;
