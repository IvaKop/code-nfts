/* eslint-disable */
require('@nomiclabs/hardhat-waffle')
require('dotenv').config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()

    for (const account of accounts) {
        console.log(account.address)
    }
})

module.exports = {
    solidity: '0.8.0',
    paths: {
        artifacts: './src/artifacts',
    },
    networks: {
        hardhat: {
            chainId: 1337,
        },
        rinkeby: {
            url: process.env.RINKEBY_MORALIS_URL,
            accounts: [process.env.PRIVATE_KEY],
        },
    },
}
