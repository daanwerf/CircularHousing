# Circular Housing Blockchain

## Setup
To run this project, you first need to setup Convector and Hurley. See <a href="https://docs.covalentx.com/article/71-getting-started" target="_blank">their docs</a> for instructions on how to do this (note there are separate instructions for Ubuntu 18.04 users). Make sure to install Hurley globally. 

```
# Clone the repo and go into the root folder
git clone https://github.com/daanwerf/CircularHousing.git
cd CircularHousing
# Install all node dependencies
npm i
```

## Run the project
Once Convector/Hurley/Fabric are all setup, run the following commands to get the project running:
```
# Create a new development blockchain network as specified in network.config.json
sh launchBlockchain.sh

# Store the certificate of user Casper in a variable
CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Casper)
# Register a participant for WoodGatherer with id casper and name "Casper" as user Casper 
# This should fail since only the admin can create new participants
hurl invoke circularhousing participant_register casper "Casper" WoodGatherer $CERTIFICATE -o WoodGatherer -u Casper
# Now create the participant with admin, which should work
hurl invoke circularhousing participant_register casper "Casper" WoodGatherer $CERTIFICATE -o Government -u chaincodeAdmin

# Get the information of the participant you just added
hurl invoke circularhousing participant_get casper -o WoodGatherer -u Casper
# Try to register another participant for user Casper, this is not possible since a participant 
# with this certificate is already registered
hurl invoke circularhousing participant_register casper2 "Casper 2" WoodGatherer $CERTIFICATE -o Government -u chaincodeAdmin

# Get certificate for user Tim
CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Tim)
# Register participant Tim
hurl invoke circularhousing participant_register tim "Tim" WoodGatherer $CERTIFICATE -o Government -u chaincodeAdmin
# Verify that Tim was added as participant
hurl invoke circularhousing participant_get tim -o WoodGatherer -u Tim

# Create an item
hurl invoke circularhousing item_create "Item 1" casper Good "material1,material2" -o WoodGatherer -u Casper

# Get item
hurl invoke circularhousing item_get item1 -o WoodGatherer -u Casper

# Transfer item to Tim
hurl invoke circularhousing item_transfer item1 tim -o WoodGatherer -u Casper

# Get item, see that owner is now Tim
hurl invoke circularhousing item_get item1 -o WoodGatherer -u Tim

# Try to update item as user casper, see that this is not possible
hurl invoke circularhousing item_updateName item1 "Item 2" -o WoodGatherer -u Casper

# Now update as Tim, this is possible since Tim is owner
hurl invoke circularhousing item_updateName item1 "Item 2" -o WoodGatherer -u Tim

# Update quality
hurl invoke circularhousing item_updateQuality item1 Bad -o WoodGatherer -u Tim

# Get item again, see that quality and name are updated
hurl invoke circularhousing item_get item1 -o WoodGatherer -u Tim

# Try to update the fingerprint (i.e. X509 certificate) of participant Sultan. This should give 
# an error since it is invoked with user Sultan, who is not authorized to change certficates
hurl invoke circularhousing participant_changeIdentity casper RandomID -o WoodGatherer -u Casper
# Update the fingerprint with chaincodeAdmin (created earlier) who is authorized to do this, 
# so this should work.
hurl invoke circularhousing participant_changeIdentity casper RandomID -o Government -u chaincodeAdmin
# Inspect the participant again and notice the changed fingerprint
hurl invoke circularhousing participant_get casper -o WoodGatherer -u Casper

# TODO: MAKE EXAMPLE WITH TRYING TO SEE ITEM THAT IS NOT YOURS, THEN CHANGING FINGERPRINT 
# AND NOTICE DIFFERENT ITEMS THAT CAN NOW BE VIEWED.
```

## Run the API
```
npx lerna run start --scope server --stream

# Now try some API calls
# Store the certificate of user Casper in a variable
CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Tim)
curl 'http://localhost:8000/participant/register?org=Government&user=chaincodeAdmin' -H "Content-Type: application/json" --request POST --data '{ "id": "user_tim", "name": "Tim Wissel", "msp": "WoodGatherer", "certificate": '\""$CERTIFICATE"\"'}'

CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Casper)
curl 'http://localhost:8000/participant/register?org=Government&user=chaincodeAdmin' -H "Content-Type: application/json" --request POST --data '{ "id": "user_casper", "name": "Casper Athmer", "msp": "WoodGatherer", "certificate": '\""$CERTIFICATE"\"'}'

curl 'http://localhost:8000/participant/get/user_tim?org=WoodGatherer&user=Tim'

curl 'http://localhost:8000/item/add?org=WoodGatherer&user=Casper' -H "Content-Type: application/json" --request POST --data '{ "id": "item1", "name": "Item 1", "owner": "user_casper", "quality": "Good", "materials": "material1,material2"}'

curl 'http://localhost:8000/item/getAll?org=Government&user=chaincodeAdmin'
```

## Run the website
```
cd packages/web
npm i
npm start
```

## Install or upgrade chaincode
To install and/or upgrade chaincode, the following commands from the root of the project can be run (see <a href="https://www.npmjs.com/package/@worldsibu/hurley" target="_blank">Hurley docs</a> for full specification):
```
# Regardless of installation or upgrading, first chaincode needs to be packaged
npm run cc:package

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

## Troubleshooting
This section describes common problems that can occur and how to fix them.


### x509 module
**Problem**
`Cannot find module './build/Release/x509'` occurs when running e.g. `CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Casper)`, even though the package is in package.json and should have been installed with `npm i`. 

**Solution**
From root run:
`npm install x509`
