const express = require('express');
const router = express.Router();
const userRoute = require('./userRoute');
const uploadRoute = require('./uploadRoute');
const testimonialRoute = require('./testimonialRoute');
const leadershipRoute = require('./leadershipRoute');
const journeyRoute = require('./journeyRoute');
const ourValuesRoute = require('./ourValuesRoute');
const disclosureRoute = require('./disclosureRoute');
const policiesRoute = require('./policiesRoute');
const eAuctionRoute = require('./eAuctionRoute');
const loanTypeRoute = require('./loanTypeRoute');
const awardsRoute = require('./awardsRoute');
const blogsRoute = require('./blogsRoute');
const faqRoute = require('./faqRoute');
const listingComplieancesRoute = require('./listinCompliancesRoute');
const annualReportsRoute = require('./annualReportsRoute');
const dashbboardAmmenitiesRoute = require('./dashboardAmmenitiesRoute');
const newsRoute = require('./newsRoute');
const mediaContactRoute = require('./mediaContactsRoute');
const careerRoute = require('./careerRoute');
const loanRoute = require('./loansRoute');
const addressRoute = require('./addressRoute');
const partnershipsRoute = require('./partnershipsRoute');
const funAtWorkRoute = require('./funAtWorkRoute');
const perksRoute = require('./perksRoute');
const branchAddressRoute = require('./branchAddressRoute');
const loanApplications = require('./loanApplicationRoute');
const AffiliateMarketing = require('./affiliateMarketingRoute');
const jobResume = require('./jobResumeRoute');
const loanDetails = require('./loanDetailsRoute');
const nachMandate = require('./nachMandateRoute');
const subscriptions = require('./newsletterSubscriptionRoute');
const eCards = require('./eCardsRoute');
const readNachMandate = require('./readNachMandate');
const testRoute = require('./testRoute');
const qrCodeRoutes = require('./qrCodeRoutes');
const agreements = require('./connectorAgreementRoute');
const wrapperRoute = require('./wrapperRoute');
const topupLoanRoute = require('./topupLoanRoute');
const cibilScoreRoute = require('./cibileScoreRoute');
const qrFormRoute = require('./qrFormRoute');
const eligibilityCalculatorRoute = require('./eligibilityCalculatorRoute');
const cibilLogsRoute = require('./cibilLogsRoute');
const teleCallerRoute = require('./teleCallerRoute');
const otpRoute = require('./otpRoute');
// const ping = require('../controllers/wrapper/ping');
// Routes
const moduleRoutes = [
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/testimonial',
    route: testimonialRoute,
  },
  {
    path: '/leadership',
    route: leadershipRoute,
  },
  {
    path: '/ourValues',
    route: ourValuesRoute,
  },
  {
    path: '/journey',
    route: journeyRoute,
  },
  {
    path: '/disclosure',
    route: disclosureRoute,
  },
  {
    path: '/policies',
    route: policiesRoute,
  },
  {
    path: '/eAuction',
    route: eAuctionRoute,
  },
  {
    path: '/loanType',
    route: loanTypeRoute,
  },
  {
    path: '/awards',
    route: awardsRoute,
  },
  {
    path: '/blogs',
    route: blogsRoute,
  },
  {
    path: '/faq',
    route: faqRoute,
  },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/partnerships',
    route: partnershipsRoute,
  },
  {
    path: '/compliances',
    route: listingComplieancesRoute,
  },
  {
    path: '/annual-report',
    route: annualReportsRoute,
  },
  {
    path: '/dashboard-ammenities',
    route: dashbboardAmmenitiesRoute,
  },
  {
    path: '/news',
    route: newsRoute,
  },
  {
    path: '/media-contacts',
    route: mediaContactRoute,
  },
  {
    path: '/career',
    route: careerRoute,
  },
  {
    path: '/loan',
    route: loanRoute,
  },
  {
    path: '/funAtWork',
    route: funAtWorkRoute,
  },
  {
    path: '/perks',
    route: perksRoute,
  },
  {
    path: '/branchAddress',
    route: branchAddressRoute,
  },
  {
    path: '/resume',
    route: jobResume,
  },
  {
    path: '/loanApplications',
    route: loanApplications,
  },
  {
    path: '/affiliateMarketing',
    route: AffiliateMarketing,
  },
  {
    path: '/loandetails',
    route: loanDetails,
  },
  {
    path: '/nachMandate',
    route: nachMandate,
  },
  {
    path: '/subscriptions',
    route: subscriptions,
  },
  {
    path: '/e-cards',
    route: eCards,
  },
  {
    path: '/readNachMandate',
    route: readNachMandate,
  },
  {
    path: '/email',
    route: testRoute,
  },
  {
    path: '/qrCodes',
    route: qrCodeRoutes,
  },
  {
    path: '/agreement',
    route: agreements,
  },
  {
    path: '/topupLoan',
    route: topupLoanRoute,
  },
  {
    path: '/cibil-score',
    route: cibilScoreRoute,
  },
  {
    path: '/cibil-logs',
    route: cibilLogsRoute,
  },
  {
    path: '/qrForm',
    route: qrFormRoute,
  },
  {
    path: '/cibil-wrapper',
    // route: (req,res)=>{
    //   console.log(req.path,"sadas")
    //   res.send("Cibil Wrapper")
    // }
    route: wrapperRoute,
  },
  {
    path: '/eligibility-calculator',
    route: eligibilityCalculatorRoute,
  },
  {
    path: '/tele-caller',
    route: teleCallerRoute,
  },
  {
    path: '/otp',
    route: otpRoute,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

module.exports = router;
