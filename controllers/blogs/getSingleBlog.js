const {customErrorMessages} = require('../../utils/helpers');
const Blogs = require('../../model/blogsModel');

const getSingleBlog = async (req, res) => {
  try {
    const {id} = req.params;
    const blog = await Blogs.findById(id);
    res.status(200).json({
      success: true,
      message: 'Single blogs fetched successfully',
      data: blog,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getSingleBlog;
