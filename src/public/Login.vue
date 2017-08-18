<template>
  <transition name="fade">
    <div class="login">
      <div class="login-box" @keyup.enter="loginFn">
        <span class="login-tital">登录QQ号</span>
        <input v-model="userid" placeholder="请输入QQ号"/>
        <span class="login-btn" @click="loginFn">登录</span>
      </div>
    </div>
  </transition>
</template>

<script>
  export default{
    data(){
      return {
        userid:""
      }
    },
    methods:{
      loginFn(){
        if(this.userid==""){
          this.$dialog.center("请输入QQ号")
        }else{
          this.$emit('loginFn',this.userid)
        }
      }
    }
  }
</script>

<style>
  .login{
    z-index: 1000;
    left: 0;
    top: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }
  .login-box{
    width: 400px;
    height: 180px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    border: 1px solid #42b983;
    background: #fff;
    border-radius: 4px;
  }
  .login-box input,.login-btn{
    text-indent: 10px;
    margin-top: 20px;
    display: inline-block;
    width: 300px;
    height: 38px;
    line-height: 38px;
    border-radius: 2px;
  }
  .login-tital{
    display: block;
    line-height: 40px;
    border-bottom: 1px solid #ddd;
  }
  .login-btn{
    background: #42b983;
    color: #fff;
    cursor: pointer;
    text-indent: 0;
  }
</style>
