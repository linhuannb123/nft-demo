<template>

    <div class="flex flex-col text-white w-full  pt-11">
        <a-row align="center" justify="center" class="md:text-2xl text-center text-lg font-bold">
            <h2>
                {{ "Wallet Address" }}
            </h2>
        </a-row>


        <a-row class="mt-2 md:text-2xl text-center text-lg font-[500]">
            <a-col :span="24">
                {{ currAddress }}
            </a-col>
        </a-row>
        <a-row align="center" justify="center" class="mt-[4rem] md:text-2xl text-center text-lg font-bold">
            <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
                {{ "No. of NFTs" }}
            </a-col>
            <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
                {{ "Total Value" }}
            </a-col>
        </a-row>
        <a-row align="center" justify="center" class="mt-2 text-center md:text-2xl text-lg font-[500]">
            <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
                {{ data.length }}
            </a-col>
            <a-col :span="8" :xs="8" :sm="8" :md="6" :lg="6" :xl="4" :xxl="2">
                {{ nftTotalPrice == 0 ? '0.00' + 'ETH' : nftTotalPrice + 'ETH' }}
            </a-col>
        </a-row>
        <a-row align="center" justify="center" class="mt-[2.6rem] text-center md:text-2xl text-lg font-bold">
            <a-col :span="24">
                {{ 'Your NFTs' }}
            </a-col>
        </a-row>
        <a-row align="center" justify="center" class=" text-center md:text-2xl text-lg font-[500]">


            <template v-show="data.length" v-for="(item) in data" :key="item.tokenId">
                <NftTitle :data="item" />
            </template>
            <p v-if="data.length == 0">{{ 'Oops, No NFT data to display (Are you logged in?)' }}</p>


        </a-row>

    </div>
</template>

<script setup lang="ts">
import { INFTList } from '@/market';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import NftTitle from '@/components/NftTitle.vue';
import Marketplace from "@/Marketplace.json";
import axios from 'axios';
defineOptions({
    name: 'Profile',
})
const currAddress = ref<string>("0x");
const nftTotalPrice = ref<number>(0);
const data = ref<INFTList[]>([]);
const getList = async () => {
    if (!window.ethereum) {
        currAddress.value = '0x';
        nftTotalPrice.value = 0;
        data.value = [];
        return;
    }
    let sumPrice = 0;
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    currAddress.value = await signer.getAddress();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    //
    const transaction = await contract.getMyNFTs();
    console.log('transaction', transaction);
    const items = await Promise.all(transaction.map(async (i: any[]) => {
        let tokenURI = await contract.tokenURI(Number(i[0]));
        const tokenJSON = await axios.get(tokenURI);
        let item = {
            price: Number(formatUnits(i[3], 'ether')),
            tokenId: Number(i[0]),
            seller: i[2],
            owner: i[1],
            image: tokenJSON.data.image,
            name: tokenJSON.data.name,
            description: tokenJSON.data.description,
        }
        sumPrice += item.price
        return item;
    }))
    data.value = items;
    nftTotalPrice.value = sumPrice;
    console.log('items', items, sumPrice)
    console.log('You successfully My List NFT!');
}

onMounted(async () => {
    await getList();
})
</script>
<style lang="scss" scoped>
// :deep(.arco-col) {
//     border: 1px solid red;
// }
</style>