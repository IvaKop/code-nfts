/* eslint-disable */

const hre = require('hardhat')

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const CodeNFTs = await hre.ethers.getContractFactory('CodeNFTs')
    const codeNFTsContract = await CodeNFTs.deploy()

    await codeNFTsContract.deployed()

    console.log('CodeNFTs deployed to:', codeNFTsContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
