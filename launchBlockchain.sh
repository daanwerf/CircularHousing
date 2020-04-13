hurl clean
# Create an identities manager (currently only works for the first organisation
# specified in network.config.json)
hurl new -n ./network.config.json
# Copy the config file to the web folder so it can import the correct network nodes
cp network.config.json packages/web/src/config

# This installs a chaincodeAdmin user on the specified organisation. This chaincodeAdmin is the only
# user allowed to add participants. Note that currently this chaincodeAdmin can only be installed on the 
# first organization specified in network.config.json
node ./packages/admin/registerIdManager.js Government
# Package smart contract's code
npm run cc:package
# Install the chaincode to the blockchain (for debug mode, add --debug to the end of the command)
# to the organizations defined in network.config.json file
hurl install circularhousing node -P ./chaincode-circularhousing -o Government -o Manufacturer -o Transporter -o Retailer -o SocialHousingOrganization