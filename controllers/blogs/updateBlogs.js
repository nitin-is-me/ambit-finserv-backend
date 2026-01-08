const {customErrorMessages} = require('../../utils/helpers');
const Blogs = require('../../model/blogsModel');

const updateBlogs = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;

    const updatedBlog = await Blogs.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateBlogs;
