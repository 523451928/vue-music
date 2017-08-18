<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div ref="container">
      <h1 @click.stop="hideHistory">{{tips}}</h1>
      <div class="category">
        <span v-for="(item,index) in categoryArr" :class="{'current':item.name==tips}"
              @click="getData(item.url,item.name)">{{item.name}}</span>
      </div>
      <div class="recent-box">
        <input type="text" v-model="search" placeholder="请输入关键词" @focus="showHistory" @keydown.down="changeDown"
               @keydown.up="changeUp" @keydown.enter="searchMovie(search)">
        <span class="search" @click.enter="searchMovie(search)">查询</span>
        <ul class="recent" v-show="historyShow&&historyArr.length>0">
          <li @click="searchMovie(item)" @mouseenter="now=$index" v-for="(item,$index) in historyArr"
              :class="{current:$index==now}">{{item}}
            <a @click.stop="clearItem($index)" v-show="$index==now">删除</a><span v-show="$index!=now">历史记录</span>
          </li>
          <li class="last-li"><a @click="clearAll">全部删除</a></li>
        </ul>
      </div>
      <transition-group name="fade" tag="ul" class="movie_list clearfix content" mode="out-in" v-show="!usShow">
        <li v-for="(item,index) in list" :key="item">
          <router-link :to="{ path: '/detail/'+item.id}">
            <!--<div class="movie_list_img" :style="{ backgroundImage:'url('+item.images.large+')'}"-->
                 <!--:title="item.title"></div>-->
            <img v-lazy="{'src':item.images.large,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
            <div class="title">{{item.title}}({{item.year}})</div>
            <div class="original_title">{{item.original_title}}</div>
            <div class="original_title" style="padding-top:5px">{{item.genres ? item.genres.join("/") : ""}}</div>
            <v-star :score="item.rating.average" :size="starType" :showScore="true" ></v-star>
            <v-casts :directors="item.directors" :casts="item.casts" ref="casts"></v-casts>
            <v-follow :item="item" v-on:childToggle="toggleLike(item)" :styleObj="{'bottom':0,right:'-3px'}"></v-follow>
          </router-link>
        </li>
      </transition-group>
      <transition-group name="fade" tag="ul" class="movie_list movie-list-us clearfix content" mode="out-in"
                        v-show="usShow">
        <li v-for="(item,index) in usList" :key="item" style="height: 500px;">
          <router-link :to="{ path: '/detail/'+item.subject.id}">
            <span class="rank"
                  :class="{'first':item.rank==1,'second':item.rank==2,'third':item.rank==3}">{{item.rank}}</span>
            <span class="new" v-show="item.new">new</span>
            <div class="movie_list_img" :style="{ backgroundImage:'url('+item.subject.images.large+')'}"
                 :title="item.title"></div>
            <div class="title">{{item.subject.title}}</div>
            <div class="original_title">{{item.subject.year}}</div>
            <div class="original_title" style="padding-top:5px">
              {{item.subject.genres ? item.subject.genres.join("/") : ""}}
            </div>
            <v-star :score="item.subject.rating.average" :size="starType" :showScore="true"></v-star>
            <span class="box">{{item.box | box}}</span>
            <div class="cast">
              <p class="performer">导演：<span v-for="(director,index) in item.subject.directors">{{director.name}}</span>
              </p>
              <p class="performer" v-for="(avatar,index) in item.subject.casts">
                <span class="avatar" v-if="avatar.avatars">
                  <img :src="avatar.avatars.small"/>
                </span>
                <i>{{avatar.name}}</i>
              </p>
              <!--<v-follow :item="item" v-on:childToggle="toggleLike(item)"></v-follow>-->
              <!--<a class="love-heart" @click.stop.prevent="toggleLike(item)">-->
              <!--<em  :class="{'focus-out':!item.isLisk,'focus-in':item.isLike}"></em>-->
              <!--<i :class="{'focus-scale':item.isLike}"></i>-->
              <!--<span class="focus-info">{{item.isLike?"已关注":"关注"}}</span>-->
              <!--</a>-->
            </div>
          </router-link>
        </li>
      </transition-group>
      <div class="page" style="left: 50%; margin-left: -100px;width: 375px;" v-show="!usShow">
        <ul class="pageCon">
          <li v-for="i in parseInt(total/count)" :class="{active:activeIndex==i}" @click=pageHandle(i,$event)>{{i}}</li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
  const baseRequstUrl = "https://api.douban.com/";
  import Vue from "vue";
  import { mapState, mapMutations } from "vuex";
  import Casts from '../public/Casts.vue';
  import Star from '../public/Star.vue';
  import VStar from '../public/Star';
  import VCasts from '../public/Casts';
  import VFollow from '../public/Follow';
  export default{
    data: function () {
      return {
        tips: "Top250",
        list: [],
        usList: [],
        total: 0,
        count: 20,
        start: 0,
        activeIndex: 1,
        state: 0,
        search: "",
        historyShow: false,
        historyArr: [],
        followArr: [],
        now: 0,
        starType: "Small",
        usShow: false,
        categoryArr: [
          {'name': 'Top250', 'url': '/v2/movie/top250'},
          {'name': '北美票房榜', 'url': '/v2/movie/us_box'},
          {'name': '口碑榜', 'url': '/v2/movie/weekly'},
          {'name': '新片榜', 'url': '/v2/movie/new_movies'},
          {'name': '正在上映', 'url': '/v2/movie/in_theaters'},
          {'name': '即将上映', 'url': '/v2/movie/coming_soon'}
        ]
      }
    },
    computed: {
      ...mapState([
        'movieKey', 'movieArr', 'movieTotal', 'movieActive', 'movieState'
      ])
    },
    methods: {
      ...mapMutations([
        'setMovieKey', 'setMovie', 'setMovieTotal', 'setMovieActive', 'setMovieState'
      ]),
      getData: function (url, name) {
        const _this = this;
        this.$loading.open("加载中");
        var apiUrl = url || 'v2/movie/top250';
        var param = "";
        if (apiUrl == "/v2/movie/weekly" || apiUrl == "/v2/movie/new_movies") {
          this.$dialog.center("接口暂未开放");
          this.$loading.close();
          return;
        } else {
          param = "?count=" + _this.count + "&&start=" + _this.start;
        }
        this.start = 0;
        if (name) {
          this.tips = name;
        }
        this.$http.jsonp(baseRequstUrl + apiUrl + param).then(function (res) {
          if (apiUrl != '/v2/movie/us_box') {
            this.usShow = false;
            this.setMovieKey(name);
            this.list = res.body.subjects;
            this.$loading.close();
//            for (var i = 0; i < this.list.length; i++) {
//              for (var j = 0; j < this.followArr.length; j++) {
//                if (this.list[i].id == this.followArr[j].id) {
//                  this.$set(this.list[i], 'isLike', true);
//                }
//              }
//            }
            this.setLike(this.list,this.followArr);
            this.setMovie(_this.list);
            this.total = res.body.total;
            this.setMovieTotal(_this.total);
          } else {
            this.usShow = true;
            this.usList = res.body.subjects;
//            for (var i = 0; i < this.usList.length; i++) {
//              for (var j = 0; j < this.followArr.length; j++) {
//                if (this.usList[i].id == this.followArr[j].id) {
//                  this.$set(this.usList[i], "isLike", true);
//                }
//              }
//            }
            this.setLike(this.usList,this.followArr);
            this.$loading.close();
          }
        }, function () {
          _this.$loading.close();
          alert("fail");
        });
      },
      setLike: function (arr, compareArr) {
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < compareArr.length; j++) {
            if (arr[i].id == compareArr[j].id) {
              this.$set(arr[i], 'isLike', true);
            }
          }
        }
      },
      toggleLike: function (item) {
        this.$refs.casts[0].say();
        var now=new Date().getTime();
        this.$set(item,'joinTime',now);
        if (item.isLike === undefined) {
          this.$set(item, 'isLike', false);
        }
        item.isLike = !item.isLike;
        if (item.isLike) {
          this.followArr.unshift(item);
        } else {
          for (var i = 0; i < this.followArr.length; i++) {
            if (item.id == this.followArr[i].id) {
              this.followArr.splice(i, 1);
            }
          }
        }
        window.localStorage.setItem('followMovieArr', JSON.stringify(this.followArr));
      },
      hideHistory: function () {
        this.historyShow = false;
      },
      showHistory: function () {
        this.historyShow = true;
      },
      changeDown: function () {
        this.now++;
        if (this.now == this.historyArr.length) {
          this.now = 0;
        }
        this.search = this.historyArr[this.now];
      },
      changeUp: function () {
        this.now--;
        if (this.now == -1) {
          this.now = this.historyArr.length - 1;
        }
        this.search = this.historyArr[this.now];
      },
      searchMovie: function (key) {
        if (key) {
          this.activeIndex = 1;
          this.start = 0;
          this.search = key;
          this.setMovieKey(key);
        }
        if (this.search == "") {
          this.$dialog.center("请输入关键词");
          return;
        }
        this.$loading.open("加载中");
        this.historyShow = false;
        for (var i = 0; i < this.historyArr.length; i++) {
          if (this.search == this.historyArr[i]) {
            this.historyArr.splice(i, 1);
          }
        }
        this.historyArr.unshift(this.search);
        window.localStorage.setItem("historyArr", JSON.stringify(this.historyArr));
        this.$http.jsonp(baseRequstUrl + "v2/movie/search?q=" + this.search + "&&start=" + this.start).then(function (res) {
          this.usShow = false;
          this.list = res.body.subjects;
          this.setMovie(this.list);
          this.total = res.body.total;
          if (this.total == 0) {
            this.$dialog.center("抱歉，找不到" + this.search);
          }
          this.$loading.close();
          this.state = 1;
          this.setMovieState(1)
          this.tips = this.search;
        });
      },
      clearItem: function (i) {
        this.historyArr.splice(i, 1);
        window.localStorage.setItem("historyArr", JSON.stringify(this.historyArr));
      },
      clearAll: function () {
        this.historyArr = [];
        window.localStorage.clear();
      },
      pageHandle: function (index, obj) {
        //this.list = [];
        this.activeIndex = index;
        this.setMovieActive(index);
        this.start = (index - 1) * this.count + 1;
        if (this.state == 0) {
          this.getData();
        } else {
          this.searchMovie();
        }
        var ul = $(obj.path[1]);
        var li = $(obj.path[0]);
        var length = parseInt(this.total / this.count);
        var leftIndex = 0;
        change_page(index - 1);
        function change_page (eqindex) {
          if (eqindex < 0) {
            index = 0;
          }
          else if (eqindex >= length) {
            index = length - 1;
          }
          if (index - 5 <= 0) {
            leftIndex = 0;
          }
          else if (index > length - 10) {
            leftIndex = Math.ceil(length - 10);
          }
          else {
            leftIndex = index - 1;
          }
          ul.animate({"left": "-" + leftIndex * li.outerWidth() + "px"}, 200);
        }
      }
    },
    components: {
      VCasts,
      VStar,
      VFollow,
      "v-star": Star,
      'v-casts': Casts
    },
    filters: {
      box(val){
        return "票房：$" + val.toFixed(2);
      }
    },
    mounted: function () {
      if(!this.movieArr||this.movieArr.length==0){
        this.getData();
      }else{
        this.list=this.movieArr
      }
      if (this.movieKey != "") {
        //this.search = this.movieKey;
        this.tips = this.movieKey;
      }
//      this.$Lazyload.$on('loaded', function ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error }, formCache) {
//        console.log(el, src)
//      })

      if (this.bookTotal != "") {
        this.total = this.movieTotal;
      }
      if (this.movieActive != "") {
        this.activeIndex = this.movieActive;
      }
      if (this.movieState == 1) {
        this.state = this.movieState;
      }
      if (window.localStorage.getItem("historyArr") != null) {
        this.historyArr = JSON.parse(window.localStorage.getItem("historyArr"));
      }
      if (window.localStorage.getItem('followMovieArr') != null) {
        this.followArr = JSON.parse(window.localStorage.getItem("followMovieArr"));
      }
    }
  }
</script>
<style>
  * {
    padding: 0;
    margin: 0;
  }

  .love-heart {
    position: absolute;
    right: 0px;
    bottom: 10px;
    height: 50px;
    line-height: 72px;
  }

  .focus-out, .focus-scale, .focus-in {
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../assets/img/follow.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: 5px;
    left: 28px;
  }

  .focus-scale {
    background-position: left bottom;
    animation: focusedScale .5s 1 ease 0s;
  }

  .focus-out {
    background-position: left top;
  }

  .focus-in {
    background-position: left bottom;
  }

  .focus-info {
    color: #fff;
    font-size: 14px;
    display: block;
    width: 80px;
    text-align: center;
  }

  .star {
    float: none;
  }

  @keyframes focusedScale {
    0% {
      transform: scale(0, 0);
      -webkit-transform: scale(0, 0);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .5;
    }
    20% {
      transform: scale(.6, .6);
      -webkit-transform: scale(.6, .6);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .5;
    }
    40% {
      transform: scale(1.2, 1.2);
      -webkit-transform: scale(1.2, 1.2);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .5;
    }
    60% {
      transform: scale(1.5, 1.5);
      -webkit-transform: scale(1.5, 1.5);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .4;
    }
    80% {
      transform: scale(1.8, 1.8);
      -webkit-transform: scale(1.8, 1.8);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .3;
    }
    100% {
      transform: scale(2, 2);
      -webkit-transform: scale(2, 2);
      transform-origin: center center;
      -webkit-transform-origin: center center;
      opacity: .2;
    }
  }

  .avatar {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }

  .performer {
    text-align: left;
    line-height: 44px;
    color: #fff;
    height: 44px;
    position: relative;
    padding-left: 20px;
  }

  .performer i {
    font-style: normal;
    position: absolute;
    top: -1px;
    left: 70px;
  }

  .cast {
    position: absolute;
    width: 100%;
    height: 180px;
    background: rgba(0, 0, 0, 0.8);
    left: 0;
    bottom: -180px;
    transition: all .5s;
  }

  .box {
    color: #fff;
    position: absolute;
    bottom: 8px;
    width: 152px;
    right: 0;
  }

  .category {
    margin-bottom: 10px;
  }

  .category .current {
    background: #fff;
    color: #2ad487;
  }

  .category span {
    display: inline-block;
    padding: 2px 4px;
    height: 22px;
    line-height: 26px;
    cursor: pointer;
    background: #2ad487;
    color: #fff;
    margin: 2px;
    border-radius: 2px;
  }

  .current {
    background: #2ad487;
    color: #fff;
  }

  .recent-box {
    position: relative;
  }

  .recent {
    position: absolute;
    width: 380px;
    background: #fff;
    opacity: 0.9;
    margin: 0 auto;
    left: 50%;
    margin-left: -190px;
    z-index: 1000;
    color: #2ad487;
    text-align: left;
    top: 35px;
  }

  .recent li {
    padding: 5px;
  }

  .recent li span {
    float: right;
    color: #ccc;
  }

  .recent .last-li {
    border-top: 1px solid #ccc;
  }

  .recent li a {
    color: #000;
    float: right;
  }

  ul, li {
    list-style: none
  }

  .new {
    position: absolute;
    width: 30px;
    height: 18px;
    text-align: center;
    line-height: 18px;
    background: red;
    color: #fff;
    border-radius: 5px;
    right: 10px;
    top: 10px;
  }

  .search {
    width: 100px;
    height: 33px;
    text-align: center;
    line-height: 33px;
    display: inline-block;
    background: #2ad487;
    color: #fff;
    cursor: pointer;
    position: relative;
    top: 1px;
    left: -5px;
  }

  input {
    border: none;
    outline: none;
    height: 31px;
    border: 1px solid #2ad487;
    width: 270px;
  }

  body {
    background: #151515;
    font-family: "微软雅黑"
  }

  img {
    max-width: 100%
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
  }

  .clearfix {
  }

  .clearfix::after {
    content: "";
    width: 100%;
    height: 0;
    clear: both;
    display: block;
  }

  .content {
    width: 1200px;
    margin: 0 auto;
  }

  h1 {
    color: #2ad487;
    line-height: 80px;
    border-bottom: 3px solid #2ad487;
    background-color: #222;
    text-indent: 20px;
    margin-bottom: 20px;
    text-align: left;
  }

  .movie-list-us li {
    overflow: auto;
    height: 500px;
    position: relative;
  }

  ul.movie_list li {
    background: #222;
    float: left;
    width: 280px;
    margin: 10px; /*#2ad487*/;
    padding: 12px;
    height: 500px !important;
    transition: all 500ms;
    box-sizing: border-box;
    position: relative;
  }

  ul.movie_list li:hover {
    border-color: #2ad487;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -3px, 0);
    transform: translate3d(0, -3px, 0);
  }

  ul.movie_list li:hover .cast {
    bottom: 0px;
  }

  ul.movie_list li .movie_list_img {
    height: 350px;
    background-size: 100% 100%;
    margin-bottom: 10px
  }

  ul.movie_list li .title {
    color: #ddd;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 5px
  }

  ul.movie_list li .original_title {
    color: #999;
    font-size: 12px
  }

  .page {
    width: 300px;
    height: 30px;
    margin: 20px auto;
    color: #fff;
    position: relative;
    overflow: hidden;
  }

  ul.pageCon {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%
  }

  .rank {
    display: inline-block;
    color: #fff;
    border-radius: 50%;
    background: #2ad487;
    width: 28px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    margin-bottom: 4px;
  }

  .first {
    background: #FF6633;
  }

  .second {
    background: #3377cc;
  }

  .third {
    background: #42b983;
  }

  ul.pageCon li {
    float: left;
    height: 30px;
    line-height: 30px;
    background: #333;
    box-sizing: border-box;
    border: 1px solid #666;
    width: 30px;
    text-align: center;
    cursor: pointer;
  }

  ul.pageCon li.active {
    background: #2ad487
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
