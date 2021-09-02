<template>
  <div class="welcome">
    <!-- <div class="content">
      <div class="title">zz</div>
      <div class="text">vue3+elementPlus+koa2</div>
      <div class="desc">
        ——和所有以梦为詹的诗人一在了可，我借此火得度一生的茫茫黑夜。
      </div>
    </div>
    <div class="img"></div> -->
  </div>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
console.log(store.state.userInfo);
</script>

<style scoped lang='scss'>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .content {
    position: relative;
    bottom: 40px;
    .title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .text {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .decs {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img {
    margin-left: 100px;
    width: 371px;
    height: 438px;
    background: url("../assets/images/welcome.png");
  }
}
</style>
