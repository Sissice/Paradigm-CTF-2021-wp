require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity:{
    compilers: [    //可指定多个sol版本
      {version: "0.8.9"},
      {version: "0.8.0"},
      {version: "0.5.12"},
      {version: "0.7.0"},
      {version: "0.4.24"},
      {version: "0.4.16"},
      {version: "0.6.0"},
      {version: "0.6.12"},
      {version: "0.5.11"}



    ],
    // overrides: {
    //   "contracts/upgrade/public/contracts/Exploit.sol": {
    //     version: "0.6.12",
    //     settings: { }
    //   }
    // },
  },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/6sn02Hh-3xVrNWD22Lmm_n2zbhqeawgc",
        blockNumber: 14437917,
        gas: 5100000,
        gasPrice: 8000000000,
        // allowUnlimitedContractSize: true
      }
    }
  }
};


