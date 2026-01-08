const liveData = require('./live_data.json');
const inquiries =
  liveData.data.GetCustomerAssetsResponse.GetCustomerAssetsSuccess.Asset
    .TrueLinkCreditReport.Borrower.InquiryPartition;

// Report date: 2025-11-13
const reportDate = new Date('2025-11-13');
const oneMonthAgo = new Date(reportDate);
oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
const threeMonthsAgo = new Date(reportDate);
threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
const sixMonthsAgo = new Date(reportDate);
sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

console.log('Report Date:', reportDate.toISOString().split('T')[0]);
console.log('1 Month Ago:', oneMonthAgo.toISOString().split('T')[0]);
console.log('3 Months Ago:', threeMonthsAgo.toISOString().split('T')[0]);
console.log('6 Months Ago:', sixMonthsAgo.toISOString().split('T')[0]);
console.log('');

let count1M = 0,
  count3M = 0,
  count6M = 0;

inquiries.forEach((inq, idx) => {
  const date = inq.Inquiry.inquiryDate.split('+')[0];
  const inquiryDate = new Date(date);
  const inLast1 = inquiryDate >= oneMonthAgo;
  const inLast3 = inquiryDate >= threeMonthsAgo;
  const inLast6 = inquiryDate >= sixMonthsAgo;

  if (inLast1) count1M++;
  if (inLast3) count3M++;
  if (inLast6) count6M++;

  console.log(
    `${idx + 1}. ${inq.Inquiry.subscriberName}: ${date} - 1m:${inLast1} 3m:${inLast3} 6m:${inLast6}`,
  );
});

console.log('');
console.log('Summary:');
console.log(`1 Month: ${count1M}`);
console.log(`3 Months: ${count3M}`);
console.log(`6 Months: ${count6M}`);
