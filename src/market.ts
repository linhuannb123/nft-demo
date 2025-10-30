import axios from 'axios';

import { BigNumberish, BrowserProvider, Contract, ethers, formatUnits, parseEther } from 'ethers';


import Marketplace from '@/Marketplace.json';
export interface MarketItem {
  price: string;
  itemId: number,
  seller: string;
  owner: string;
  link: string;
  name: string;
  desc: string;
}

export interface ListedToken {
  tokenId: BigNumberish;
  owner: string;
  seller: string;
  price: number;
  curentlyListed: boolean
}

export interface INFTList {
  tokenId: number;
  owner: string;
  seller: string;
  price: number;
  image: string,
  name: string,
  description: string,
}
//定义一些常见报错
const INVALID_URL_ERROR = "输入的URL不能为空";
const INVALID_AMOUNT_MSG = "输入价格必须大于 0"
/**
 * 安全地将金额字符串转化为Wei
 * @param amount 金额字符串 （如 "1.5"）
 * @throws {Error} 当金额无效时抛出错误
 */

export function safeParseEther(amount: string): BigNumberish {
  if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
    throw new Error("无效金额: " + amount);
  }
  try {
    return parseEther(amount);
  } catch (error) {
    throw new Error(`金额转换失败: ${(error as Error).message}`);
  }
}

/**
 * 安全地将 Wei 转化为可读金额
 * @param amount Wei 数值
 * @param decimals 小数位数，默认为18
 * @returns {number} 转化后的金额
 */
export function safeFormatUnits(amount: BigNumberish, decimals: number = 18): number {
  try {
    return Number(formatUnits(amount, decimals));
  } catch (error) {
    console.log(`金额格式化失败: ${(error as Error).message}`);
    return 0; // 返回0作为默认值
  };

};

/**
 * 判断是否为空字符串
 * @param str 判断的字符串
 * @returns {boolean} 
 */
export const isStrctEmptyStr = (str: string | null) => {
  return str == null || str.trim() === "";
}


// 创建Token

// export const createMyToken = async (contract:Contract,tokenUrl: string, price: string, ListingPrice: string): Promise<any> => {
//   if (!window.ethereum) {
//     return Promise.resolve(-1);
//   }
//   if (isStrctEmptyStr(tokenUrl)) {
//     throw new Error(INVALID_URL_ERROR)
//   }
//   if (Number(price) <= 0) {
//     throw new Error(INVALID_AMOUNT_MSG);
//   }
//   const amount = formatUnits(price, "ether");
//   try {
//     const provider = new BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
//     const transaction = await contract.createMyToken(tokenUrl, amount, {
//       value: ListingPrice,
//     })
//     await transaction.wait();
//     // 增加信息框
//     console.log("Successfully listed your NFT!")
//   } catch (e) {
//     throw new Error("Upload error" + e);
//   }
// };
/**
 * 更新 NFT 上架费用（listPrice），只有合约拥有者可调用。
 * @param price 
 * @returns 
 */
export const updateListPrice = async (price: string): Promise<void> => {
  if (!window.ethereum) {
    return;
  }

  if (Number(price) <= 0) {
    throw new Error(INVALID_AMOUNT_MSG);
  }
  const amount = formatUnits(price, "ether");
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.updateListPrice(amount);
    await transaction.wait();
    return Promise.resolve(transaction);
  } catch (e) {
    throw new Error('更新列表价格失败,:' + e);
  }
}

/**
 * 功能：购买指定 NFT。
 * 要求：NFT 处于上架状态（curentlyListed为 true），
 * 支付的 ETH 等于 NFT 上架价格。
 * @param tokenId NFT的ID
 * @param price NFT的支付价格
 */
export const executeSale = async (tokenId: BigNumberish, price: string): Promise<void> => {
  if (!window.ethereum) {
    return;
  }

  if (Number(price) <= 0) {
    throw new Error(INVALID_AMOUNT_MSG);
  }
  const amount = formatUnits(price, "ether");
  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.executeSale(tokenId, {
      value: amount,
    });
    await transaction.wait();
    console.log('You successfully bought the NFT!');
  } catch (e) {
    throw new Error('购买指定 NFT失败,:' + e);
  }
}


/**
 * 返回所有已创建的 NFT 列表（包含上架状态、价格等信息）。
 * @returns {ListedToken[]}
 */
export const getAllNFTs = async (): Promise<ListedToken[]> => {
  if (!window.ethereum) {
    return [];
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getAllNFTs();
    await transaction.wait();
    console.log('You successfully All List NFT!');
    return transaction;

  } catch (e) {
    throw new Error('获取NFT列表失败,:' + e);
  }
}

/**
 * 功能：返回调用者拥有的 NFT（包括作为卖家上架的或作为买家购买的）。
 * @returns {ListedToken[]}
 */
export const getMyNFTs = async (): Promise<ListedToken[]> => {
  if (!window.ethereum) {
    return [];
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getMyNFTs();
    await transaction.wait();
    console.log('You successfully My List NFT!');
    return transaction;

  } catch (e) {
    throw new Error('获取NFT列表失败,:' + e);
  }
}


/**
 * 功能：返回最新创建的 NFT 的 tokenId
 * @returns {BigNumberish | null}
 */
export const getLatestIdToListedToken = async (): Promise<BigNumberish | null> => {
  if (!window.ethereum) {
    return null;
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getLatestIdToListedToken();
    await transaction.wait();
    console.log('You successfully Get Latest NFT tokenId!');
    return transaction;

  } catch (e) {
    throw new Error('获取最新NFT的tokenId失败,:' + e);
  }
}

/**
 * 功能：根据 tokenId 查询指定 NFT 的上架信息。
 * @param tokenId 
 * @returns {ListedToken | null}
 */
export const getListedTokenForId = async (tokenId: BigNumberish): Promise<ListedToken | null> => {
  if (!window.ethereum) {
    return null;
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getListedTokenForId(tokenId);
    await transaction.wait();
    console.log(`You successfully Query ${tokenId}} NFT!`);
    return transaction;

  } catch (e) {
    throw new Error(`查询NFT的${tokenId}失败,:` + e);
  }
}

/**
 * 功能：根据 tokenId 查询指定 NFT 的上架信息。
 * @returns {ListedToken | null}
 */
export const getCurrentToken = async (): Promise<ListedToken | null> => {
  if (!window.ethereum) {
    return null;
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getCurrentToken();
    await transaction.wait();
    console.log(`You successfully Query Current NFT!`);
    return transaction;

  } catch (e) {
    throw new Error(`查询当前NFT的失败,:` + e);
  }
}

/**
 * 功能：返回当前的 NFT 上架费用（listPrice）。
 * @returns {ListedToken | null}
 */
export const getListPrice = async (): Promise<BigNumberish> => {
  if (!window.ethereum) {
    return 0;
  }


  try {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getListPrice();
    await transaction.wait();
    console.log(`You successfully Query Current List NFT Price!`);
    return transaction;

  } catch (e) {
    throw new Error(`查询当前NFT 上架费用失败,:` + e);
  }
}