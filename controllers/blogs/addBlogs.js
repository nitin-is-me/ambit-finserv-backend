const {customErrorMessages} = require('../../utils/helpers');
const Blogs = require('../../model/blogsModel');
const {blogAddValidation} = require('../../validation/blogValidation');

const addBlogs = async (req, res) => {
  try {
    await blogAddValidation.validateAsync(req.body);
    const blog = await Blogs.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog added successfully',
      data: blog,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addBlogs;
