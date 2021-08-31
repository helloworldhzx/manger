<template>
  <h1>login</h1>
  <router-link to="/welcome">首页</router-link>
</template>
<script>
export default {
  name: 'Login',
  mounted(){
    this.$storage.clearStorage('age')
    this.$request.get('/login', {}, {}).then(res => {
      console.log(res);
    })
  }
}
</script>

<style scoped>
</style>
