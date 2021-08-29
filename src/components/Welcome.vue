<template>
  <h1>welcome</h1>
  <el-button @click="goHome">登录</el-button>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push("/login")
}
</script>

<style scoped>
</style>
