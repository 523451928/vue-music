<template>
  <div class="smask">
    <div class="confirm-wrapper">
      <div class="tip">{{msg}}<slot></slot></div>
      <div class="btn-wrapper">
        <span class="sure-btn" @click="sureFn">确认</span>
        <span class="cancel-btn" @click="cancelFn">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props:['msg'],
    methods:{
      sureFn(){
        this.$emit("sureFn");
      },
      cancelFn(){
        this.$emit("cancelFn");
      }
    }
  }
</script>

<style>
  .smask{
    width: 100%;
    height:100%;
    position: fixed;
    z-index: 9999;
    left: 0;
    top:0;
    background: rgba(0,0,0,0.6);
  }
  .confirm-wrapper{
    text-align: center;
    width: 360px;
    height: 120px;
    border:1px solid #ccc;
    position: fixed;
    top:50%;
    margin-top:-80px;
    left: 50%;
    margin-left:-200px;
    background: #fff;
    border-radius: 10px;
  }
  .btn-wrapper .sure-btn{
    width: 120px;
    height: 36px;
    border-radius:4px;
    display: inline-block;
    text-align: center;
    line-height: 38px;
    border:1px solid #5cb85c;
    color: #999;
    margin-right: 20px;
    cursor: pointer;
  }
  .confirm-wrapper .tip{
    color: #000;
    margin: 30px;
    font-size: 20px;
  }
  .btn-wrapper{
    margin-top: -16px;
  }
  .btn-wrapper .cancel-btn{
    width: 120px;
    height: 36px;
    border-radius:4px;
    display: inline-block;
    text-align: center;
    line-height: 38px;
    border:1px solid #ff6633;
    color: #999;
    cursor: pointer;
  }
  .btn-wrapper .cancel-btn:hover,.btn-wrapper .sure-btn:hover{
    color: #000;
  }
</style>
