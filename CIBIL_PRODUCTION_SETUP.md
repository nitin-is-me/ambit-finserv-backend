# CIBIL Production Setup Guide

## Required Environment Variables

Add the following environment variables to your production `.env` file:

```bash
# CIBIL Production API Credentials (Get these from CIBIL Marketplace)
CIBIL_API_KEY=your_production_api_key_here
CIBIL_MEMBER_REF_ID=your_production_member_ref_id_here
CIBIL_CLIENT_SECRET=your_production_client_secret_here

# CIBIL Request Keys (Generate unique keys for each request)
CIBIL_CLIENT_KEY=your_client_key_here
CIBIL_REQUEST_KEY=your_request_key_here
```

## SSL Certificate Setup

1. **Rename the provided certificates:**

   - `www.finvest.ambit.co.crt.txt` → `www.finvest.ambit.co.crt`
   - `L7-ProductionChain.crt.txt` → `L7-ProductionChain.crt`

2. **Create certificates directory:**

   ```bash
   mkdir -p certificates
   ```

3. **Place certificates in the certificates directory:**
   ```
   certificates/
   ├── www.finvest.ambit.co.crt
   ├── L7-ProductionChain.crt
   ├── private.key (your private key from CSR)
   └── certificate.p12 (optional, for P12 method)
   ```

## Production Account Details

- **Site Name**: AmbitFinvest
- **Account Name**: GCVD_AmbitFinvest
- **Account Code**: QW1iaXRGQDAyMDQyMDI1
- **Account Offer Code**: AMBIT01

## Whitelisted IP

Only the following IP is authorized to make CIBIL API calls:

- `3.108.103.172`

## API Endpoints

All endpoints have been updated to use production URLs:

- Ping: `https://api.transunioncibil.com/consumer/dtc/v4/ping`
- Fulfill Offer: `https://api.transunioncibil.com/consumer/dtc/v4/fulfilloffer`
- Get Auth Questions: `https://api.transunioncibil.com/consumer/dtc/v4/GetAuthenticationQuestions`
- Verify Auth Answers: `https://api.transunioncibil.com/consumer/dtc/v4/VerifyAuthenticationAnswers`
- Get Customer Assets: `https://api.transunioncibil.com/consumer/dtc/v4/GetCustomerAssets`
- Get Product Web Token: `https://api.transunioncibil.com/consumer/dtc/v4/GetProductWebToken`

## Testing

1. **Test SSL Certificate:**

   ```bash
   curl -X POST 'https://api.transunioncibil.com/consumer/dtc/v4/ping' \
     --cert certificates/www.finvest.ambit.co.crt \
     --key certificates/private.key \
     --cacert certificates/L7-ProductionChain.crt \
     -H "apikey: YOUR_API_KEY" \
     -H "member-ref-id: YOUR_MEMBER_REF_ID" \
     -H "client-secret: YOUR_CLIENT_SECRET" \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{
       "PingRequest": {
         "SiteName": "AmbitFinvest",
         "AccountName": "GCVD_AmbitFinvest",
         "AccountCode": "QW1iaXRGQDAyMDQyMDI1",
         "ClientKey": "YOUR_CLIENT_KEY",
         "RequestKey": "YOUR_REQUEST_KEY"
       }
     }'
   ```

2. **Test API endpoints:**
   - GET `/api/wrapper/ping` - Test connectivity
   - POST `/api/wrapper/getCustomerAssets` - Get customer assets
   - POST `/api/wrapper/getAuthenticationQuestions` - Get auth questions
   - POST `/api/wrapper/verifyAuthenticationAnswers` - Verify answers
   - POST `/api/wrapper/fulFillOffer` - Fulfill offer
   - POST `/api/wrapper/getProductWebToken` - Get web token

## Security Notes

- All CIBIL API routes are protected by IP whitelist middleware
- SSL certificates are validated (rejectUnauthorized: true)
- Environment variables should be kept secure and not committed to version control
- Use strong, unique keys for ClientKey and RequestKey

## Troubleshooting

1. **SSL Certificate Errors:**

   - Ensure certificates are in the correct format (.crt, not .txt)
   - Verify certificate paths in `utils/cibilSSLConfig.js`
   - Check certificate permissions

2. **IP Whitelist Errors:**

   - Ensure your server IP is whitelisted (3.108.103.172)
   - Check IP detection in middleware

3. **API Authentication Errors:**
   - Verify all environment variables are set correctly
   - Check API credentials in CIBIL marketplace
   - Ensure AccountCode matches production value
