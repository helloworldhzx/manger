<template>
  <div class="basic-layout">
    <div class="nav-side"></div>
    <div class="content-right">
      <div class="nav-top"></div>
      <div class="wrapper">
        <div class="main">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
</script>

<style lang='scss' scoped>
.basic-layout{
  position: relative;
  .nav-side{
    position: fixed;
    width: 200px;
    background: #001529;
    height: 100vh;
  }
  .content-right{
    margin-left: 200px;
    .nav-top{
      height: 50px;
    }
    .wrapper{
      padding: 20px;
      background: #eef0f3;
      height: calc(100vh - 50px);
      .main{
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
