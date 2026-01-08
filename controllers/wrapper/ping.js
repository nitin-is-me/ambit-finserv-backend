const axios = require('axios');
const {createCibilP12HttpsAgent} = require('../../utils/cibilSSLConfig');
require('dotenv').config();

const ping = async (req, res) => {
  try {
    const agent = createCibilP12HttpsAgent('AmbitFinvest@12345');

    const url = 'https://api.transunioncibil.com/consumer/dtc/v4/ping';

    const headers = {
      apikey: process.env.CIBIL_API_KEY,
      'member-ref-id': process.env.CIBIL_MEMBER_REF_ID,
      'client-secret': process.env.CIBIL_CLIENT_SECRET,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      PingRequest: {
        SiteName: 'AmbitFinvest',
        AccountName: 'GCVD_AmbitFinvest',
        AccountCode: 'QW1iaXRGQDAyMDQyMDI1',
        ClientKey: process.env.CIBIL_CLIENT_KEY || 'PROD_CLIENT_KEY',
        RequestKey: process.env.CIBIL_REQUEST_KEY || 'PROD_REQUEST_KEY',
      },
    };

    axios
      .post(url, data, {headers, httpsAgent: agent})
      .then(response => {
        res.status(200).json({
          success: true,
          message: 'Ping successful',
          data: response.data,
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Ping failed',
          error: error.response ? error.response.data : error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'SSL configuration error',
      error: error.message,
    });
  }
};

module.exports = ping;
