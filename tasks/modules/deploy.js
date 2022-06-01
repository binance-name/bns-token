//const { upgrades } = require("hardhat");
const secretsConfig = require("../../.secrets")
const fsp = require("fs/promises")
const Utils = require("../../classes/Utils")
const path  = require("path")

const deployments = path.resolve(__dirname, "../../", "deployments")

module.exports = async (args, hre) => {

    //console.log("args=====>", args)

    let reset = args.reset || false;

    let network = hre.network;
    let networkName = network.name;

    let deploymentDir = `${deployments}/${networkName}`

    await Utils.mkdir(deploymentDir)
  
    let {ethers, upgrades} = hre;

    //let upgrades = hre.upgrades;

    let chainId = (await ethers.provider.getNetwork()).chainId;

    let deploymentFile = `${deploymentDir}/${chainId}.json`

    if((await Utils.exists(deploymentFile))){
        if(!reset){
            let oldDeploymentData = {}
            try { oldDeploymentData = require(deploymentFile) } catch(e){}

            let contractAddress = oldDeploymentData.address || ""
            let txHash = oldDeploymentData.deployTransaction.hash || ""

            if(contractAddress != "") {
                Utils.infoMsg(`Contract Address: ${contractAddress }`)
                Utils.infoMsg(`Tx Hash: ${ txHash }`) 
                exportContractAddress(contractAddress, chainId)
                return true;
            }
        }
    }

    Utils.infoMsg(`ChainId: ${chainId}`)

    let signers = await ethers.getSigners()

    let [owner] = signers;
    
    let account = owner.address;

    Utils.infoMsg(`Deployer Address: ${account}`)

    const BNSToken = await ethers.getContractFactory("BNSToken");
    const _bnsToken = await upgrades.deployProxy(BNSToken, []);
    await _bnsToken.deployed();

    //console.log("_bnsToken===>", _bnsToken.deployTransaction)

    // lets save the data 
    await fsp.writeFile(deploymentFile, JSON.stringify(_bnsToken, null, 2))

    Utils.infoMsg(`Contract Address: ${ _bnsToken.address}`)
    Utils.infoMsg(`Tx Hash: ${ _bnsToken.deployTransaction.hash}`)  

    //exportContractAddress(_bnsToken.address, chainId)
  
}


async function exportContractAddress(address, chainId) {

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