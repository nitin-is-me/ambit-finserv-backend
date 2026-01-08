const mongoose = require('mongoose');
const {Schema} = mongoose;

const jobSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    mobile_number: String,
    current_location: String,
    state: String,
    preferred_location: String,
    resume: String,
    department: String,
    product: String,
    branch: String,
    type_of_resume: String,
    position: String,
  },
  {
    timestamps: true,
  },
);

const JobResume = mongoose.model('job_resume', jobSchema);

module.exports = JobResume;
