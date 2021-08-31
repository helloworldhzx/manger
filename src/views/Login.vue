<template>
<div class="login_wrapper">
  <div class="modal">
    <el-form :model="user" :rules="rules" ref="ruleForm">
      <div class="title">zz</div>
      <el-form-item prop="userName">
        <el-input type='text' v-model="user.userName" />
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type='password' v-model="user.userPwd" />
      </el-form-item>
      <el-form-item>
        <el-button type='primary' class="bg" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
export default {
  name: 'Login',
  data(){
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
         userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
           userPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
      }
    }
  },
  methods: {
    login(){
      this.$refs.ruleForm.validate(valid => {
        if(valid){
          this.$api.login(this.user).then(res => {
            console.log(res)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.login_wrapper{
  width: 100vw;
  height: 100vh;
  background: #f9fcff;
  display: flex;
  justify-content: center;
  align-items: center;
  .modal{
    width: 500px;
    padding: 50px;
    background-color: #fff;
    box-shadow: 0 0 10px 5px #c7c9cb;
  }
  .title{
    font-size: 50px;
    margin-bottom: 30px;
    text-align: center;
    line-height: 1.5;
  }
  .bg{
    width: 100%;
  }
}
</style>
