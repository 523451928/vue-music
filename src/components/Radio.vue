<template>
  <transition name="slide">
    <div class="radio">
      <div class="radio-wrapper clear-fix">
        <div class="radio-siderbar" ref="siderbar">
          <span class="siderbar-item" v-for="(item,index) in radioList"   :class="{'current':index==currentIndex}"><i @click="changeRadio(index)">{{item.name}}</i></span>
        </div>
        <div class="radio-container">
          <div class="radio-item" v-for="(item,index) in radioList">
            <h4 class="radio-title" :id="index">{{item.name}}</h4>
            <div class="radio-list-wrapper">
              <ul class="clear-fix">
                <li class="radio-list-item" v-for="(radio,idx) in item.radioList">
                  <div class="radio-box">
                    <div class="radio-img-box">
                      <a :href="`https://y.qq.com/portal/player_radio.html#id=${radio.radioId}`" target="_blank">
                        <img
                          v-lazy="{'src':radio.radioImg,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                        <i class="icon-play"></i>
                      </a>
                    </div>
                    <a :href="`https://y.qq.com/portal/player_radio.html#id=${radio.radioId}`" target="_blank">{{radio.radioName}}</a>
                    <p>播放量: {{radio.listenNum |formatListen}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {getRadiolist} from '../api/musicapi'
  export default{
    data(){
      return {
        radioList:[],
        currentIndex:0
      }
    },
    methods:{
      changeRadio(index){
        this.currentIndex=index
        document.body.scrollTop = document.getElementById(index).offsetTop-10
      }
    },
    filters:{
      formatListen(val){
        return (val/10000).toFixed(1)+'万'
      }
    },
    mounted(){
      getRadiolist().then((res)=>{
        this.radioList=res.data.data.groupList
        this.$nextTick(()=>{
          var titles=document.getElementsByClassName('radio-title')
          var deltaArr=[]
          for(var i=0;i<titles.length;i++){
            deltaArr.push(titles[i].getBoundingClientRect().top)
          }
          this.deltaArr=deltaArr
        })
      })
      var self=this
      window.onscroll=function(){
        self.deltaArr.forEach((item,index)=>{
          if(document.getElementsByTagName('body')[0].scrollTop>item-20){
            self.currentIndex=index
          }
        })
        if(self.$refs.siderbar){
          if(document.getElementsByTagName('body')[0].scrollTop>200){
            self.$refs.siderbar.style.top=0
          }else{
            self.$refs.siderbar.style.top=(210-document.getElementsByTagName('body')[0].scrollTop)+'px'
          }
        }
      }
    }
  }
</script>

<style>
  .radio-img-box{
    position: relative;
    width: 225px;
    height: 230px;
    overflow: hidden;
  }
  .radio-siderbar .current{
    color: #42b983;
    background: none;
  }
  .radio-siderbar .current:after{
    content: "";
    position: absolute;
    height: 1px;
    width: 37px;
    overflow: hidden;
    left: 0;
    top: 50%;
    background-color: #42b983;
  }

  .radio-img-box img{
    transition: all .5s;
  }
  .radio-img-box:hover .icon-play{
    transform: scale(1);
  }
  .radio-img-box:hover img{
    transform: scale(1.1);
  }
  .icon-play{
    cursor: pointer;
    display: inline-block;
    position: absolute;
    width: 70px;
    height: 70px;
    left: 50%;
    top:50%;
    margin-left: -35px;
    margin-top: -35px;
    transition: all .5s;
    background: url("./qmusic/cover_play.png");
    transform: scale(0);
  }
  .radio-container{
    margin-top: 18px;
    width: 86%;
    float: left;
    margin-left: 12%;
  }
  .radio-box{
    margin: 0 20px 0 20px;
  }
  .q-music .radio-box a{
    color: #333;
    font-size: 14px;
  }
  .q-music .radio-box a:hover{
    color: #42b983;
  }
  .radio-box p{
    color: #999;
    font-size: 14px;
  }
  .radio-list-wrapper{
    width: 100%;
  }
  #app .q-music .radio-list-item{
    width: 25%;
    float: left;
    padding-bottom: 20px;
  }
  .radio-title{
    position: relative;
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    color: #999;
    margin-bottom: 38px;
    font-size: 15px;
  }
  .radio-title:after{
    content: "";
    position: absolute;
    height: 1px;
    overflow: hidden;
    left: 43px;
    right: 0;
    top: 10px;
    background-color: #ececec;
  }
  .radio {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: 40px 0;
    margin-top: 30px;
  }
  .radio .radio-wrapper{
    width: 1180px;
    margin:0 auto;
  }
  .radio-siderbar{
    background: url("./qmusic/radio_sidebar.png") 0 1px no-repeat;
    position: fixed;
    top:210px;
    transition: all .1s;
  }

  .radio-siderbar .siderbar-item{
    position: relative;
    display: block;
    padding-left: 63px;
    line-height: 59px;
    font-size: 15px;
    width: 38px;
  }
  .radio-siderbar .siderbar-item i{
    font-style: normal;
    cursor: pointer;
    user-select: none;
  }
  .radio-siderbar .siderbar-item i:hover{
    color: #42b983;
  }
</style>
