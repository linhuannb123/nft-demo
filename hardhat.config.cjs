require('@nomicfoundation/hardhat-toolbox')

require('@nomicfoundation/hardhat-verify') //导入插件
const dotenv = require('dotenv')

// 加载环境变量
dotenv.config()

//获取当前的区块编号
const { task } = require('hardhat/config')

//定义一个任务  调用setAction方法设置任务
task('block-number', 'Prints the current block number').setAction(
  //javaScript箭头函数 定义一个函数可以不使用function关键字
  //这一行相当于 const blockTask=async function (taskArgs,hre){}
  //hre就是"HardhatRuntimeEnvironment" 是hardhat的运行环境  就相当于deploy脚本里的require("hardhat");

  async (taskArgs, hre) => {
    //hre.ethers  从hardhat的运行环境中获取ethers
    //获取当前区块链的provider  这个方法是返回当前区块链的最新区块号
    const blockNumber = await hre.ethers.provider.getBlockNumber()
    console.log(`Current block number:${blockNumber}`)
  },
)

// 从环境变量获取配置
const BSC_TEST = process.env.VITE_RPC_URL
const PRIVATE_KEY = process.env.VITE_PRIVATEKEY_ADDRESS
console.log('env', BSC_TEST, PRIVATE_KEY)

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  defaultNetwork: 'hardhat',
  solidity: '0.8.26',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337,
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
  etherscan: {
    apiKey: '3436d3a6c498444eb22be2c52c79c7d9',
  },
}

module.exports = config
