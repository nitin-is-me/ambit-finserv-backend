const {customErrorMessages} = require('../../utils/helpers');
const NewsModel = require('../../model/newsModel');

const updateNews = async (req, res) => {
  try {
    const {title, news_type, _id, date, news_link} = req.body;

    const updatedNews = await NewsModel.updateOne(
      {_id},
      {title, news_type, news_link, date},
    );

    res.status(201).json({
      success: true,
      message: 'News updated successfully',
      data: updatedNews,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = updateNews;
