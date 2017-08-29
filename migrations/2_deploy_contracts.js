var MetaCoin = artifacts.require("./Crowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(Crowdsale);
};
