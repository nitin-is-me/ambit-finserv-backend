const {customErrorMessages} = require('../../utils/helpers');
const Testimonial = require('../../model/testimonialModel');

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();

    res.status(200).json({
      success: true,
      message: 'All testimonials',
      data: testimonials,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getAllTestimonials;
