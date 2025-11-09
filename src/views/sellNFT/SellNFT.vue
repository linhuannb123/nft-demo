<template>
  <div class="flex justify-center w-full place-items-center pt-10">
    <a-form
      :model="form"
      ref="formRef"
      @submit="listNFT"
      size="lg"
      :layout="layout"
      class="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4"
      :label-col-props="labelColProps"
      :wrapper-col-props="wrapperColProps"
      style="width: 28.5rem;">
      <h3 className="text-center text-base font-bold text-purple-500 mb-8 ">
        Upload your NFT to the marketplace
      </h3>
      <a-form-item
        field="name"
        label="NFT Name"
        :rules="rules.name"
        validate-trigger="blur"
        class="mb-4">
        <a-input
          v-model="form.name"
          placeholder="Axie#4563" />
      </a-form-item>
      <a-form-item
        field="description"
        label="NFT Description"
        :rules="rules.description"
        validate-trigger="blur"
        class="mb-6">
        <a-textarea
          v-model="form.description"
          :auto-size="autoSize"
          placeholder="Axie Infinity Collection"
          :max-length="100"
          allow-clear
          show-word-limit />
      </a-form-item>
      <a-form-item
        field="price"
        label="Price (in ETH)"
        :rules="rules.price"
        validate-trigger="blur"
        class="mb-6">
        <a-input-number
          v-model="form.price"
          :default-value="0"
          mode="button"
          :step="0.01"
          size=""
          :min="0.01"
          placeholder="Min 0.01 ETH" />
      </a-form-item>
      <a-form-item
        field="image"
        label="Upload Image (<500 KB)"
        validate-trigger="input"
        class="mb-6">
        <div class="flex flex-col gap-4">
          <input
            type="file"
            class="flex w-full"
            @change="OnChangeFile"
            placeholder="Upload your NFT image" />
          <!-- 进度条 -->
          <a-progress
            v-if="isUploading"
            size="large"
            :percent="progress / 100"
            :style="{ width: '100%' }">
            <template #text="scope">进度 {{ scope.percent * 100 }}%</template>
          </a-progress>

          <!-- 上传状态 -->
          <p
            v-if="uploadStatus === 'success' && isUploading"
            class="text-green-500">
            上传成功！
          </p>
          <p
            v-if="uploadStatus === 'error' && errorMessage"
            class="text-red-500">
            {{ errorMessage }}
          </p>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          @click="listNFT"
          :disabled="status"
          size="large"
          style="width: 100%;">
          List NFT
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import FormData from 'form-data'
import { isStrctEmptyStr } from '@/market'
import { NFTFrom, uploadJSONToIPFS } from '@/pinata'
import { Message } from '@arco-design/web-vue'
import { BrowserProvider, Contract, parseUnits, toBeHex } from 'ethers'
import { reactive, ref } from 'vue'

import Marketplace from '@/Marketplace.json'
// $refs.formRef.resetFields()
defineOptions({
  name: 'ListMyNFT',
})
// 上传进度0-100
const progress = ref<number>(0)
// 上传状态:success,error
const uploadStatus = ref<string>('')
// 上传错误信息
const errorMessage = ref<string>('')
// 是否上传加载中
const isUploading = ref<boolean>(false)
const status = ref<boolean>(false)
const formRef = ref<any>(null)
const layout = ref<string>('vertical')
const form = reactive<NFTFrom>({
  name: '',
  description: '',
  price: 0,
  image: '',
})
console.log(import.meta.env.VITE_APP_PINATA_JWT)

const autoSize = ref({
  minRows: 5,
  maxRows: 5,
})
const labelColProps = ref({
  span: 24,
  offset: 0,
})
// const OnChangeFile = async (fileList: FileItem[]) => {
//     if (fileList.length > 0) {
//         status.value = true;
//         const fileItem = fileList[0]; // 因为设置了:limit="1"，所以取第一个即可
//         console.log('file', fileItem);
//         let file = fileItem.file!;
//         action.value = "/api-pinata/ipfs/";
//         // 这里可以对 file 进行后续处理，比如获取文件对象、预览等
//         try {
//
//             const imgUrl = await uploadFileToIPFS(file);
//             console.log('imgUrl', imgUrl)
//             // if (imgUrl) {
//             //     console.log('imgurl', imgUrl);
//             //     action.value = imgUrl;
//             //     fileItem.url = imgUrl;
//             //     form.image = [fileItem];
//             //     status.value = false;
//             // }
//         } catch (e) {
//             status.value = false;
//             console.log("Error during file upload", e);
//             Message.error('Image upload failed, please try again');
//             // 清除表单中 image 字段的错误状态
//             formRef.value?.clearValidate("image");
//         }
//     }

// };
const OnChangeFile = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const fileList = input?.files as unknown as any[]
  console.log('file', input?.files)
  if (!fileList || fileList.length === 0) return

  status.value = true
  isUploading.value = true
  uploadStatus.value = ''
  errorMessage.value = ''
  progress.value = 0
  const file = fileList[0]
  console.log('file', file)
  //  2. 文件大小验证（500kB）
  if (file.size > 500 * 1024 * 1024) {
    uploadStatus.value = 'error'
    errorMessage.value = 'Image size should be less than 500 KB'
    isUploading.value = false
    status.value = false
    return
  }
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  const formData = new FormData()
  // const imgUrl = await uploadFileToIPFS(fileItem);
  // console.log('imgUrl', imgUrl);
  // 提取原始 File 对象
  try {
    formData.append('file', file)
    formData.append(
      'pinataMetadata',
      JSON.stringify({
        name: file.name,
        keyvalue: { type: 'nft' },
      }),
    )

    const response = await axios.post(
      // 接口路径需完整，通过代理转发时保持一致
      url,
      formData,
      {
        maxBodyLength: 500 * 1024 * 1024, // 上传图片的大小的限制500MB
        headers: {
          'Content-Type': `multipart/form-data; boundary=`,
          pinata_api_key: import.meta.env.VITE_APP_PINATA_KEY,
          pinata_secret_api_key: import.meta.env.VITE_APP_PINATA_SECRET,
          // FormData 会自动设置 Content-Type 为 multipart/form-data，无需手动指定
        },
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            progress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            )
          }
        },
      },
    )
    // 4.  上传成功处理
    const imgUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
    form.image = imgUrl // 预览图地址
    uploadStatus.value = 'success'

    Message.success('Image uploaded successfully!')
  } catch (e: any) {
    status.value = false
    uploadStatus.value = 'error'
    errorMessage.value = e.response?.data?.error || '上传失败，请重试'
    formRef.value?.clearValidate('image')
  } finally {
    // 6. 重置状态
    progress.value = 0 // 重置进度条
    isUploading.value = false
    status.value = false
    // input.value = ''; // 重置文件输入框
  }
}

const wrapperColProps = ref({
  span: 24,
  offset: 0,
})

const rules = {
  name: [
    {
      required: true,
      message: 'name is required',
    },
  ],
  description: [
    {
      required: true,
      message: 'description is required',
    },
  ],
  price: [
    { required: true, message: 'price is required' },
    { type: 'number', min: 0.01, message: 'price is min than 0.01' },
  ],
  // 其他规则保持不变...
  image: [
    {
      required: true,
      validator: (rule: any, value: string, callback: any) => {
        if (isStrctEmptyStr(value)) {
          callback('Please upload at least one image')
        } else {
          callback()
        }
      },
    },
  ],
}

const listNFT = async (e: Event) => {
  errorMessage.value = ''
  e.preventDefault()
  console.log('form', form)
  // 执行表单验证 验证不通过有值，通过undefined;
  const validateResult = await formRef.value.validate()
  console.log('isValid', validateResult)
  if (validateResult) {
    return
  }
  if (!form.image || isStrctEmptyStr(form.image) || !window.ethereum) {
    uploadStatus.value = 'error'
    errorMessage.value = 'Please fill all the fields!'
    return
  }
  status.value = true
  try {
    const nftUrl = await uploadJSONToIPFS(form)
    console.log('nftUrl', nftUrl)
    // const priceWei = formatUnits(form.price, "ether");
    const priceWei = parseUnits(form.price.toString(), 'ether')
    const priceHex = toBeHex(priceWei)
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(
      Marketplace.address,
      Marketplace.abi,
      await signer,
    )
    const listingPrice = await contract.getListPrice()
    console.log('list', listingPrice)
    const transaction = await contract.createToken(nftUrl, priceHex, {
      value: listingPrice.toString(),
    })
    await transaction.wait()
    Message.success('Successfully listed your NFT!')
    // // 使用接口
    status.value = false
    formRef.value?.clearValidate()
    window.location.replace('/')
  } catch (e: any) {
    console.log('提交错误:', e)
    status.value = false
    Message.error(e.message || 'Listing failed, please try again')
  }
}
</script>
<style lang="scss" scoped>
:deep(.arco-form) {
  .arco-form-item-label-col > .arco-form-item-label {
    color: rgb(168 85 247);
  }

  // 针对 image 字段的 form-item 开启 flex 列布局
  .arco-form-item-wrapper-col {
    border-radius: 50%;
  }
  .arco-btn-secondary[type="button"] {
    font-weight: 500;
    color: white;
    background: #7b2cf9;
    border-radius: 0.25rem;

    // margin-right: 1rem;
    &:hover {
      background: #9c47ff;
    }
  }
}
</style>
