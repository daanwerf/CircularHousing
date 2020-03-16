hurl clean
hurl new -n ./network.config.json
node ./packages/admin/registerIdManager.js Government
npm run cc:package -- participant
hurl install participant node -P ./chaincode-participant -o Government -o SocialHousing -o TableMaker -o WoodGatherer
