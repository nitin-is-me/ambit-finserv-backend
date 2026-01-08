const NewsModel = require('../../model/newsModel');
const {customErrorMessages} = require('../../utils/helpers');

const getNews = async (req, res) => {
  try {
    const news = await NewsModel.find({});
    res.status(200).json({
      success: true,
      message: 'News fetched successfully',
      data: news,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = getNews;
