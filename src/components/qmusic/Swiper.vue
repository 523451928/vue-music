<template>
  <div class="swiper">
      <div class="swiper-container-recommend swiper-container"  v-if="isFormat" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="isFormat" v-for="(list,index) in formatList">
            <div v-for="(item,idx) in list" class="imgbox-wrapper"  :class="{'swiper-single':idx%2==0}">
              <a  @click.prevent="toPlaylistDetail(item.dissid)" :href="`https://y.qq.com/n/yqq/playlist/${item.dissid}.html#`" target="_blank">
                <div class="img-box">
                  <img :src="item.imgurl"/>
                  <i class="icon-play"></i>
                </div>
              </a>
              <p class="playlist-title">{{item.dissname}}</p>
              <p class="playlist-num">播放量：{{item.listennum | formatListen}}</p>
            </div>
          </div>
          <div class="swiper-slide" v-if="!isFormat" v-for="(item,index) in formatList">
            <a :href="hrefArr[index]" target="_blank">
              <img :src="item.pic" :title="item.title">
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <div class="swiper-container-hot swiper-container"  v-if="!isFormat&&!isDigital" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="isFormat" v-for="(list,index) in formatList" >
            <div v-for="(item,idx) in list">
              <img :src="item.imgurl"/>
            </div>
          </div>
          <div class="swiper-slide" v-if="!isFormat" v-for="(item,index) in formatList">
            <a :href="hrefArr[index]" target="_blank">
              <img :src="item.pic" :title="item.title">
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>

      <div class="swiper-container-digital swiper-container"  v-if="!isFormat&&isDigital" >
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in swiperList">
            <a @click.stop="toDetial(item)" >
              <img :src="item.picurl" :title="item.intro">
            </a>
          </div>
        </div>
        <div class="swiper-pagination"></div>

        <!-- 如果需要导航按钮 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
  </div>
</template>

<script>
  export default{
    props:{
      swiperList:{
        type:Array,
        default: function () {
          return [ ]
        }
      },
      isFormat:{
        type:Boolean,
        default:false
      },
      isDigital:{
        type:Boolean,
        default:false
      },
      duration:{
        type:Number,
        default:4000
      }
    },
    computed:{
      formatList(){
        if(this.isFormat){
          var num = 4
          var arr = this.swiperList.slice(0,12)
          var Arr = new Array(Math.ceil(arr.length/num))
          for(var i = 0; i<Arr.length;i++){
            Arr[i] = new Array()
            for(var j = 0; j<num; j++){
              Arr[i][j] = ''
            }
          }
          for(var i = 0; i<arr.length;i++){
            Arr[parseInt(i/num)][i%num] = arr[i]
          }
          return Arr
        }else{
          return this.swiperList
        }
      },
      hrefArr(){
        var idArr=[]
        this.formatList.forEach((item,index)=>{
          if(item.id){
            if(item.id.indexOf('http')!=-1) {
              idArr.push(item.id)
            } else{
              idArr.push(`https://y.qq.com/n/yqq/album/${item.id}.html`)
            }
          }else{
              idArr.push(`https://y.qq.com/n/yqq/album/${item.album_id}.html`)
          }
        })
        return idArr
      }
    },
    watch:{
      $route(to){
//        if(to.path=='/qmusic/home'){
//          this.mySwiper.reLoop()
//          this.mySwiper.startAutoplay()
//          this.mySwiper.slideNext()
//        }
      }
    },
    methods:{
      toPlaylistDetail(id){
        this.$router.push(`/qmusic/playlistdetail/${id}`)
      },
      toDetial(item){
        this.$router.push(`/qmusic/degitaldetail/${item.album_id}`)
      }
    },
    filters:{
      formatListen(val){
        return val/10000>=1?(val/10000).toFixed(1)+'万':val
      }
    },
    mounted(){
      if(!this.isFormat){
        if(!this.isDigital){
          var mySwiper = new Swiper('.swiper-container-recommend', {
            direction: 'horizontal',
            loop: true,
            autoplay : this.duration,
            // 如果需要分页器
            pagination: '.swiper-pagination',

            // 如果需要前进后退按钮
            nextButton: '.swiper-button-next',
            prevButton: '.swiper-button-prev',
            paginationClickable:true
          })
        }else{
          if(this.swiperList.length>0){
            var mySwiper = new Swiper('.swiper-container-digital', {
              direction: 'horizontal',
              loop: true,
              autoplay : 50000,
              // 如果需要分页器
              pagination: '.swiper-pagination',

              // 如果需要前进后退按钮
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              paginationClickable:true,
              effect : 'coverflow',
              slidesPerView: 3,
              centeredSlides: true,
              coverflow: {
                rotate: 30,
                stretch: 10,
                depth: 60,
                modifier: 2,
                slideShadows : true
              },
              effect : 'flip',
              flip: {
                slideShadows : true,
                limitRotation : true,
              }
            })
          }
        }
      }else if(!this.isDigital){
        var mySwiper = new Swiper('.swiper-container-hot', {
          direction: 'horizontal',
          loop: true,
          autoplay : this.duration,
          // 如果需要分页器
          pagination: '.swiper-pagination',

          // 如果需要前进后退按钮
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          paginationClickable:true,
//          effect : 'coverflow',
//          slidesPerView: 3,
//          centeredSlides: true,
//          coverflow: {
//            rotate: 30,
//            stretch: 10,
//            depth: 60,
//            modifier: 2,
//            slideShadows : true
//          }
          effect : 'flip',
          flip: {
            slideShadows : true,
            limitRotation : true,
          }
        })
      }

    }
  }
</script>

<style>
  .swiper-container-digital{
    width: 1080px;
    margin: 20px auto;
  }
  .imgbox-wrapper .img-box{
    position: relative;
    /*width: 224px;*/
    max-height: 295px;
    overflow: hidden;
  }
  .imgbox-wrapper .img-box img{
    transition: all .5s;
    margin-top: 0;
  }
  .img-box:hover .icon-play{
    transform: scale(1);
  }
  .img-box:hover img{
    transform: scale(1.1);
  }
  .playlist-title{
    display: inline-block;
    position: relative;
    max-width: 100%;
    padding: 0 26px;
    height: 22px;
    margin: 30px 0;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .playlist-num{
    display: inline-block;
    width: 100%;
    text-align: center;
  }
  .swiper-slide .imgbox-wrapper{
    float: left;
    width: 25%;
    background: rgba(0,0,0,.8);
    height: 465px;
  }
  .swiper-slide .swiper-single{
    background: rgba(0,0,0,.6);
  }
  .swiper-slide div:hover{
    background: #42b983;
  }
  .swiper-slide a{
    color: #fff;
  }
  .recommend-wrapper .swiper{
    width: 1180px;
    margin: 0 auto;
  }
 .recommend-wrapper .swiper img{
    width: 100%;
  }
  .recommend-wrapper .swiper-pagination{
    width: 1000px;
    left: 90px;
  }
  .recommend-wrapper .swiper-pagination-bullet, .hot-wrapper .swiper-pagination-bullet{
    width: 30px;
    margin-right: 10px;
    background: #FFFFFF;
    height: 2px;
    border-radius: 0;
  }
  .recommend-wrapper .swiper-pagination-bullet:hover,.hot-wrapper .swiper-pagination-bullet:hover{
    opacity: 1;
  }
</style>
