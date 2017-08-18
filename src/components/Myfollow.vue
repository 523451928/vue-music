<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div class="follow">
      <div>
        <h1>我的关注</h1>
      </div>
      <ul class="tab clearfix">
        <li v-for="(item,index) in tabArr" @click="choiceFolow(item.code,index)" :class="{'active':activeIndex==index}"  v-drag="{'color':'#fff'}">
          {{item.text}}
        </li>
      </ul>
      <div class="tab-content" :style="styleObj">
        <div class="tab-book">
          <input type="text" v-model="queryBook" placeholder="过滤关注的图书" v-show="bookArr.length!=0">
          <transition-group name="fade" tag="ul" class="movie_list clearfix content" mode="out-in">
            <li v-for="(item,index) in filterBook" :key="item" style="height: 500px">
              <router-link :to="{ path: '/bdetail/'+item.id}">
                <div class="movie_list_img" :style="{ backgroundImage:'url('+item.images.large+')'}"
                     :title="item.title"></div>
                <div class="title">{{item.title}}</div>
                <div class="original_title">{{item.price || "暂无价格"}}</div>
                <div style="height: 26px;overflow: hidden;">
                  <span class="tag_title" v-for="(tag,index) in item.tags " v-if="index<5">{{tag.name}}</span>
                </div>
                <v-star :size="starSize" :score="item.rating?item.rating.average:''" :showScore="true"></v-star>
                <span class="join-time">关注时间{{item.joinTime | formatDate("yyyy-MM-dd hh:mm:ss")}}</span>
                <span class="remove" @click.stop.prevent="remove(index)">删除</span>
              </router-link>
            </li>
          </transition-group>
          <p v-show="bookArr.length==0">{{noneMsg}}</p>
        </div>
        <div class="tab-movie">
          <input type="text" v-model="queryMovie" placeholder="过滤关注的电影" v-show="movieArr.length!=0">
          <transition-group name="fade" tag="ul" class="movie_list clearfix content" mode="out-in">
            <li v-for="(item,index) in filterMovies" :key="item" style="height:500px">
              <router-link :to="{ path: '/detail/'+item.id}">
                <div class="movie_list_img" :style="{ backgroundImage:'url('+item.images.large+')'}"
                     :title="item.title"></div>
                <div class="title">{{item.title}}({{item.year}})</div>
                <div class="original_title">{{item.original_title}}</div>
                <div class="original_title" style="padding-top:5px">{{item.genres ? item.genres.join("/") : ""}}</div>
                <v-star :score="item.rating.average" :size="starSize" :showScore="true"></v-star>
                <span class="join-time">关注时间{{item.joinTime | formatDate("yyyy-MM-dd hh:mm:ss")}}</span>
                <span class="remove" @click.stop.prevent="remove(index)">删除</span>
                <v-casts :directors="item.directors" :casts="item.casts"></v-casts>
              </router-link>
            </li>
          </transition-group>
          <p v-show="movieArr.length==0">{{noneMsg}}</p>
        </div>
        <div class="tab-music">
          <input type="text" v-model="queryMusic" placeholder="过滤关注的音乐" v-show="musicArr.length!=0">
          <transition-group name="fade" tag="ul" class="music-list clearfix content" mode="out-in">
            <li v-for="(item,index) in filterMusic" :key="item">
              <router-link :to="{ path: '/mdetail/'+item.id}">
                <div class="left-con">
                  <img :src="item.image" height="80">
                  <span>{{item.title}}</span>
                </div>
                <div class="right-con">
                  <p>出版日期 : {{item.attrs.pubdate ? item.attrs.pubdate[0] : "暂无"}}</p>
                  <p>歌手 : {{singer.length > 1 ? singer.join("|") : singer[0]}}</p>
                  <p class="tag">
                    <span v-for="(tag,index) in item.tags">{{tag.name}}</span>
                  </p>
                  <v-star :size="starSize" :score="item.rating?item.rating.average:''"></v-star>
                  <i class="join-time">关注时间:{{item.joinTime | formatDate("yyyy-MM-dd hh:mm:ss")}}</i>
                  <span class="remove" @click.stop.prevent="remove(index)">删除</span>
                </div>
              </router-link>
            </li>
          </transition-group>
          <p v-show="musicArr.length==0">{{noneMsg}}</p>
        </div>
      </div>
      <transition name="fade">
        <v-confrim :msg="confirmTip" v-show="comfirmShow" @sureFn="sureFn" @cancelFn="cancelFn"></v-confrim>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Star from "../public/Star.vue"
  import Cast from "../public/Casts.vue"
  import Confirm from '../public/Confirm.vue'
  import Drag from '../directive/drag.js'
  import FormatDate from '../filters/formatDate.js'
  import { mapState, mapMutations } from 'vuex'
  export default{
    computed: {
      ...mapState([
        'followObj'
      ]),
      singer(){
        for (var i = 0; i < this.musicArr.length; i++) {
          return this.musicArr[i].attrs.singer;
        }
      },
      filterMovies () {
        var self = this
        return self.movieArr.filter(function (movie) {
          return movie.title.indexOf(self.queryMovie) !== -1 || movie.year.indexOf(self.queryMovie) !== -1;
        })
      },
      filterMusic(){
        return this.musicArr.filter(music => music.title.indexOf(this.queryMusic) !== -1);
      },
      filterBook(){
        return this.bookArr.filter(book => book.title.indexOf(this.queryBook) !== -1);
      }
    },
    data(){
      return {
        tabArr: [
          {text: "我的图书", code: "followBookArr"},
          {text: "我的电影", code: "followMovieArr"},
          {text: "我的音乐", code: "followMusicArr"}
        ],
        starSize: 'Small',
        bookArr: [],
        movieArr: [],
        activeIndex: "q",
        noneMsg: "",
        index: "",
        musicArr: [],
        styleObj: {},
        confirmTip: "确认删除吗？",
        comfirmShow: false,
        queryMovie: "",
        queryMusic: "",
        queryBook: ""
      }
    },
    methods: {
      ...mapMutations(
        ['setFollowObj']
      ),
      choiceFolow(code, index){
        switch (code) {
          case 'followBookArr':
            this.bookArr = JSON.parse(window.localStorage.getItem(code)) == null ? [] : JSON.parse(window.localStorage.getItem(code));
            this.noneMsg = "暂无关注的图书!";
            this.styleObj = {
              transform: 'translateX(0%)'
            };
            break;
          case 'followMovieArr':
            this.movieArr = JSON.parse(window.localStorage.getItem(code)) == null ? [] : JSON.parse(window.localStorage.getItem(code));
            this.noneMsg = "暂无关注的电影!";
            this.styleObj = {
              transform: 'translateX(-33.3%)'
            };
            break;
          case 'followMusicArr':
            this.musicArr = JSON.parse(window.localStorage.getItem(code)) == null ? [] : JSON.parse(window.localStorage.getItem(code));
            this.noneMsg = "暂无关注的音乐!";
            this.styleObj = {
              transform: 'translateX(-66.6%)'
            };
            break;
        }
        this.setFollowObj({
          'code': code,
          'index': index
        });
        this.activeIndex = index;
      },
      cancelFn(){
        this.comfirmShow = false;
      },
      sureFn(){
        switch (this.activeIndex) {
          case 0 :
            this.bookArr.splice(this.index, 1);
            window.localStorage.setItem("followBookArr", JSON.stringify(this.bookArr));
            break;
          case 1 :
            this.movieArr.splice(this.index, 1);
            window.localStorage.setItem("followMovieArr", JSON.stringify(this.movieArr));
            break;
          case 2 :
            this.musicArr.splice(this.index, 1);
            window.localStorage.setItem("followMusicArr", JSON.stringify(this.musicArr));
            break;
        }
        this.comfirmShow = false;
      },
      remove(i){
        this.comfirmShow = true;
        this.index = i;
      }
    },
    components: {
      "v-star": Star,
      "v-confrim": Confirm,
      "v-casts": Cast
    },
    directives:{
      drag:Drag
    },
    filters:{
      formatDate:FormatDate
    },
    mounted(){
      if (this.followObj.code) {
        this.choiceFolow(this.followObj.code, this.followObj.index);
      }
    }
  }
</script>

<style>
  .join-time{
    font-size: 14px;
    color: #fff;
    display: inline-block;
    font-style: normal;
  }
  .follow input {
    text-indent: 5px;
  }

  .fade-enter-active, .fade-leave-active, .fade-enter-active .confirm-wrapper, .fade-leave-active .confirm-wrapper {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .fade-enter .confirm-wrapper, .fade-leave-active .confirm-wrapper {
    transform: scale(0.5);
    opacity: 0;
  }

  .tab-music .remove, .remove {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: #fff;
    display: block;
    width: 50px;
    height: 20px;
    background: #ff6633;
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
    z-index: 1000;
  }

  .follow .tab li {
    padding: 3px 6px;
    border-radius: 4px;
  }

  .follow .tab .active {
    background: #42b983;
  }

  .tab {
    margin-left: 350px;
  }

  .tab-content {
    display: flex;
    color: #ffffff;
    width: 300%;
    transition: all 0.5s;
  }

  .tab-content div {
    width: 100%;
  }

  .tab-content li {
    text-align: left;
  }

  .tab li {
    list-style: none;
    float: left;
    color: #ffffff;
    margin: 10px;
    cursor: pointer;
  }

  .tab-content .music-list li {
    height: 140px;
    padding-top: 38px;
    border: 1px solid #666;
    margin: 4px;
    overflow: hidden;
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);
  }

  .tab-content .left-con {
    width: 26%;
    float: left;
    margin-left: 20px;
    color: #fff;
  }

  .tab-content .left-con span {
    width: 60%;
    display: inline-block;
  }

  .tab-content .right-con {
    width: 70%;
    float: left;
    color: #2ad487;;
  }

  .right-con span {
    display: inline-block;
    height: 20px;
    line-height: 24px;
    margin: 2px;
    border-radius: 4px;
    padding: 2px 4px;
    background: #2ad487;
    color: #FFFFFF;
  }

  ul.music-list li:hover {
    border-color: #2ad487;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);
  }

  .right-con .star {
    margin: 0 auto;
    float: none;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden
  }

  .clearfix {
    *+height: 1%;
  }
</style>
