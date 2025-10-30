<template>
    <div class="flex w-full text-white py-[6rem] ">
        <img class="flex w-2/5 mx-20" :src="data.image" :alt="data.name">
        </img>
        <div class="border-b-2 font-bold text-xl border p-5 w-fit shadow-lg rounded-lg space-y-8">

            <div>
                Name
                <span>
                    {{ data.name }}
                </span>
            </div>

            <div>
                Description:
                <span>
                    {{ data.description }}
                </span>
            </div>
            <div>
                Price:
                <span>
                    {{ data.price + 'ETH' }}
                </span>
            </div>
            <div>
                Owner: <span class="text-sm font-medium">
                    {{ data.owner }}
                </span>

            </div>
            <div>
                Seller:
                <span class="text-sm font-medium">
                    {{ data.seller }}
                </span>
            </div>
            <div>
                <a-button type="primary" v-if="currAddress !== data.owner && currAddress !== data.seller"
                    @click="buyNFT(data.tokenId)">Buy this NFT</a-button>
                <p v-if="currAddress == data.owner || currAddress == data.seller" class="text-emerald-700">{{
                    'You are the owner of this NFT' }}</p>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { INFTList } from '@/market';
import { BrowserProvider, Contract, formatEther, formatUnits, parseUnits, toBeHex } from 'ethers';
import Marketplace from "@/Marketplace.json";
import axios from 'axios';
import { onMounted } from "vue"

defineOptions({
    name: 'nftPage',
})
const currAddress = ref("0x");
const data = ref<INFTList>({
    price: 0,
    tokenId: 0,
    seller: "",
    owner: "",
    image: "",
    name: "",
    description: ""
});
const route = useRoute();
// const pathname = ref<string>(route.params );
const buyNFT = async (tokenId: number) => {
    console.log('tokenId', tokenId)
    if (!window.ethereum) {
        data.value = {
            price: 0,
            tokenId: 0,
            seller: "",
            owner: "",
            image: "",
            name: "",
            description: ""
        }
        currAddress.value = "0x"
        return;
    }
    try {
        const priceWei = parseUnits(data.value.price.toString(), 'ether');
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
        const transaction = await contract.executeSale(tokenId, {
            value: priceWei,
        });
        await transaction.wait();
        alert('You successfully bought the NFT!');
    } catch (error) {
        console.log('购买NFT失败：', error);
    }

}

const getNFTData = async (tokenId: number) => {

    if (!window.ethereum) {
        data.value = {
            price: 0,
            tokenId: 0,
            seller: "",
            owner: "",
            image: "",
            name: "",
            description: ""
        }
        currAddress.value = "0x"
        return;
    }
    try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        currAddress.value = await signer.getAddress() || '0x';
        console.log(currAddress.value)
        const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
        const transaction = await contract.getListedTokenForId(tokenId) as any[];
        const tokenURI = await contract.tokenURI(tokenId);
        const tokenJSON = await axios.get(tokenURI);

        const items = {
            price: Number(formatUnits(transaction[3], 'ether')) || 0,
            tokenId: parseInt(transaction[0]) || 0,
            seller: transaction[2],
            owner: transaction[1],
            image: tokenJSON.data.image,
            name: tokenJSON.data.name,
            description: tokenJSON.data.description,
        }
        console.log(items, 'items')
        data.value = items as INFTList;
    } catch (error) {
        console.log('error', error)
    }
}

onMounted(async () => {

    try {
        const tokenId = route.params ? await route.params.tokenId as string : null;
        console.log('tokenId', tokenId, typeof tokenId);
        if (tokenId) {
            await getNFTData(Number(tokenId))
        }
        // 原mounted中的逻辑
    } catch (error) {
        console.error('mounted阶段错误:', error);
    }
})
</script>