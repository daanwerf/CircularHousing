hurl clean
hurl new -n ./network.config.json
node ./packages/admin/registerIdManager.js SocialHousing
npm run cc:package -- participant
hurl install participant node -P ./chaincode-participant -o SocialHousing -o TableMaker -o WoodGatherer
