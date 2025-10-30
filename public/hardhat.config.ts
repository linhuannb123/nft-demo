require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("solidity-coverage");
require("dotenv").config();
const fs = require('fs');

task('accounts', "Prints the of accounts", async (_taskArgs: any, hre: { ethers: { getSingers: () => any; }; }) => {
  const accounts = await hre.ethers.getSingers();

  for (const account of accounts) {
    console.log(account.address);
  }
});
// 2. 从 process.env 读取变量（确保 .env 文件中有对应的键）
const BSC_TEST = process.env.VITE_RPC_URL as string;
const RPC_URL = process.env.VITE_RPC_MAIN_URL as string; // .env 里的 RPC 地址键名
const PRIVATE_KEY = process.env.VITE_PRIVATEKEY_ADDRESS as string; // .env 里的私钥键名
// console.log("env", process.env)
console.log("123",BSC_TEST,RPC_URL,PRIVATE_KEY)
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    // https://bsc-mainnet.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9
    hardhat: {
      chainId: 31337,
    },
    // sepolia_eth:{/*
    //     url:xxxx,
    //     accounts:[process.env.PRIVATE_KEY]
    // }
    // 配置你的网络，如本地网络、测试网络等
    // localhost: {
    //   url: "http://127.0.0.1:8545"
    // }

    //localhost
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9",
    //   accounts: [PRIVATE_KEY],
    // },
    // mainnet: {
    //   // 以太坊主网的 RPC URL，可以使用 Infura、Alchemy 等服务提供的 URL
    //   url: RPC_URL,
    //   accounts: [PRIVATE_KEY],
    // },
    // //   // 如果你想配置测试网，如 Goerli
    // goerli: {
    //   url: "https://goerli.infura.io/v3/3436d3a6c498444eb22be2c52c79c7d9",
    //   accounts: [PRIVATE_KEY],
    //   chainId: 5,
    // },
    bscTestnet: {
      url: BSC_TEST,
      accounts: [PRIVATE_KEY],
      chainId: 97, // BSC 测试网链 ID
      gasPrice: 20000000000, // 可选：设置 gasPrice
    },
  },
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};


