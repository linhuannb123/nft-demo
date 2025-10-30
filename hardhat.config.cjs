require("@nomicfoundation/hardhat-toolbox");
const { task } = require("hardhat/config");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 可选：保留 accounts 任务（若需要）
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();
//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// 从环境变量获取配置
const BSC_TEST = process.env.VITE_RPC_URL;
const PRIVATE_KEY = process.env.VITE_PRIVATEKEY_ADDRESS;
console.log("env", BSC_TEST, PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
      chainId: 31337
    },
    bscTestnet: {
      url: BSC_TEST,
      accounts: [PRIVATE_KEY || ''],
      chainId: 97, // BSC 测试网链 ID
      gasPrice: 20000000000, // 可选：设置 gasPrice
    },
    // 可选：添加其他网络配置
    // polygonAmoy: {
    //   url: process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 80002
    // }
  },
};

module.exports = config;