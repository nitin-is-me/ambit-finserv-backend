const {customErrorMessages} = require('../../utils/helpers');
const CareerModel = require('../../model/careerModel');

const updateCareer = async (req, res) => {
  try {
    const {
      _id,
      location,
      state,
      position,
      product,
      department,
      education,
      experience_required,
      jd,
      skill_set_required,
    } = req.body;

    const updatedCareer = await CareerModel.updateOne(
      {_id},
      {
        location,
        state,
        position,
        product,
        department,
        education,
        experience_required,
        jd,
        skill_set_required,
      },
    );

    res.status(201).json({
      success: true,
      message: 'Career updated successfully',
      data: updatedCareer,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateCareer;
