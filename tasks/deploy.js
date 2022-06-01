
const deployer = require("./modules/deploy")

//console.log("deployer===>", deployer)

task("deploy", "Deploy's a contract")
  .addFlag("reset", "Wether to do a fresh install even if an old deployment exists")
  .setAction(deployer);