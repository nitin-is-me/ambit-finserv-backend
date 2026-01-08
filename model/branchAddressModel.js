const mongoose = require('mongoose');
const {Schema} = mongoose;

const branchAddressSchema = new Schema(
  {
    branch_location: String,
    state: String,
    branch_address: String,
  },
  {
    timestamps: true,
  },
);

const BranchAddressSchema = mongoose.model(
  'branchAddress',
  branchAddressSchema,
);

module.exports = BranchAddressSchema;
