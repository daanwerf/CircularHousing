/*
 * Register and Enroll a user
 */

// Get the organisation to register an admin for
const org = process.argv[2]
const user = process.argv[3];

const fs = require('fs');
const os = require('os');
const path = require('path');
const x509 = require('x509');

cert = JSON.parse(fs.readFileSync(path.resolve(os.homedir(), 
    'hyperledger-fabric-network/.hfc-' + org + '/' + user), 'utf8'))
    .enrollment.identity.certificate;
var parsed = x509.parseCert(cert);
console.log(parsed.fingerPrint);