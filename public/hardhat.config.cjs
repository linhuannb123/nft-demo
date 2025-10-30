require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

// 加载环境变量
dotenv.config();

// 从环境变量获取配置
const BSC_TEST = process.env.NEXT_PUBLIC_BSC_TEST_RPC;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

/** @type {import('hardhat/config').HardhatUserConfig} */
const config = {
  solidity: "0.8.26",
  networks: {
    hardhat: {
      chainId: 31337
    },
    bscTestnet: {
      url: BSC_TEST,
      accounts: [PRIVATE_KEY],
      chainId: 97, // BSC 测试网链 ID
      gasPrice: 20000000000, // 可选：设置 gasPrice
    },

    // 已修复 Polygon Amoy 网络配置注释（示例）
    // polygonAmoy: {
    //   url: process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 80002 // Polygon Amoy 测试网链 ID
    // }
  },
};

module.exports = config;
