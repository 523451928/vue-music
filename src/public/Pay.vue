<template>
  <div class="pay-wrapper">
    <div class="pay">
      <p>{{payTip}}<span class="close-ptn" @click="closePay">&times;</span></p>
      <!--<img width="300" src="../assets/img/pay.jpg">-->
      <div class="pay-nav">
        <ul>
          <li v-for="(item,index) in payArr" @click="changePay(index)" :class="{'active':index==payIndex,'wechat':index==0,'ali':index==1}">{{item}}</li>
        </ul>
      </div>
      <div class="img-wrapper">
        <img width="300" :src="imgSrc">
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      payTip:{
        type:String,
        default:"拿出您的微信扫一扫"
      }
    },
    computed:{
      imgSrc(){
        return this.imgSrcArr[this.payIndex]
      }
    },
    data(){
      return {
        imgSrcArr:["./static/pay.jpg","./static/alipay.jpg"],
        payArr:[
          '微信支付','支付宝支付'
        ],
        payIndex:0
      }
    },
    methods:{
      changePay(index){
        this.payIndex=index;
      },
      closePay(){
        this.$emit('closePay')
      }
    }
  }
</script>

<style>
  .pay-nav ul{
    display: flex;
  }
  .pay-nav li{
    height: 50px;
    line-height: 50px;
    color: #fff;
    overflow: hidden;
    width: 50%;
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #fff;
  }
  .pay-nav .wechat{
    background: #22ab39;
  }
  .pay-nav .ali{
    background: #019fe8;
  }
  .pay-nav li:before {
    content: "";
    position: absolute;
    width: 10px;
    height: 80px;
    top: 0;
    left: -150px;
    overflow: hidden;
    background: -webkit-linear-gradient(left,rgba(255,255,255,0) 0,rgba(255,255,255,0.4) 50%,rgba(255,255,255,0) 100%);
    -webkit-transform: skewX(-25deg);
    -moz-transform: skewX(-25deg);
    -o-transform: skewX(-25deg);
  }
  .img-wrapper{
    position: relative;
    overflow: hidden;
  }
  .img-wrapper:hover:before {
    left: 400px;
    transition: left 1s ease 0s;
  }
  .img-wrapper:before{
    content: "";
    position: absolute;
    width: 30px;
    height: 680px;
    top: 0;
    left: -250px;
    overflow: hidden;
    background: -webkit-linear-gradient(left,rgba(255,255,255,0) 0,rgba(255,255,255,0.4) 50%,rgba(255,255,255,0) 100%);
    -webkit-transform: skewX(-25deg);
    -moz-transform: skewX(-25deg);
    -o-transform: skewX(-25deg);
  }
  .pay-nav .active{
    border-color: #fff;
  }
  .pay-nav .active:before {
    left: 200px;
    -webkit-animation: translate 1.25s linear infinite;
    animation: translate 1.25s linear infinite;
    /*transition: left 1s ease 0s;*/
  }
  @-webkit-keyframes translate {
    0% { left:-120px; }
    25% { left:0px; }
    50% { left:70px; }
    75% { left: 140px; }
    100% { left: 200px; }
  }
  .pay-wrapper{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgba(0,0,0,0.6);
    z-index: 101;
  }
  .pay{
    background: #FFFFFF;
    margin: 50px auto;
    width: 300px;
    border-radius: 4px;
  }
  .pay p{
    line-height: 40px;
    background: #f5f5f5;
  }
  .close-ptn{
    color: #999999;
    font-size: 30px;
    cursor: pointer;
    float: right;
    margin-right: 10px;
    transition: all .5s;
  }
  .close-ptn:hover{
    color: #666666;
  }
</style>
