# Circular Housing Blockchain

This is a blockchain implementation for Circular Housing, built on top of <a href="https://hyperledger-fabric.readthedocs.io/en/release-1.4/" target="_blank">Hyperledger Fabric</a> using the <a href="https://github.com/hyperledger-labs/convector" target="_blank">Convector framework</a>. It allows to specify a custom Fabric network in `network.config.json` and to run this network locally. There is one admin entity that can create one participant for each user, which this user can then use to act on the network (creating, updating, and transferring items). The system also contains a REST Server that creates a REST API for the chaincode, which can be used to communicate with the chaincode from a client application. And we built a web client to demonstrate the system. This README gives instructions on how to setup the network, how to use it on the CLI, how to run the REST server, and how to run the web client. Note that this project has only been run and tested on Ubuntu. 

## Table of Contents
* [Network overview](#network-overview)
* [Setup](#setup)
* [Start the network](#start)
* [Interact with the network via CLI](#cli)
* [REST Server](#server)
* [Webclient](#web)
* [Tests](#tests)
* [Upgrade chaincode](#upgrade)
* [Example data](#example-data)
* [Troubleshooting](#troubleshooting)

<a name="network-overview"></a>
## Network overview
To understand the system we built, we give a short overview here of how it works. The system is made to allow manufacturers/retailers/housing organizations to create/update/transfer items. Each organization has one or more users. To transfer an item, transporters are needed which are also part of the ecosystem.  

For a user of an organization to be able to act on the blockchain (e.g. create an item) he needs a participant to be registered (which can be seen as a user account). Only a central authority can register new participants, so this central authority can decide who can act on the blockchain, and in what role (regular participant or transport, we will come to this in a bit). The way this is implemented is based on Attribute-Based Access Control, more information can be found <a href="https://hyperledger-fabric-ca.readthedocs.io/en/release-1.4/users-guide.html#attribute-based-access-control" target="_blank">here</a> and <a href="https://github.com/worldsibu/convector-identity-patterns" target="_blank">here</a>.  

There are two types of participants. There is a regular participant, that can create/update/transfer items, and there is a transporter participant, which cannot perform these actions, but can only deliver an item to another regular participant when a deal is made between two regular participants.  

Transferring items works as follows: participant A makes a proposal to transfer item I to participant B. Participant B can accept or reject this proposal. If he accepts it, participant A can send the item to transporter T. Transporter T can then deliver the item to participant B, who is then the new owner of the item. 

<a name="setup"></a>
## Setup
To run this project, you first need to setup Convector and Hurley. See <a href="https://docs.covalentx.com/article/71-getting-started" target="_blank">their docs</a> for instructions on how to do this (note there are separate instructions for Ubuntu 18.04 users). Make sure to install Hurley globally. Once Convector and Hurley are installed (note that during this installation you automatically install Hyperledger Fabric as well), run the following commands to setup this project:
```
# Clone the repo and go into the root folder
git clone https://github.com/daanwerf/CircularHousing.git
cd CircularHousing
# Install all node dependencies
npm i
```

<a name="start"></a>
## Start the network
Once everything is setup, run the following command to start the network:
```
# Create a new development blockchain network as specified in network.config.json
sh launchBlockchain.sh
```

<a name="cli"></a>
## Interact with the network via CLI
This section describes how to interact with the local blockchain network via the command line. The commands assume `network.config.json` has not been modified and the network is running.

### Creating participants
First, you need to create participants on the network, which users can then use to create/update/transfer/transport items on the network. There are 2 types of participant: a regular "participant" type, and a "transporter" type. The "participant" type can create/update/transfer items to other "participant" types. The "transporter" cannot do this, a "transporter" can only deliver an item to a different participant. 
```
# Store the certificate of user manu_user of organisation Manufacturer in a variable
CERTIFICATE=$(node ./packages/admin/get_certificate.js Manufacturer manu_user)

# Try to register a participant for Manufacturer - manu_user with id (sort of username) manu_part
# and name "Manufacturer Employee" as manu_user.  
# This should fail since only the admin can create new participants
hurl invoke circularhousing participant_register participant manu_part "Manufacturer Employee" Manufacturer $CERTIFICATE -o Manufacturer -u manu_user
# Now create the participant with chaincodeAdmin, which should work
hurl invoke circularhousing participant_register participant manu_part "Manufacturer Employee" Manufacturer $CERTIFICATE -o Government -u chaincodeAdmin

# Get the information of the participant you just added
hurl invoke circularhousing participant_get manu_part -o Manufacturer -u manu_user
# Try to register another participant for user manu_user, this is not possible since a participant 
# with this certificate is already registered
hurl invoke circularhousing participant_register participant manu_part2 "Manufacturer Employee" Manufacturer $CERTIFICATE -o Government -u chaincodeAdmin

# Get certificate for user retailer_user of organization Retailer
CERTIFICATE=$(node ./packages/admin/get_certificate.js Retailer retailer_user)
# Register participant
hurl invoke circularhousing participant_register participant retailer_part "Retailer Employee" Retailer $CERTIFICATE -o Government -u chaincodeAdmin

# Get certificate for user transporter_user of organization Transporter
CERTIFICATE=$(node ./packages/admin/get_certificate.js Transporter transporter_user)
# Register a participant with type transporter, meaning it cannot own items but only transport them
hurl invoke circularhousing participant_register transporter transporter_part "Transporter Employee" Transporter $CERTIFICATE -o Government -u chaincodeAdmin

# Get all participants to verify they have been correctly created
hurl invoke circularhousing participant_getAll -o Government -u chaincodeAdmin
```

### Interacting with items
Once a few participants have been created, these can interact with the network to create/update/transfer/transport items. Below is an example of creating an item, updating its quality, proposing a transfer to a different participant, accepting this transfer, sending it to the transporter, and the transporter delivering the item to the new owner. 

```
# Create an item
hurl invoke circularhousing item_create "Window" manu_part Good "Glass, Frame" -o Manufacturer -u manu_user
# Try to create an item for a different participant. This is not possible, you can only create items for yourself.
hurl invoke circularhousing item_create "Window" retailer_part Good "Glass, Frame" -o Manufacturer -u manu_user

# Since we create a uuid for each item when it is created, when we want to perform actions on this item we
# need to retrieve this id. To do this, first get all items (which is one item currently).
hurl invoke circularhousing item_getAll -o Government -u chaincodeAdmin
# Copy the id into a variable
UUID=<id>
# Then copy the id from the "_id" field and input it in <id> in the below command to retrieve that single item
hurl invoke circularhousing item_get $UUID -o Manufacturer -u manu_user

# Update the quality of the item
hurl invoke circularhousing item_updateQuality $UUID Bad -o Manufacturer -u manu_user

# Propose a transfer of the item to the Retailer participant
hurl invoke circularhousing item_proposeTransfer $UUID retailer_part -o Manufacturer -u manu_user

# The retailer accepts the item
hurl invoke circularhousing item_answerProposal $UUID "true" -o Retailer -u retailer_user

# Current owner sends the item to the transporter for delivery
hurl invoke circularhousing item_transport $UUID transporter_part -o Manufacturer -u manu_user

# Transporter delivers the item
hurl invoke circularhousing item_deliverItem $UUID -o Transporter -u transporter_user

# Get the item to see that the owner is now the retailer. Also note the history of events that is
# recorded in the item.
hurl invoke circularhousing item_get $UUID -o Retailer -u retailer_user
```

<a name="server"></a>
## REST Server
To allow interaction with the blockchain from a web client, we created a REST Server (see <a href="" target="_blank">Convector Docs</a> for details).  

To start the server, make sure the blockchain network has been started, then run:
```
npx lerna run start --scope server --stream
```

Below is an example POST call and an example GET call that can be made to the REST API using curl. For all possible routes and which parameters to pass along, please refer to the code `server/src/controllers/`. 
```
# Store the certificate of user sho_user in a variable
CERTIFICATE=$(node ./packages/admin/get_certificate.js SocialHousingOrganization sho_user)
# POST request - create a participant
curl 'http://localhost:8000/participant/register?org=Government&user=chaincodeAdmin' -H "Content-Type: application/json" --request POST --data '{ "type": "participant", "id": "sho_part", "name": "SHO Employee", "msp": "SocialHousingOrganization", "certificate": '\""$CERTIFICATE"\"'}'

# GET request - Get all participants as organization Government and user chaincodeAdmin
curl 'http://localhost:8000/participant/getAll?org=Government&user=chaincodeAdmin'
```

<a name="web"></a>
## Webclient
To setup and run the web client, first make sure the blockchain network and the REST server are running. If you just started the network and the server, the first API call will take a lot of time. When you start the website, it will immediately make multiple API calls, which can take a toll on your machine. Therefore, we recommend running one curl command to the REST server before starting the website, for example:
```
curl 'http://localhost:8000/participant/getAll?org=Government&user=chaincodeAdmin'
```

Then, the web client can be started with the following commands:
```
# cd into the web folder
cd packages/web
# Install necessary node modules (only needs to be done first time)
npm i
# Start the web client
npm start
```

<a name="tests"></a>
## Tests
To test if everything works as expected, we wrote tests for the chaincode. To run these tests, do:
```
# If changes are made to the chaincode, it needs to be packaged before executing the tests
npm run cc:package
# Run the tests
npm run test
```

<a name="upgrade"></a>
## Upgrade chaincode
When changes are made to the chaincode and you want to reflect these changes on a running blockchain network, you can upgrade the chaincode with the following commands from the root of the project (see <a href="https://www.npmjs.com/package/@worldsibu/hurley" target="_blank">Hurley docs</a> for full specification):
```
# Regardless of installation or upgrading, first chaincode needs to be packaged
npm run cc:package

# Upgrade existing chaincode (replace <versionno> by a version number of your choice and replace
# <org1> by the organization you want to upgrade the chaincode of. If you want to upgrade
# on multiple organizations, you can add multiple -o arguments. 
hurl upgrade circularhousing node <versionno> -P ./chaincode-circularhousing -o <org1>
```

<a name="exampledata"></a>
## Example data
To insert 4 participants and around 20 items on the network, with some example interactions and history, use the inputTestData script (make sure the network and the server are running first):
```
node packages/server/dist/inputTestData.js
```

<a name="troubleshooting"></a>
## Troubleshooting
This section describes common problems that can occur and how to fix them.

### x509 module
**Problem**  
`Cannot find module './build/Release/x509'` occurs when running e.g. `CERTIFICATE=$(node ./packages/admin/get_certificate.js WoodGatherer Casper)`, even though the package is in package.json and should have been installed with `npm i`. 

**Solution**  
From root run:
`npm install x509`

### Node Watcher issue
**Problem**  
When you run the REST server and the Web servers, Nodejs needs to watch both servers for possible changes. An error can occur on Ubuntu because it does not allow enough watchers for this. The error will look something like: `Error: watch ...`.

**Solution**  
```
sudo -i
echo 1048576 > /proc/sys/fs/inotify/max_user_watches
exit
```
