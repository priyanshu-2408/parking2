const ParkingDApp = artifacts.require('ParkingDApp');

module.exports = function(deployer) {
  deployer.deploy(ParkingDApp);
};