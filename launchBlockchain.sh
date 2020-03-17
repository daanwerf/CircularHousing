hurl clean
# Create an identities manager (currently only works for the first organisation
# specified in network.config.json)
hurl new -n ./network.config.json
node ./packages/admin/registerIdManager.js Government
# Package smart contract's code
npm run cc:package
# Install the chaincode to the blockchain (for debug mode, add --debug to the end of the command)
# to the organizations defined in network.config.json file
hurl install circularhousing node -P ./chaincode-circularhousing -o Government -o SocialHousing -o TableMaker -o WoodGatherer