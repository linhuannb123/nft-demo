<template>
  <div class="min-h-full app-bg flex flex-col">
    <Header class="flex flex-col" />

    <main class="w-full">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts">
import Header from '@/components/Header.vue'
defineOptions({
  name: 'App',
})
</script>
<style scoped lang="scss">
.logo {
  height: 6em;
  padding: 1.5em;
  transition: filter 300ms;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-weight: 400;
  line-height: 1.5;
  color: rgb(255 255 255 / 87%);
  color-scheme: light dark;
  background-color: #242424;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  font-family: Poppins, sans-serif;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app-bg {
  background: url("@/assets/images/bg.png") no-repeat;
  background-size: 100% 100%;
}
a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}
.menu-demo {
  box-sizing: border-box;
  width: 100%;
  padding: 40px;
  background-color: var(--color-neutral-2);
}
h1 {
  font-size: 3.2em;
  line-height: 1.1;
  transform: scale(1.05, 1.05);
}
button {
  padding: 0.6em 1.2em;
  font-family: inherit;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  background-color: #1a1a1a;
  border: 1px solid transparent;
  border-radius: 8px;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
.card {
  padding: 2em;
}
#app {
  max-width: 1280px;
  padding: 2rem;
  margin: 0 auto;
  text-align: center;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
</style>
