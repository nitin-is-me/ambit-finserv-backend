const Joi = require('joi');

const NewsAddValidation = Joi.object({
  title: Joi.string().required(),
  date: Joi.string().required(),
  news_link: Joi.string().required(),
  news_type: Joi.string().valid('press-release', 'news'),
});

const NewsUpdateValidation = Joi.object({
  title: Joi.string(),
  date: Joi.string(),
  news_link: Joi.string(),
  news_type: Joi.string().valid('press-release', 'news'),
});

module.exports = {NewsAddValidation, NewsUpdateValidation};
