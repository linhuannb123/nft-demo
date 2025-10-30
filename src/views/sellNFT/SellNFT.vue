<template>
    <div class="flex justify-center w-full place-items-center pt-10">
        <a-form :model="form" ref="formRef" @submit="listNFT" size="lg" :layout="layout"
            class="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4" :label-col-props="labelColProps"
            :wrapper-col-props="wrapperColProps" style="width: 456px;">
            <h3 className="text-center text-base font-bold text-purple-500 mb-8 ">
                Upload your NFT to the marketplace
            </h3>
            <a-form-item field="name" label="NFT Name" :rules="rules.name" validate-trigger="blur" class="mb-4">
                <a-input v-model="form.name" placeholder="Axie#4563" />
                <template #extra>
                    <div>Used to login</div>
                </template>
            </a-form-item>
            <a-form-item field="description" label="NFT Description" :rules="rules.description" validate-trigger="blur"
                class="mb-6">
                <a-textarea v-model="form.description" :auto-size="autoSize" placeholder="Axie Infinity Collection"
                    :max-length="100" allow-clear show-word-limit />
            </a-form-item>
            <a-form-item field="price" label="Price (in ETH)" :rules="rules.price" validate-trigger="blur" class="mb-6">
                <a-input-number v-model="form.price" :default-value="0" mode="button" :step="0.01" size="" :min="0.01" placeholder="Min 0.01 ETH" />
            </a-form-item>
            <a-form-item field="image" label="Upload Image (<500 KB)" validate-trigger="input" class="mb-6">
                <input type="file" @change="OnChangeFile" placeholder="Upload your NFT image" />
            </a-form-item>
            <a-form-item>

                <a-button type="primary" @click="listNFT" :disabled="status" size="large" style="width: 100%;">List
                    NFT</a-button>

            </a-form-item>

        </a-form>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { isStrctEmptyStr } from '@/market';
import { NFTFrom, uploadFileToIPFS, uploadJSONToIPFS } from '@/pinata';
import { FileItem, Message } from '@arco-design/web-vue';
import { BrowserProvider, Contract, formatUnits, hexlify, parseUnits, toBeHex } from 'ethers';
import { reactive, ref } from 'vue';

import Marketplace from '@/Marketplace.json';
// $refs.formRef.resetFields()
defineOptions({
    name: 'ListMyNFT',
})


const status = ref<boolean>(false);
const formRef = ref<any>(null);
const layout = ref<string>("vertical")
const form = reactive<NFTFrom>({
    name: '',
    description: '',
    price: 0,
    image: '',
})
console.log(import.meta.env.VITE_APP_PINATA_JWT)
const header = ref({
    // Authorization: `Bearer ${import.meta.env.VITE_APP_PINATA_JWT}`,
    pinata_api_key: `${import.meta.env.VITE_APP_PINATA_KEY}`,
    pinata_secret_api_key: `${import.meta.env.VITE_APP_PINATA_SECRET}`,
})
const autoSize = ref({
    minRows: 5,
    maxRows: 5
})
const labelColProps = ref({
    span: 24,
    offset: 0
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
//             debugger;
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

// }
const OnChangeFile = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const fileList = input?.files as unknown as any[];
    console.log('file', input?.files)
    if (fileList.length > 0) {
        status.value = true;
        const fileItem = fileList[0];
        console.log('file', fileItem)
        const imgUrl = await uploadFileToIPFS(fileItem);
        console.log('imgUrl', imgUrl);
        // 提取原始 File 对象
        try {
            const imgUrl = await uploadFileToIPFS(fileItem);
            if (imgUrl) {
                form.image = imgUrl; // 预览图地址
                status.value = false;
            }
        } catch (e) {
            status.value = false;
            Message.error('Image upload failed, please try again');
            formRef.value?.clearValidate("image");
        }
    }
};

const wrapperColProps = ref({
    span: 24,
    offset: 0
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
    price:
        [
            { required: true, message: 'price is required' },
            { type: 'number', min: 0.01, message: 'price is min than 0.01' }
        ],
    // 其他规则保持不变...
    image: [
        { type: 'string', minLength: 1, message: 'please upload at least one image' },
        {
            validator: (_: any, value: any[]) => {
                if (value.some(item => item.size > 500 * 1024)) { // 500KB 转字节
                    return new Error('Image size should be less than 500 KB');
                }
                return true;
            },
            trigger: 'input'
        }
    ],
};

// 更新和验证表单
const updateMetadataToIPFS = async () => {

}

const listNFT = async (e: Event) => {
    e.preventDefault();
    console.log('form', form)
    await formRef.value.validate();
    if (!form.image || isStrctEmptyStr(form.image) || !window.ethereum) {
        return;
    }
    status.value = true;
    try {
        debugger;
        const nftUrl = await uploadJSONToIPFS(form);
        console.log('nftUrl', nftUrl);
        // const priceWei = formatUnits(form.price, "ether");
        const priceWei = parseUnits(form.price.toString(), "ether");
        const priceHex= toBeHex(priceWei);
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(Marketplace.address, Marketplace.abi, await signer);
        const listingPrice = await contract.getListPrice();
        console.log('list', listingPrice)
        const transaction = await contract.createToken(nftUrl, priceHex, {
            value: listingPrice.toString(),
        })
        await transaction.wait();
        alert("Successfully listed your NFT!");
        // // 使用接口
        status.value = false;
        formRef.value?.clearValidate();
        window.location.replace("/");
    } catch (e) {
        console.log('提交错误:', e);
        status.value = false
    }


}
// const handleSubmit = ({ values: any, errors }) => {
//     console.log('values:', values, '\nerrors:', errors)
// }
</script>
<style lang="scss" scoped>
:deep(.arco-form) {
    .arco-form-item-label-col>.arco-form-item-label {
        color: rgb(168, 85, 247);
    }

    .arco-btn-secondary[type='button'] {
        background: #7B2CF9;
        font-weight: 500;
        border-radius: .25rem;
        color: white;
        // margin-right: 1rem;
        &:hover {
            background: #9C47FF;
        }
    }
}
</style>