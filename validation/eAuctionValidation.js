// eAuctionValidation
const Joi = require('joi');

const eAuctionAddValidation = Joi.object({
  city: Joi?.string(),
  name_of_customer: Joi?.string(),
  property_owner: Joi?.string(),
  property_address: Joi?.string(),
  reserved_price: Joi?.string(),
  emd_amount: Joi?.string(),
  last_date_of_emd: Joi?.string(),
  date_of_inspection: Joi?.string(),
  date_of_eauction: Joi?.string(),
  publication_paper_one: Joi?.string(),
  publication_paper_two: Joi?.string(),
  publication_paper_three: Joi?.string(),
});

const eAuctionEditValidation = Joi.object({
  city: Joi?.string(),
  name_of_customer: Joi?.string(),
  property_owner: Joi?.string(),
  property_address: Joi?.string(),
  reserved_price: Joi?.string(),
  emd_amount: Joi?.string(),
  last_date_of_emd: Joi?.string(),
  date_of_inspection: Joi?.string(),
  date_of_eauction: Joi?.string(),
  publication_paper_one: Joi?.string(),
  publication_paper_two: Joi?.string(),
  publication_paper_three: Joi?.string(),
});

module.exports = {
  eAuctionAddValidation,
  eAuctionEditValidation,
};
