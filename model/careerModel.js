const mongoose = require('mongoose');
const {Schema} = mongoose;

const careerSchema = new Schema(
  {
    location: String,
    state: String,
    position: String,
    product: String,
    department: String,
    experience_required: String,
    education: String,
    jd: String,
    skill_set_required: String,
  },
  {
    timestamps: true,
  },
);

const Career = mongoose.model('career', careerSchema);

module.exports = Career;
