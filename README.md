# Circular Housing Blockchain

## Setup
To run this project, you first need to setup Convector and Hurley. See <a href="https://docs.covalentx.com/article/71-getting-started" target="_blank">their docs</a> for instructions on how to do this (note there are separate instructions for Ubuntu 18.04 users). Make sure to install Hurley globally. 

## Run the project
Once Convector/Hurley/Fabric are all setup, run the following commands to get the project running:
```
# Clone the repo and go into the root folder
git clone https://github.com/daanwerf/CircularHousing.git
cd CircularHousing
# Install all node dependencies
npm i
# Create a new development blockchain network as specified in network.config.json
hurl new -n ./network.config.json
# Create an identities manager (currently only works for the first organisation 
# specified in network.config.json)
node ./packages/admin/registerIdManager.js Government

# Package smart contract's code
npm run cc:package -- participant
# Install the chaincode to the blockchain (for debug mode, add --debug to the end of the command)
# to the organizations defined in network.config.json file
hurl install participant node -P ./chaincode-participant -o Government -o SocialHousing -o TableMaker -o WoodGatherer

# Register a participant for SocialHousing organization with id SultanPart 
# and name "Participant Sultan", invoking as user Sultan
hurl invoke participant participant_register SultanPart "Participant Sultan" -o SocialHousing -u Sultan
# Get the information of the participant you just added
hurl invoke participant participant_get SultanPart -o SocialHousing -u Sultan
# Try to register another participant for user Sultan, this is not possible since a participant 
# with this certificate is already registered
hurl invoke participant participant_register SultanPart2 "Participant Sultan 2" -o SocialHousing -u Sultan

# Try to update the fingerprint (i.e. X509 certificate) of participant Sultan. This should give 
# an error since it is invoked with user Sultan, who is not authorized to change certficates
hurl invoke participant participant_changeIdentity SultanPart RandomID -o SocialHousing -u Sultan
# Update the fingerprint with chaincodeAdmin (created earlier) who is authorized to do this, 
# so this should work.
hurl invoke participant participant_changeIdentity SultanPart RandomID -o SocialHousing -u chaincodeAdmin
# Inspect the participant again and notice the changed fingerprint
hurl invoke participant participant_get SultanPart -o SocialHousing -u Sultan

# TODO: SHOW USECASE WITH ITEMS 
# (BECAUSE NOW SultanPart has wrong fingerprint so not allowed to do anything with items) 
# and then change back to correct identity to see how it then works again
```

## Install or upgrade chaincode
To install and/or upgrade chaincode, the following commands from the root of the project can be run (see <a href="https://www.npmjs.com/package/@worldsibu/hurley" target="_blank">Hurley docs</a> for full specification):
```
# Regardless of installation or upgrading, first chaincode needs to be packaged
npm run cc:package -- <mychaincode>

# Install <mychaincode> to blockchain (replace <mychaincode> with the name of the chaincode 
# you want to install and <org1> with the organisation to which you want to install the chaincode. 
# It is possible to install to multiple organisations at once.
hurl install <mychaincode> node -P ./chaincode-<mychaincode> -o <org1>

# Upgrade existing chaincode (replace <versionno> by a version number of your choice)
hurl upgrade <mychaincode> node <versionno> -P ./chaincode-<mychaincode> -o <org1>
```

## Clear network
To remove all network nodes:
```
hurl clean
```

## Network setup
Every user in the network (users are predefined in the `network.config.json` file) can register itself in the network (by invoking participant_register). Once a user registers itself on the blockchain as a participant, it can perform actions on the blockchain (like creating a new item). A participant has a number of fields, one of which is its identity, consisting of a fingerprint and a boolean value status. The fingerprint is the X509 certificate of the user and `status` indicates whether the certificate is still valid. 

When a participant tries to perform actions on the blockchain, like updating an item, the logic in the chaincode checks to see if the X509 certificate of the user invoking that action, is the same as the X509 certficiate of the participant that owns the item. If this is the case, the user is allowed to update the item, otherwise it is not. This is why the Participant model is useful, because it allows to implement logic on the blockchain to see if an invoker of a smart contract is the real owner. 

It can happen that X509 certificates need to be changed or revoked from participants. To this end, there is an admin user (that needs to be enrolled once the network is started) which has a specific attribute field called "admin" that can call `changeIdentity` which changes the CA certficate of a participant. Only the user with this "admin" attribute can perform this action. This is called Attribute-Based Access Control, more information can be found <a href="https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control" target="_blank">here</a> and <a href="https://github.com/worldsibu/convector-identity-patterns" target="_blank">here</a>.

## Tests
To run tests use:
```
npm run test
```

# TODO:
* Write complete usecase example
* Explain how the network is set up (network file)
