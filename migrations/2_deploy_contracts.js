var TestConfigurator = artifacts.require("./TestConfigurator.sol");

module.exports = function(deployer) {
  deployer.deploy(TestConfigurator);
};
