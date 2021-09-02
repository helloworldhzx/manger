<template>
  <h1>welcome</h1>
  <el-button @click="goHome">登录</el-button>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
console.log(store.state.userInfo)
</script>

<style scoped>
</style>
