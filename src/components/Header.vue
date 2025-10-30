<template>
    <div>
        <div class="w-full">
            <div class="flex items-center flex-row justify-between bg-transparent pr-5 py-3 text-white">
                <router-link to="/" class="flex flex-row items-end app-logo ml-5 pb-2">
                    <img src="./full_logo.png" alt="NFT Marketplace" width="120" height="120"
                        class="inline-block -mt-2" />
                    <div class="inline-block font-bold text-xl ml-2">
                        NFT Marketplace
                    </div>
                </router-link>
                <div class="w-[40%]  flex flex-row items-center justify-evenly">

                    <ul class="flex font-[500] text-xl">
                        <li class=" hover:pb-0 p-2" v-for="(menu, index) in filteredRoutes" :key="menu.path" :class="{
                            'hover:border-b-2': pathname !== menu.path,
                            'border-b-2': pathname == menu.path,
                            'mr-4': index !== filteredRoutes.length - 1
                        }">
                            <router-link :to="menu.path">
                                {{ menu.meta.title }}
                            </router-link>
                        </li>
                    </ul>
                    <div class="flex justify-end items-end">
                        <a-button type="primary" @click="connectWebsite" size="large">{{ connected ? "Connected" :
                            "Connect Wallet"
                        }}</a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-white flex justify-end text-lx text-right mr-20 ">
            {{ addressText }}
        </div>
    </div>
</template>

<script lang="ts" setup>

import { routeState } from "@/router";
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { BrowserProvider } from "ethers";
defineOptions({
    name: "Header",
})
const route = useRoute();
const filteredRoutes = computed(() => routeState.visibleRoutes.value.filter(v => !v.path.includes('tokenId')));
// const filteredRoutes = computed(() => routeState.visibleRoutes.value);

console.log('filter', filteredRoutes);
const pathname = computed(() => route.path)

console.log(pathname);
const btnBg = ref<string>("rgb(34, 197, 94)");
const hoverBg = ref<string>("rgb(29, 78, 216)")
const usedChainId = ref<string>("0x7a69"); // localhost
// 连接状态
const connected = ref<boolean>(false);

// 当前metamesk地址
const currAddress = ref<string>("0x");
const addressText = computed(() => {
    console.log('add', currAddress.value === "0x")
    if (currAddress.value === "0x") {
        return "Not Connected. Please login to view NFT";
    } else {
        return `Connected to ${currAddress.value.slice(0,15)}...`;
    }
});
// 切换按钮样式
const updateButton = (bool: boolean) => {
    if (bool) {
        connected.value = true;
        btnBg.value = "rgb(29, 78, 216)";
        hoverBg.value = "rgb(34, 197, 94)";
    } else {
        connected.value = false;
        btnBg.value = "rgb(34, 197, 94)";
        hoverBg.value = "rgb(29, 78, 216)";
    }
}

// 连接钱包
const connectWebsite = async () => {
    if (!window.ethereum) return;
    // 强制进入本地模式
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== usedChainId.value) {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: usedChainId.value }],
        })
    }
    // 请求账户并刷新地址
    await window.ethereum.request({ method: "eth_requestAccounts" })
    getAddress();
    window.location.replace(pathname.value);
}
const getAddress = async () => {
    if (!window.ethereum) {
        updateButton(false);
        currAddress.value = '0x';
        return;
    }
    try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        currAddress.value = await signer.getAddress();
        updateButton(true);
    } catch (error) {
        currAddress.value = '0x';
        updateButton(false);
        console.log('获取地址失败：', error);
    }

}
onMounted(() => {
    if (!window.ethereum) {
        currAddress.value = '0x';
        updateButton(false);
        return;
    }
    const val = window.ethereum?.isConnected();
    console.log('val', val)
    if (val) {
        getAddress();

    } else {
        currAddress.value = '0x';
        updateButton(false);
    }

    // 监听账户变化事件
    window.ethereum.on("accountsChanged", function (accounts) {
        console.log('accounts', accounts)
        window.location.replace(location.pathname);
    });
    // return () => {
    //     window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    // };
})

watch(
    () => currAddress.value,
    () => {
        console.log('value', currAddress.value)
    })
</script>
<style scoped lang="scss">
.border-style {
    border: 1px solid red;
}

.bg-style {
    background: inherit;
}

.btn-style {
    &:hover {
        background-color: inherit;
    }
}

:deep(.arco-btn-primary[type='button']) {
    background: rgb(34, 197, 94);
    font-weight: 500;
    border-radius: .25rem;
    // margin-right: 1rem;

    &:hover {
        background: rgb(29, 78, 216);
    }
}



:deep(.arco-menu-light.arco-menu-horizontal) {
    background-color: inherit;
    color: white;
    transition: all 0.2s;
    font-weight: 600;
}

.app-logo {
    // pointer-events: none;
    cursor: pointer;
}

:deep(.arco-menu-light .arco-menu-item) {
    color: white;
    background-color: inherit;
    font-weight: 500;

    &:hover {
        color: white;
        background-color: transparent;
    }

    &.arco-menu-selected {
        color: white;
        transition: all 0.2s;
        font-weight: 600;

        &:hover {
            background-color: transparent;
        }
    }
}

:deep(.arco-menu-light.arco-menu-horizontal .arco-menu-item.arco-menu-selected:hover) {
    background-color: transparent;
}
</style>