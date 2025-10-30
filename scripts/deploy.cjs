const { ethers } = require("hardhat");
const fs = require("fs");
const { expect } = require("chai");

async function deploy() {
  const contract = await ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await contract.deploy();
  await nftMarket.waitForDeployment();
  console.log("Token1的合约地址：", await nftMarket.target);
  expect(await nftMarket.getListPrice()).eq(ethers.parseEther("0.01"));
  const data = {
    address: await nftMarket.target,
    abi: JSON.parse(nftMarket.interface.formatJson()),
  };
  console.log('abi', nftMarket.interface.formatJson())
  fs.writeFileSync("./src/Marketplace.json", JSON.stringify(data));
  console.log(nftMarket.target);
}

deploy();