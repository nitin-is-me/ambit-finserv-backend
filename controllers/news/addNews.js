const NewsModel = require('../../model/newsModel');
const {customErrorMessages} = require('../../utils/helpers');
const {NewsAddValidation} = require('../../validation/newsValidation');

const addNews = async (req, res) => {
  try {
    await NewsAddValidation.validateAsync(req.body);
    const newNews = await NewsModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'News added successfully',
      data: newNews,
    });
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = addNews;
