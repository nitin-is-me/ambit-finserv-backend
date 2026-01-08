const mongoose = require('mongoose');
const {Schema} = mongoose;

const eAuctionSchema = new Schema(
  {
    city: String,
    name_of_customer: String,
    property_owner: String,
    property_address: String,
    reserved_price: String,
    emd_amount: String,
    last_date_of_emd: String,
    date_of_inspection: String,
    date_of_eauction: String,
    publication_paper_one: String,
    publication_paper_two: String,
    publication_paper_three: String,
  },
  {
    timestamps: true,
  },
);

const EAuction = mongoose.model('eAuction', eAuctionSchema);

module.exports = EAuction;
