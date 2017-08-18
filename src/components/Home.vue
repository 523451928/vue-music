<template>
  <transition name="slide">
    <div class="home">
      <div class="home-wrapper">
        <div class="shoufa-page">
          <h3 class="page-title">
            <span>精彩推荐</span>
          </h3>
          <div class="recommend-wrapper">
            <v-swiper v-if="shoufaData" :swiperList="firstData.focus" :isFormat="isFormat" :duration="4000"></v-swiper>
          </div>
        </div>
        <div class="hot-page">
          <h3 class="page-title">
            <span>热门歌单</span>
          </h3>
          <div class="hot-wrapper">
            <v-swiper v-if="shoufaData" :swiperList="firstData.hotdiss.list" :isFormat="!isFormat" :duration="40000"></v-swiper>
          </div>
        </div>
        <div class="top-page">
          <h3 class="page-title">
            <span>排行榜</span>
          </h3>
          <div class="top-wrapper">
            <ul class="toplist-wrapper">
              <li v-for="(item,index) in firstData.toplist">
                <div class="bg" :class="{'bg-one':index==0,'bg-two':index==1,'bg-three':index==2,'bg-four':index==3}"></div>
                <div class="mask"></div>
                <p class="list-name-s">{{item.ListName.split('·')[0]}}</p>
                <h3 class="list-name-b">{{item.ListName.split('·')[1]}}</h3>
                <ul class="toplist-songlist">
                  <li v-for="(song,idx) in item.songlist">
                    <p>{{idx+1}} <a @click="toSongDetail(song)"  :href="`https://y.qq.com/n/yqq/song/${song.songid}_num.html#`" target="_blank">{{song.songname}}</a></p>
                    <p class="singer-name" @click="toSinger(song,false)"><a :href="`https://y.qq.com/n/yqq/singer/${song.singerid}_num.html#`" target="_blank">{{song.singername}}</a></p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div class="mv-page">
          <h3 class="page-title">
            <span>MV首播</span>
          </h3>
          <div class="shoufa-wrapper">
            <div class="shoufa-nav">
              <span v-for="(nav,key) in shoufaData" @click="changeArea(key)" :class="{'active':key==areaKey}">{{key=='all'?'全部':key=='neidi'?'内地':key=='gangtai'?'港台':key=='oumei'?'欧美':key=='japan'?'日本':key=='korea'?'韩国':key}}</span>
            </div>
            <div class="shoufa-mv-list">
              <transition-group name="fade" tag="ul" class="clear-fix" v-if="shoufaData">
                <li v-for="(mv,index) in shoufaData[areaKey]" :key="mv">
                  <a :href="`https://y.qq.com/n/yqq/mv/v/${mv.vid}.html`" target="_blank">
                    <div class="shoufa-img">
                      <img
                        v-lazy="{'src':mv.picurl,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                      <i class="icon-play"></i>
                    </div>
                  </a>
                  <p class="mv-title">{{mv.mvtitle}}</p>
                  <p class="singer-name" @click="toSinger(mv,true)">{{mv.singer_name}}</p>
                  <p class="listen-num">{{mv.listennum | formatListen}}</p>
                </li>
              </transition-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {getFirstPage} from '../api/musicapi'
  import {mapMutations} from 'vuex'
  import Swiper from './qmusic/Swiper.vue'
  export default{
    data(){
      return {
        firstData:{},
        areaKey:'all',
        isFormat:false
      }
    },
    computed:{
      shoufaData(){
        if(this.firstData.shoubomv){
//          delete this.firstData.shoubomv.all
        }
        return this.firstData.shoubomv
      }
    },
    methods:{
      ...mapMutations(
        ['setSinger','setSingerShow','setSongName']
      ),
      toSongDetail(song){
        return
        this.setSongName(song.songname)
        this.$router.push(`/qmusic/songdetail/${song.singerid}`)
      },
      toSinger(singer,flag){
        if(flag){
          this.$router.push(`/qmusic/singer/${singer.singer_mid}`)
          this.setSinger({
            'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.singer_mid}.jpg?max_age=2592000`,
            'id':singer.singer_mid,
            'name':singer.singer_name
          },{})
          this.setSingerShow(false)
        }else{
          return
          this.$router.push(`/qmusic/singer/${singer.singerid}`)
          this.setSinger({
            'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.singerid}.jpg?max_age=2592000`,
            'id':singer.singerid,
            'name':singer.singername
          },{})
        }
      },
      changeArea(key){
        this.areaKey=key
      }
    },
    mounted(){
      getFirstPage().then((res)=>{
        this.firstData=res.data
      })
    },
    filters:{
      formatListen(val){
        return val/10000>=1?(val/10000).toFixed(1)+'万':val==0?'最新上架':val
      }
    },
    components:{
      'v-swiper':Swiper
    }
  }
</script>

<style>
  .q-music .toplist-songlist li a{
    color: #fff;
  }
  .toplist-wrapper .singer-name{
    text-align: left;
    text-indent: 12px;
    color: #cccccc;
  }
  .q-music .toplist-songlist  .singer-name a{
    color: #cccccc;
  }
  .toplist-wrapper .list-name-s{
    text-align: center;
    z-index: 10;
    position: relative;
    margin-top: 50px;
    font-size: 21px;
  }
  #app .q-music .toplist-wrapper li:hover .mask{
    opacity: .4;
  }
  #app .q-music .toplist-wrapper li:hover .bg{
    transform: scale(1.1);
  }
  .toplist-wrapper .mask{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    z-index: 1;
    background: #000;
    opacity: 0;
    transition: all .3s;
  }
  .toplist-wrapper .list-name-b{
    text-align: center;
    z-index: 10;
    position: relative;
    font-weight: 400;
    font-size: 36px;
  }
  #app .q-music .toplist-wrapper li{
    overflow: hidden;
    position: relative;
    height: 567px;
    width: 25%;
    color: #fff;
  }
  .top-wrapper{
    width: 1200px;
    height: 567px;
    margin: 0 auto;

  }
  .toplist-wrapper .bg{
    transition: all .3s;
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    z-index: 0;
    background: url("https://y.gtimg.cn/mediastyle/yqq/img/bg_index_top.jpg?max_age=2592000&v=2591d4829162dfda6b9112c771edda86") no-repeat;
  }
  .toplist-wrapper .bg-one{
    background-position: 0px 0px;
  }
  .toplist-wrapper .bg-two{
    background-position: -300px 0px;
  }
  .toplist-wrapper .bg-three{
    background-position:-600px 0px ;
  }
  .toplist-wrapper .bg-four{
    background-position:-900px 0px ;
  }
  .top-page{
    padding: 50px 0;
    width: 100%;
    background: #121212 url(https://y.gtimg.cn/mediastyle/yqq/img/bg_index_top2.jpg) 50% 0 no-repeat;
    min-height: 500px;
  }
  .top-page .page-title{
    margin-bottom: 30px;
  }
  .hot-page .page-title{
    margin-top: 20px;
  }
  .hot-page .page-title span{
    color: #333;
  }
  .listen-num{
    font-size: 14px;
    color: #666666;
    text-align: center;
    margin-top: 5px;
  }
  .singer-name{
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    text-align: center;
  }
  .singer-name:hover{
    color: #42b983;
  }
  .mv-title{
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #333;
    margin: 10px auto 3px auto;
  }
  .mv-page{
    background: #e6e6e6;
    padding-top: 50px;
  }

  .shoufa-img{
    position: relative;
    overflow: hidden;
  }
  .shoufa-img img{
    transition: all .5s;
    min-height: 171px;
  }
  .shoufa-img:hover .icon-play{
    transform: scale(1);
  }
  .shoufa-img:hover img{
    transform: scale(1.1);
  }
  .mv-page .page-title span{
    color: #333;
  }
  #app .q-music .toplist-songlist{
    width: 180px;
    margin: 80px auto 0 auto;
  }
  #app .q-music .toplist-songlist li{
    width: 100%;
    height: 60px;
    position: relative;
    z-index: 10;
    float: inherit;
  }
  #app .q-music .shoufa-mv-list li{
    float: left;
    width: 25%;
    height: 260px;
    margin-top: 15px;
  }
  .shoufa-wrapper,.recommend-wrapper,.hot-wrapper{
    color: #fff;
    width: 1180px;
    margin: 50px auto;
    position: relative;
  }
  .recommend-wrapper{
    width: 100%;
  }
  .shoufa-nav{
    text-align: center;
  }
  .shoufa-nav span{
    display: inline-block;
    cursor: pointer;
    margin: 10px 35px;
    color: #999;
  }
  .shoufa-nav span:hover{
    color: #333;
  }
  .shoufa-nav .active{
    color: #333;
  }
  .shoufa-page{
    height: 714px;
    background: url("https://y.gtimg.cn/mediastyle/yqq/img/bg_index_new.jpg") repeat-x;
    padding-top: 20px;
  }
  .page-title{
    text-align: center;
  }
  .page-title span{
    color: #fff;
    font-weight: normal;
    font-size: 36px;
    height: 40px;
    line-height: 40px;
    position: relative;
  }
  .page-title span:after{
    content: '';
    position: absolute;
    width: 100px;
    height: 1px;
    background: #666;
    top: 19px;
    left: 180px;
    display: inline-block;
  }
  .page-title span:before{
    content: '';
    position: absolute;
    width: 100px;
    height: 1px;
    background: #666;
    top: 19px;
    right: 180px;
    display: inline-block;
  }
  .home {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: 40px 0;
    margin-top: 30px;
  }
  .home .home-wrapper{
    width: 100%;
    position: relative;
    margin:0 auto;
  }
</style>
