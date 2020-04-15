/**
 * Simple script that reads all the organizations from a Hurl network config file
 * @author Tim-W
 * @type {string}
 */
const network_file = process.argv[2]

const fs = require("fs");

fs.readFile(network_file, (err, data) => {
  const topology = JSON.parse(data)["topology"];
  let organizations = "";
  for (let org in topology) {
    organizations += "-o " + org + " ";
  }
  console.log(organizations);
});
