<template>
    <div class="h-1/2 w-full text-white text-lg flex  flex-col justify-center items-center pt-11">
        <div class="flex flex-row justify-center items-center pt-2 text-lg font-bold"> Top NFTs</div>
        <div class=" w-full flex justify-center warpple-class">
            <template v-for="(value) in data" :key="value.tokenId">
                <NftTitle :data="value" class="pb-2" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';

import Marketplace from "@/Marketplace.json";
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import axios from 'axios';
import { INFTList } from '@/market';
import { Message } from '@arco-design/web-vue';

defineOptions({
    name: 'Marketplace',
})
const data = ref<INFTList[]>([])
const nftData = ref([]);
const updateStatus = ref<boolean>(false);
const { info, success, warning, error, normal, loading } = Message;
const getAllNFTs = async () => {
    if (!window.ethereum) {
        nftData.value = [];
        return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
    const transaction = await contract.getAllNFTs();
    const items = await Promise.all(transaction.map(async (i: any[]) => {

        let tokenURI = await contract.tokenURI(i[0]);
        const pinataJson = await axios.get(tokenURI);


        let item = {
            price: formatUnits(i[3], "ether"),
            tokenId: Number(i[0]),
            seller: i[2],
            owner: i[1],
            image: pinataJson.data.image,
            name: pinataJson.data.name,
            description: pinataJson.data.description,
        }
        return item;
    }))
    data.value = items;
    console.log('transaction', items);
    success(`成功加载 ${items.length} 个 NFT 数据`);
}
onMounted(async () => {
    if (!updateStatus.value) {
        await getAllNFTs();
    }
})
</script>
<style scoped lang="scss">
:deep(.arco-link) {
    &:hover {
        background-color: transparent;
    }

}

:deep(.warpple-class) {
    a {
        div {
            padding-bottom: 0.5rem;
        }
    }
}
</style>