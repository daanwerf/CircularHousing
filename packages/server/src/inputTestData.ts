/**
 * @author Tim-W
 * A very simple script that feeds the blockchain network with some example test data
 */
import {getAdapter} from "./convector";
import {ClientFactory} from "@worldsibu/convector-core";
import {ItemController} from "item-cc";
import {ParticipantController} from "participant-cc";
import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import * as x509 from "x509"

async function itemAdapter(org, user): Promise<ItemController> {
  return ClientFactory(ItemController, await getAdapter(user, org));
}

async function partAdapter(org, user): Promise<ParticipantController> {
  return ClientFactory(ParticipantController, await getAdapter(user, org));
}

class ParticipantType {
  public type: string
  public id: string
  public name: string
  public msp: string
  public user: string
}

const itemNames = ["Window_01",
  "handrail_15",
  "rooftiles_3679",
  "woodenfloor_3679",
  "Lighting_88",
  "Floortiles_3838",
  "Kitchensink_0829",
  "Kitchencounter_7256",
  "Steeltrap_3560",
  "Rusticbrick_0928",
  "Door_089",
  "Toilet_0937",
  "Heatpump-0455",
  "kitchencupboard_007"];

const participants: Array<ParticipantType> = [
  {
    type: "participant",
    id: "manu_part",
    name: "Manufacturer Employee",
    msp: "Manufacturer",
    user: "manu_user"
  },
  {
    type: "transporter",
    id: "transporter_part",
    name: "Transporter Employee",
    msp: "Transporter",
    user: "transporter_user"
  },
  {
    type: "participant",
    id: "retailer_part",
    name: "Retailer Employee",
    msp: "Retailer",
    user: "retailer_user"
  },
  {
    type: "participant",
    id: "sho_part",
    name: "SHO Employee",
    msp: "SocialHousingOrganization",
    user: "sho_user"
  }
]

function randomMaterials(): string {
  let materials = ["Oak wood", "Stainless steel", "Iron", "Stone", "Plastic", "Cotton"];
  let list = [];
  const amt = 3;
  for (let i = 0; i < amt; i++) {
    const id = Math.floor(Math.random() * (materials.length - 1));
    list.push(materials[id]);
    materials.splice(id, 1);
  }
  return list.toString();
}

function randomQuality(): string {
  const quality = ['Good', 'Usable', 'Bad', 'Broken'];
  const id = Math.floor(Math.random() * (quality.length - 1));
  return quality[id];
}

function createParticipant(p) {
  partAdapter("Government", "chaincodeAdmin").then(function (ctrl) {
    ctrl.register(p.type, p.id, p.name, p.msp, getCertificate(p.msp, p.user)).then(r => console.log("Added " + p.name));
  })
}

async function createItem(itemName) {
  const item = await (await itemAdapter("Manufacturer", "manu_user")).create(itemName, "manu_part", "Good", randomMaterials());
  const id = item["_id"];
  await (await itemAdapter("Manufacturer", "manu_user")).proposeTransfer(id, "retailer_part");
  await (await itemAdapter("Retailer", "retailer_user")).answerProposal(id, true);
  await (await itemAdapter("Manufacturer", "manu_user")).transport(id, "transporter_part");
  await (await itemAdapter("Transporter", "transporter_user")).deliverItem(id);

  await (await itemAdapter("Retailer", "retailer_user")).proposeTransfer(id, "sho_part");
  await (await itemAdapter("SocialHousingOrganization", "sho_user")).answerProposal(id, true);
  await (await itemAdapter("Retailer", "retailer_user")).transport(id, "transporter_part");
  await (await itemAdapter("Transporter", "transporter_user")).deliverItem(id);
  await (await itemAdapter("SocialHousingOrganization", "sho_user")).updateQuality(id, randomQuality());
}

async function inputTestData() {
  await participants.forEach(function (p) {
    console.log("Adding participant " + p.name);
    createParticipant(p);
  });
  await itemNames.forEach(function(itemName, i) {
    console.log(`Processing item ${itemName} (${i} of ${itemNames.length})`);
    createItem(itemName);
  })
}

function getCertificate(org: string, user: string) {
  const cert = JSON.parse(fs.readFileSync(path.resolve(os.homedir(),
    'hyperledger-fabric-network/.hfc-' + org + '/' + user), 'utf8'))
    .enrollment.identity.certificate;
  return x509.parseCert(cert).fingerPrint;
}

inputTestData().then(r => {
  console.log("Completed");
});
