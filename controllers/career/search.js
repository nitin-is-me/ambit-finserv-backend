const Career = require('../../model/careerModel');
const {customErrorMessages} = require('../../utils/helpers');

const searchCareer = async (req, res) => {
  try {
    const {search = '', state = '', department = ''} = req.query;

    let query = {
      // $or: [
      //   // {location: {$regex: search, $options: 'i'}},
      //   // {state: {$regex: state, $options: 'i'}},
      //   // {position: {$regex: search, $options: 'i'}},
      //   // {product: {$regex: search, $options: 'i'}},
      //   // {department: {$regex: department, $options: 'i'}},
      //   // {education: {$regex: search, $options: 'i'}},
      //   {state: {$regex: search, $options: 'i'}},
      //   // {department: {$regex: search, $options: 'i'}},
      // ],
    };

    if (state) {
      query = {...query, state: state};
    }
    if (department) {
      query = {...query, department: department};
    }
    if (search) {
      query = {
        $or: [
          {location: {$regex: search, $options: 'i'}},
          {state: {$regex: search, $options: 'i'}},
          {position: {$regex: search, $options: 'i'}},
          {product: {$regex: search, $options: 'i'}},
          {department: {$regex: search, $options: 'i'}},
          {education: {$regex: search, $options: 'i'}},
        ],
      };
    }

    // Object.keys(query).forEach(key => {

    //   if (query[key] === '') {
    //     delete query[key];
    //   }
    // });

    const careers = await Career.find(query);
    res.status(200).json({success: true, data: careers});
  } catch (error) {
    const message = customErrorMessages(error);
    const status = error.isJoi ? 422 : 400;
    res.status(status).json({success: false, message: message});
  }
};

module.exports = searchCareer;
