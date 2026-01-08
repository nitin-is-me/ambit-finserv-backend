const axios = require('axios');
const {createCibilP12HttpsAgent} = require('../../utils/cibilSSLConfig');
require('dotenv').config();

const verifyAuthenticationAnswers = async (req, res) => {
  const {
    clientKey,
    questionKey,
    answerKey,
    userInputAnswer,
    challengeConfigGUID,
    IVAnswer,
  } = req.body;

  try {
    const agent = createCibilP12HttpsAgent('AmbitFinvest@12345');
    const url =
      'https://api.transunioncibil.com/consumer/dtc/v4/VerifyAuthenticationAnswers';
    const headers = {
      apikey: process.env.CIBIL_API_KEY,
      'member-ref-id': process.env.CIBIL_MEMBER_REF_ID,
      'client-secret': process.env.CIBIL_CLIENT_SECRET,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const data = {
      VerifyAuthenticationAnswersRequest: {
        SiteName: 'AmbitFinvest',
        AccountName: 'GCVD_AmbitFinvest',
        AccountCode: 'QW1iaXRGQDAyMDQyMDI1',
        ClientKey: clientKey,
        RequestKey: clientKey,
        PartnerCustomerId: clientKey,
        IVAnswer: Array.isArray(IVAnswer)
          ? IVAnswer
          : {
              questionKey: questionKey,
              answerKey: answerKey,
              UserInputAnswer: userInputAnswer,
            },
        ChallengeConfigGUID: challengeConfigGUID,
      },
    };

    axios
      .post(url, data, {headers, httpsAgent: agent})
      .then(response => {
        res.status(200).json({
          success: true,
          message: 'Verify Authentication Answers successful',
          data: response.data,
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          message: 'Verify Authentication Answers failed',
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

module.exports = verifyAuthenticationAnswers;
