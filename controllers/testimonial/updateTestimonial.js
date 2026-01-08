const {customErrorMessages} = require('../../utils/helpers');
const Testimonial = require('../../model/testimonialModel');

const updateTestimonial = async (req, res) => {
  try {
    const {title, stars, image, date, description, _id} = req.body;

    const updatedTestimonial = await Testimonial.updateOne(
      {_id},
      {title, stars, image, date, description},
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateTestimonial;
