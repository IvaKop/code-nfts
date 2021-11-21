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
    const codeNFTsContract = await CodeNFTs.deploy(
        '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B',
        '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
        '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
    )

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
