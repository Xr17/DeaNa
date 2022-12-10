const Voting = artifacts.require("SocialRecovery");

module.exports = function (deployer) {
  deployer.deploy(Voting);
};
