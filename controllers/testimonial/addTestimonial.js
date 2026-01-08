const {customErrorMessages} = require('../../utils/helpers');
const {
  testimonialValidation,
} = require('../../validation/testimonialValidation');
const Testimonial = require('../../model/testimonialModel');

const addTestimonial = async (req, res) => {
  try {
    await testimonialValidation.validateAsync(req.body);

    const {title, stars, image, description, date} = req.body;

    const newTestimonial = await Testimonial.create({
      title,
      stars,
      image,
      description,
      date,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial added successfully',
      data: newTestimonial,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addTestimonial;
