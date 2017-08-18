<template>
  <transition name="slide">
    <div class="digital-wrapper">
      <div class="digital-box">
        <v-swiper :isFormat="false" :isDigital="true" :swiperList="swiperList" v-if="swiperList.length>0"></v-swiper>
      </div>
      <div class="digital-main" v-for="(item,index) in contentList">
        <div class="mod-part">
          <div class="part-hd">
            <h2>{{item.title?item.title:item.type=='newupload'?'最新上架':item.type=='yinyueren'?'音乐人专区':'本周热销'}}</h2>
          </div>
          <div >
              <ul class="digital-list clearfix">
                <li class="digital-list-item" v-for="(degital,idx) in item.albumlist">
                  <div class="digital-list-item-box">
                    <div class="digital-img-box" @click="toDetail(degital)">
                      <img :src="`//y.gtimg.cn/music/photo_new/T002R300x300M000${degital.album_mid}.jpg?max_age=2592000`" onerror="this.src='//y.gtimg.cn/mediastyle/yqq/extra/player_cover.png?max_age=31536000';this.onerror=null;">
                    </div>
                    <div class="item-title">{{degital.album_name}}</div>
                    <div class="item-author"><a @click="toSinger(degital)">{{degital.singer_name}}</a></div>
                    <div class="item-price"><i>￥</i>{{degital.dis_price/100}}</div>
                  </div>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import VSwiper from './qmusic/Swiper.vue'
  import {mapMutations} from 'vuex'
  import {getDigital,getDigitalDetail} from '../api/musicapi'
  export default{
    data(){
      return {
        digitalObj:{},
        swiperList:[]
      }
    },
    computed:{
      contentList(){
        var arr=[]
        if(this.digitalObj.content){
          for(var i=0;i<this.digitalObj.content.length;i++){
            this.digitalObj.content[i].albumlist=this.digitalObj.content[i].albumlist.slice(0,5)
            arr.push(this.digitalObj.content[i])
          }
        }
        return arr
      }
    },
    methods:{
      ...mapMutations(
        ['setSinger']
      ),
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.singer_mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.singer_mid}.jpg?max_age=2592000`,
          'id':singer.singer_mid,
          'name':singer.singer_name
        },{})
      },
      toDetail(digital){
        console.log(digital)
        this.$router.push(`/qmusic/degitaldetail/${digital.album_id}`)
      }
    },
    filters:{
      currency(val){
        return "￥"+parseFloat(val/100)
      }
    },
    mounted(){
      getDigital().then((res)=>{
        this.digitalObj=res.data
        this.swiperList=res.data.banner
      })
    },
    components:{
      VSwiper
    }
  }
</script>

<style>
  #app .q-music  .digital-list .digital-list-item{
    width: 20%;
    float: left;
  }
  .digital-img-box{
    width: 100%;
    overflow: hidden;
  }
  .digital-img-box :hover{
    transform: scale(1.1);
  }
  .digital-img-box img{
    cursor: pointer;
    transition: all .5s;
  }
  #app .q-music li .item-title,#app .q-music li .item-author a{
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    width: 100%;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #app .q-music li .item-author a:hover{
    color: #42b983;
  }
  #app .q-music li .item-price{
    color: #666;
    font-size: 16px;
  }
  #app .q-music li .item-price i{
    font-size: 12px;
    font-style: normal;
  }
  .digital-list .digital-list-item .digital-list-item-box{
    width: 90%;
    padding-right: 10%;
  }
  .digital-wrapper .digital-main{
    width: 1180px;
    margin: 10px auto;
  }
  .part-hd h2{
    text-align: left;
    font-size: 24px;
    font-weight: 400;
    line-height: 58px;
    color: #333;
  }
  .digital-wrapper{
    margin-top: 20px;
    width: 100%;
    padding: 30px 0;
    background: #fff;
  }
  .digital-box{
    width: 1180px;
    text-align: left;
    margin: 0 auto;
  }
</style>
