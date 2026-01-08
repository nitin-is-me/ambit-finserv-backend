const mongoose = require('mongoose');
const {Schema} = mongoose;

const dashboardAmenitiesSchema = new Schema(
  {
    statistics: [
      {
        title: String,
        count: Number,
      },
    ],
    loans: [
      {
        type: {
          type: String,
          enum: ['Udyam Loan', 'Vyapar Loan', 'Parivahan Loan'],
        },
        title: String,
        icon: String,
        loan_description: String,
      },
    ],
    dashboard_description: String,
  },
  {
    timestamps: true,
  },
);

const DashboardAmenities = mongoose.model(
  'dashboard-ammenities',
  dashboardAmenitiesSchema,
);

module.exports = DashboardAmenities;
