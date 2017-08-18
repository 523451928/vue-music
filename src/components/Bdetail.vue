<template>
  <div class="movie_detail">
    <h1>图书详情</h1>
    <div class="detail_con content clearfix">
      <div class="item1 clearfix">
        <div class="img_con left">
          <a :href="data.alt" target="_blank">
            <img :src="data.images?data.images.large:''"/>
          </a>
        </div>
        <div class="movie_con right">
          <h3>{{data.title }}</h3>
          <p>{{data.binding}}</p>
          <p>分类：{{data.publisher}}</p>
          <p>作者：{{data.author?data.author.join("/"):""}}</p>
          <div class="level clearfix">
            <div class="like" >
              页数{{data.pages}}
            </div>
            <div class="like">
              价钱{{data.price}} <span>   &nbsp;&nbsp;{{data.rating?data.rating.numRaters:""}}个人评价</span>
            </div>
            <v-star :size="starSize" :score="data.rating?data.rating.average:''" :showScore="true"></v-star>
          </div>
          <div class="des">
            简介：{{data.summary}}
          </div>
          <p class="catalog">
              {{data.catalog}}
          </p>
          <router-link :to="{ path: '/book'}">
            <div class="play_con">
              立即返回
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const baseRequstUrl = "https://api.douban.com/";
  import Star from '../public/Star.vue';
  import VStar from '../public/Star';
  export default{
    data(){
      return {
        data:{},
        starSize:"Small"
      }
    },
    computed:{

    },
    components:{
      VStar,
      'v-star':Star
    },
    watch:{
      '$route'(to,from){
        this.getData()
      }
    },
    methods:{
      getData(){
        this.$http.jsonp(baseRequstUrl + "v2/book/" + this.$route.params.id).then(function (res) {
          this.data = res.body;
          console.log(this.data);
        });
      }
    },
    mounted(){
      this.getData();
    }
  }
</script>
<style>
  .detail_con {
    padding-top: 20px
  }
  .movie_con .catalog{
    white-space:pre;
    text-align: left;
    color: #ffffff;
  }
  /*.star{float: inherit;}*/
  .img_con {
    width: 300px
  }

  .movie_con {
    width: 850px;
    color: #eee
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
