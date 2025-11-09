<template>
  <router-link :to="`/nftPage/${data.tokenId}`">
    <div
      class="w-96 md:w-72 h-fit flex flex-col rounded-lg border-2 text-white bg-transparent ml-12 mt-5 mb-5 2xl:ml-6 2xl:mr-2.5 2xl:mb-2.5 md:ml-12 md:mr-5 md:mb-5 items-center shadow-2xl">
      <img
        :src="data.image"
        class="rounded-lg w-[100%] h-80 object-cover" />
      <div
        class="py-2 text-white flex flex-col justify-center items-center -mt-20">
        <strong>{{ data.name }}</strong>
        <p class="display-inline">
          {{ data.description }}
        </p>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import { INFTList } from '@/market'
import { PropType } from 'vue'

defineOptions({
  name: 'NftTitle',
})
defineProps({
  data: {
    type: Object as PropType<INFTList>,
    required: true,
  },
})
</script>
