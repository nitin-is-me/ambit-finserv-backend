const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Creates HTTPS agent for CIBIL API calls with production SSL certificates
 * @returns {https.Agent} Configured HTTPS agent
 */
const createCibilHttpsAgent = () => {
  try {
    // Production SSL certificate paths
    const sslCertPath = path.join(
      __dirname,
      '../certificates/www.finvest.ambit.co.crt',
    );
    const privateKeyPath = path.join(
      __dirname,
      '../certificates/www.finvest.ambit.co.key.unencrypted',
    );
    const chainCertPath = path.join(
      __dirname,
      '../certificates/L7-ProductionChain.crt',
    );

    // Check if certificates exist
    if (!fs.existsSync(sslCertPath)) {
      throw new Error(`SSL Certificate not found at: ${sslCertPath}`);
    }
    if (!fs.existsSync(privateKeyPath)) {
      throw new Error(`Private Key not found at: ${privateKeyPath}`);
    }
    if (!fs.existsSync(chainCertPath)) {
      throw new Error(`Chain Certificate not found at: ${chainCertPath}`);
    }

    // Create HTTPS agent with production certificates
    const agent = new https.Agent({
      cert: fs.readFileSync(sslCertPath),
      key: fs.readFileSync(privateKeyPath),
      // No passphrase needed for unencrypted key
      ca: fs.readFileSync(chainCertPath),
      rejectUnauthorized: true, // Enable SSL validation for production
    });

    return agent;
  } catch (error) {
    // Log error details for debugging
    error.message = `CIBIL HTTPS agent creation failed: ${error.message}`;
    throw error;
  }
};

/**
 * Creates HTTPS agent using P12 certificate (alternative method)
 * @param {string} p12Password - Password for P12 certificate
 * @returns {https.Agent} Configured HTTPS agent
 */
const createCibilP12HttpsAgent = (p12Password = 'AmbitFinvest@12345') => {
  try {
    const p12Path = path.join(__dirname, '../certificates/certificate.p12');

    if (!fs.existsSync(p12Path)) {
      throw new Error(`P12 Certificate not found at: ${p12Path}`);
    }

    const agent = new https.Agent({
      pfx: fs.readFileSync(p12Path),
      passphrase: p12Password,
      rejectUnauthorized: true, // Enable SSL validation for production
    });

    return agent;
  } catch (error) {
    // Log error details for debugging
    error.message = `CIBIL P12 HTTPS agent creation failed: ${error.message}`;
    throw error;
  }
};

module.exports = {
  createCibilHttpsAgent,
  createCibilP12HttpsAgent,
};
