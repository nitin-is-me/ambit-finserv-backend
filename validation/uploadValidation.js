const {Joi} = require('celebrate');

const uploadSchema = {
  upload_file_post: Joi.object().keys({
    base64String: Joi.string().required(),
    fileType: Joi.string().valid('image').required(),
  }),
};

module.exports = uploadSchema;
