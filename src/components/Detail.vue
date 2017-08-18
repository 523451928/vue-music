<template>
  <div class="movie_detail">
    <h1>电影详情</h1>
    <div class="detail_con content clearfix">
      {{message}}
      <div class="item1 clearfix">
        <div class="img_con left">
          <a :href="data.alt" target="_blank">
            <img :src="data.images?data.images.large:'' "/>
          </a>
        </div>
        <div class="movie_con right">
          <h3 v-drag="{'color':'#009451'}">{{data.title}} ({{data.year }})</h3>
          <p>{{data.original_title}}</p>
          <p>别名：{{data.aka ? data.aka.join("|") : ""}}</p>
          <p>国家：{{data.countries ? data.countries[0] : ""}}</p>
          <p>分类：{{data.genres ? data.genres.join("/") : ""}}</p>
          <p>导演：<a v-for="item in data.directors" :href="item.alt" style="color: #fff;" target="_blank">{{item.name}}</a></p>
          <p>主演：{{mainPerson}}</p>
          <div class="level clearfix">
            <div class="like" @click.once="data.wish_count++">
              喜欢{{data.wish_count}}
            </div>
            <div class="like" @click="data.collect_count++">
              人气{{data.collect_count}}
            </div>
            <v-star :size="starSize" :score="data.rating?data.rating.average:''"  :showScore="true"></v-star>
          </div>
          <div class="des">
            简介：{{data.summary}}
          </div>
          <!--<router-link :to="{ path: '/movie'}">-->
            <!--<div class="play_con" @click="back">-->
              <!--立即返回-->
            <!--</div>-->
          <!--</router-link>-->
          <div class="play_con" @click="back">
            立即返回
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const baseRequstUrl = "https://api.douban.com/";
  import percent from "../filters/percent";
  import drag from "../directive/drag";
  import Star from '../public/Star.vue'
  export default{
    data: function () {
      return {
        message: "正在加载...",
        like: false,
        yes: false,
        data: [],
        starSize:'In'
      }
    },
    computed: {
      likeImg: function () {
        return this.like ? "images/like_a.png" : "images/like.png"
      },
      yesImg: function () {
        return this.yes ? "images/yes_a.png" : "images/yes.png"
      },
      mainPerson: function () {
        let arr = [];
        if (this.data.casts) {
          for (let i = 0; i < this.data.casts.length; i++) {
            arr.push(this.data.casts[i].name);
          }
          return arr.join(" | ")
        }
        else {
          return ""
        }
      }
    },
    filters: {
      percent,
      resever:function(val){
        return val==undefined?" " : val.split("").reverse().join("");
      }
    },
    directives:{
      drag
    },
    methods: {
      getDate: function () {
        const _this = this;
        this.$http.jsonp(baseRequstUrl + "v2/movie/subject/" + this.$route.params.id).then(function (res) {
          _this.data = res.body;
        });
      },
      back(){
        window.history.go(-1);
      }
    },
    components:{
      "v-star":Star
    },
    watch: {
      data: function () {
        this.message = "";
      },
      $route(to,from){
        this.getDate()
      }
    },
    created: function () {
      this.getDate()
    }
  }
</script>
<style>
  .detail_con {
    padding-top: 20px;
  }

  .img_con {
    width: 300px;
  }

  .movie_con {
    width: 850px;
    color: #eee;
  }

  .movie_con h3 {
    font-size: 24px;
    margin-bottom: 20px
  }
  .star{
    float: left;
    margin-top:7px;
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
