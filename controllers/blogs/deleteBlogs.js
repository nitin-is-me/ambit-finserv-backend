const {customErrorMessages} = require('../../utils/helpers');
const Blogs = require('../../model/blogsModel');

const deleteBlogs = async (req, res) => {
  try {
    const {id} = req.params;
    const blog = await Blogs.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: blog,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 500;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = deleteBlogs;
