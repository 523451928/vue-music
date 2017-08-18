<template>
  <div class="mv-list">
    <ul class="clear-fix">
      <li v-for="(item,index) in mvList">
        <div class="mv-box">
          <a :href="`https://y.qq.com/n/yqq/mv/v/${item.vid}.html`" target="_blank">
            <div class="mv-img-box">
              <img
                v-lazy="{'src':item.pic||`//shp.qpic.cn/qqvideo_ori/0/${item.vid}_360_204/0`,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
              <i class="icon-play"></i>
            </div>
          </a>
          <p class="mv-title">{{item.title || item.mvtitle}}</p>
          <p class="mv-nick" v-if="nickShow">{{item.upload_nick}}</p>
          <p class="listen-num" v-if="item.listenCount>0">播放量：{{item.listenCount | formatListen}}</p>
          <p class="listen-num" v-if="item.singername">{{item.singername }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default{
    props:{
      mvList:{
//        type:Array,
//        default:[]
      },
      nickShow:{
        type:Boolean,
        default:false
      }
    },
    filters:{
      formatListen(val){
        return val/10000>=1?(val/10000).toFixed(1)+'万':val
      }
    }
  }
</script>

<style>
  #app .q-music .mv-list li{
    width: 20%;
  }
  .mv-title{
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mv-nick{
    font-size: 14px;
    color: #999999;
    text-align: center;
  }
  .singer-detail h2{
    margin: 20px 0 5px 0;
    font-weight: normal;
  }
  #app .q-music .mv-list .mv-img-box{
    position: relative;
    width: 210px;
    height: 113px;
    margin-right: 20px;
  }
  .album-name{
    margin: 12px 0;
    color: #333;
    font-style: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 18px;
    line-height: 18px;
  }
  .pub-time{
    color: #999;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 14px;
    line-height: 14px;
  }
  .album-list{
    padding-bottom: 20px;
  }
  #app .q-music .album-list li{
    float: left;
    width: 20%;
  }
  .album-list li .album-box img{
    transition: all .5s;
  }
</style>
