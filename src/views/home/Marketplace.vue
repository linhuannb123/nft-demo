<template>
  <div
    class="h-1/2 w-full text-white text-lg flex flex-col justify-center items-center pt-20">
    <div
      class="flex flex-row justify-center items-center pt-2 text-lg font-bold">
      Top NFTs
    </div>

    <a-spin
      :loading="loading"
      tip="loading..."
      v-if="loading" />

    <div class="w-full flex justify-center flex-wrap warpple-class">
      <template
        v-for="value in data"
        :key="value.tokenId">
        <NftTitle
          :data="value"
          class="pb-2" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Marketplace from '@/Marketplace.json'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import axios from 'axios'
import { INFTList } from '@/market'
import { Message } from '@arco-design/web-vue'

defineOptions({
  name: 'Marketplace',
})
const data = ref<INFTList[]>([])
const nftData = ref([])
const updateStatus = ref<boolean>(false)
const { success, warning, error } = Message
const loading = ref<boolean>(false)
const getAllNFTs = async () => {
  if (!window.ethereum) {
    nftData.value = []
    warning('Please install MetaMask!')
    return
  }

  try {
    loading.value = true
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    const transaction = await contract.getAllNFTs()
    const items = await Promise.all(
      transaction.map(async (i: any[]) => {
        const tokenURI = await contract.tokenURI(i[0])
        const pinataJson = await axios.get(tokenURI)

        const item = {
          price: formatUnits(i[3], 'ether'),
          tokenId: Number(i[0]),
          seller: i[2],
          owner: i[1],
          image: pinataJson.data.image,
          name: pinataJson.data.name,
          description: pinataJson.data.description,
        }
        return item
      }),
    )
    data.value = items
    console.log('transaction', items)
    success(`成功加载 ${items.length} 个 NFT 数据`)
    loading.value = false
  } catch (e: any) {
    error('加载 NFT 数据失败：' + e.message)
    loading.value = false
  }
}
onMounted(async () => {
  if (!updateStatus.value) {
    await getAllNFTs()
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
