const { ethers, upgrades } = require("hardhat");
const secretsConfig = require("../.secrets")
const fsp = require("fs/promises")
const Utils = require("../classes/Utils")

async function main() {


  let chainId = (await ethers.provider.getNetwork()).chainId;

  Utils.infoMsg(`ChainId: ${chainId}`)

  let signers = await hre.ethers.getSigners()

  let [owner] = signers;
  
  let account = owner.address;

  Utils.infoMsg(`Deployer Address: ${account}`)

  const BNSToken = await ethers.getContractFactory("BNSToken");
  const _bnsToken = await upgrades.deployProxy(BNSToken, []);
  await _bnsToken.deployed();
  
  Utils.infoMsg(`Contract Address: ${ _bnsToken.address}`)
  Utils.infoMsg(`Tx Hash: ${ _bnsToken.hash}`)  

  exportContractAddress(_bnsToken.address, chainId)
}


main();


async function exportContractAddress(address) {

    let contractInfoExportPaths = secretsConfig.contractInfoExportPaths || []

    for(let configDirPath of contractInfoExportPaths){

        //lets create the path 
        await fsp.mkdir(configDirPath, {recursive: true})

        let configFilePath = `${configDirPath}/${chainId}.json`;

        // lets now fetch the data 
        let contractInfoData = {}

        try {
            contractInfoData = require(configFilePath)
        } catch(e){}

        contractInfoData = { ...contractInfoData, ...{ address } }

        Utils.infoMsg(`New Config For ${networkName} - ${JSON.stringify(contractInfoData, null, 2)}`)

        Utils.successMsg(`Saving ${chainId} contract info to ${configFilePath}`)
        console.log()

        //lets save it back
        await fsp.writeFile(configFilePath, JSON.stringify(contractInfoData, null, 2));
    }
}