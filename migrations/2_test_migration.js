const Test_contract = artifacts.require("Test_contract");
// Test_contract is the name of the contract saved inside contracts folder
module.exports = function (deployer) {
  deployer.deploy(Test_contract);
};
