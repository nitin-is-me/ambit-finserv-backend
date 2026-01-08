const axios = require('axios');
const {createCibilP12HttpsAgent} = require('../../utils/cibilSSLConfig');
require('dotenv').config();

const fulFiller = async (req, res) => {
  const {
    clientKey,
    first_name,
    last_name,
    IdentifierName,
    IdentifierId,
    dob,
    mobile_number,
    email,
    gender,
  } = req.body;

  try {
    const agent = createCibilP12HttpsAgent('AmbitFinvest@12345');
    const url = 'https://api.transunioncibil.com/consumer/dtc/v4/fulfilloffer';
    const headers = {
      apikey: process.env.CIBIL_API_KEY,
      'member-ref-id': process.env.CIBIL_MEMBER_REF_ID,
      'client-secret': process.env.CIBIL_CLIENT_SECRET,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      FulfillOfferRequest: {
        ProductConfigurationId: 'AMBIT01',
        SiteName: 'AmbitFinvest',
        AccountName: 'GCVD_AmbitFinvest',
        AccountCode: 'QW1iaXRGQDAyMDQyMDI1',
        ClientKey: clientKey,
        RequestKey: clientKey,
        PartnerCustomerId: clientKey,
        CustomerInfo: {
          Name: {
            Forename: first_name,
            Surname: last_name,
          },
          IdentificationNumber: {
            IdentifierName,
            Id: IdentifierId,
          },

          Address: {
            StreetAddress: 'TRANSUNION CIBIL, 19th floor',
            City: 'Mumbai',
            PostalCode: 400013,
            Region: 27,
            AddressType: 1,
          },
          DateOfBirth: dob,
          PhoneNumber: {
            Number: mobile_number,
          },
          Email: email,
          Gender: gender,
        },
        LegalCopyStatus: 'Accept',
        UserConsentForDataSharing: true,
      },
    };

    axios
      .post(url, data, {headers, httpsAgent: agent})
      .then(response => {
        res.status(200).json({
          success: true,
          message: 'Fulfill Offer successful',
          data: response.data,
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Fulfill Offer failed',
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

module.exports = fulFiller;
