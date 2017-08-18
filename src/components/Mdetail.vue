<template>
  <div class="movie_detail">
    <h1>音乐</h1>
    <div class="detail_con content clearfix">
      <div class="item1 clearfix">
        <div class="img_con left">
          <img :src="data.image" alt="点击看大图" title="点击看大图" @click="seeLargeImg(data.image)"/>
        </div>
        <div class="movie_con right">
          <h3>{{data.title }}</h3>
          <p>发布日期：{{pubdate}}</p>
          <p>演唱者：{{data.attrs.singer[0]}}</p>
          <div class="level clearfix">
            <div class="like" >
              评分{{data.rating.average}}  <span style="color: #ffffff">|</span>  {{data.rating.numRaters}}个人评价
            </div>
            <v-star :size="starType" :score="data.rating.average"  :showScore="true"></v-star>
          </div>
          <div class="des">
            简介：{{data.summary}}
            <br>
            标签: <span v-for="(tag,index) in data.tags">{{tag.name}} | </span>
          </div>
          <v-score :size="scoreType" v-on:change="changeRaters"></v-score>
          <router-link :to="{ path: '/music'}">
            <span class="play_con" style="display: inline-block;">
              立即返回
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <transition name="slide">
      <div class="img-box" v-show="showImg" @click="showImg=false">
        <img :src="data.image" width="200px"/>
      </div>
    </transition>
  </div>
</template>
<script>
  const baseRequstUrl = "https://api.douban.com/";
  import Star from '../public/Star.vue';
  import Score from '../public/Score.vue';
  export default{
    data(){
      return {
        data:{},
        starType:"Small",
        scoreType:"In",
        showImg:false
      }
    },
    computed:{
      pubdate(){
        return this.data.attrs.pubdate[0];
      }
    },
    methods:{
      getData(){
        this.$http.jsonp(baseRequstUrl + "v2/music/" + this.$route.params.id).then(function (res) {
          this.data = res.body;
        });
        this.$http.jsonp(baseRequstUrl+"v2/music/"+this.$route.params.id+"/tags").then(function(res){
          console.log(res);
        });
      },
      changeRaters(){
        this.data.rating.numRaters++;
        console.log("change");
      },
      seeLargeImg(src){
        this.showImg=true;
      }
    },
    watch:{
    '$route'(to, from) {
      this.getData()
    }
    },
    components:{
      'v-star':Star,
      'v-score':Score
    },
    mounted(){
      this.getData();
    }
  }
</script>
<style>
  .slide-enter-active, .slide-leave-active {
    transition: all 5s;
  }
  .slide-enter, .slide-leave-active {
    transform: translateX(-100%);
    opacity: 0
  }
  .img-box{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    position: absolute;
    top: 0;
  }
  .img-box img{
    margin-top: 200px;
  }
  .detail_con {
    padding-top: 20px
  }

  .img_con {
    width: 300px
  }

  .movie_con {
    width: 850px;
    color: #eee
  }
  .star{
    margin-top: 9px;
  }
  .movie_con h3 {
    font-size: 24px;
    margin-bottom: 20px
  }

  .movie_con p {
    line-height: 24px;
    color: #999;
    font-size: 14px
  }

  .movie_con .level {
    color: #EA9518;
    border-bottom: 1px solid #222;
    font-size: 14px
  }

  .movie_con .level .like {
    float: left;
    margin: 10px 20px 20px 0;
    cursor: pointer;
  }

  .movie_con .des {
    font-size: 14px;
    padding: 20px 0;
    line-height: 24px;
    height: 140px;
    overflow: auto
  }

  .movie_con .play_con {
    width: 200px;
    height: 50px;
    line-height: 50px;
    background: #009451;
    color: #fff;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
    margin-top: 20px;
  }

  .movie_con .play_con > img {
    margin-left: -25px;
    margin-right: 10px
  }
</style>
