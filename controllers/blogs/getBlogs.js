const {customErrorMessages} = require('../../utils/helpers');
const Blogs = require('../../model/blogsModel');

const getBlogs = async (req, res) => {
  try {
    // Implementing Pagination to control resource consumption
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9; // Default to 9 as per frontend preference
    const skip = (page - 1) * limit;

    const total = await Blogs.countDocuments();
    const blog = await Blogs.find()
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: 'Blogs fetched successfully',
      data: blog,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = customErrorMessages(error);
    res.status(500).json({success: false, message: message});
  }
};

module.exports = getBlogs;
