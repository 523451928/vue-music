<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div>
      <div>
        <h1>{{tips}}</h1>
        <input type="text" v-model="search" placeholder="请输入关键词" @keyup.enter="searchBook(1)"/><span class="search" @click="searchBook(1)">搜索</span>
      </div>
      <div v-if="bookList.length===false" class="read-list-wrapper">
        <div class="read-list">
          <ul class="clearfix">
            <li v-for="(item,index) in readTextArr" @click="code=item.code">{{item.text}}</li>
          </ul>
          <transition-group name="fade" tag="div" class="movie_list clearfix content" mode="out-in">
            <div class="read-content" v-for="(item,index) in readObj[code]" :key="item" v-html="item.content"></div>
          </transition-group>
        </div>
      </div>
      <transition-group name="fade" tag="ul" class="movie_list clearfix content" mode="out-in">
        <li v-for="(item,index) in bookList" :key="item" style="height: 500px" @mouseenter="showSummary($event,item)"
            @mouseleave="summaryShow=false">
          <router-link :to="{ path: '/bdetail/'+item.id}">
            <!--<div class="movie_list_img" :style="{ backgroundImage:'url('+item.images.large+')'}"-->
                 <!--:title="item.title"></div>-->
            <img v-lazy="{'src':item.images.large,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
            <div class="title">{{item.title}}</div>
            <div class="original_title">{{item.price || "暂无价格"}}</div>
            <div style="height: 26px;overflow: hidden;">
              <span class="tag_title" v-for="(tag,index) in item.tags " v-if="index<5">{{tag.name}}</span>
            </div>
            <v-star :size="starSize" :score="item.rating?item.rating.average:''" :showScore="true"></v-star>
            <v-follow :item="item" v-on:childToggle="toggleLike(item)"></v-follow>
          </router-link>
        </li>
      </transition-group>
      <transition name="fade">
        <div class="summary" :style="styleObj" v-show="summaryShow">
          <h4>作者：{{bookAuthor.length > 0 ? bookAuthor.join(",") : "暂无"}}</h4>
          <h5> 出版日期：{{bookPubdate}}</h5>
          <p style="max-height: 100px;">作者简介：{{authorIntro.length > 0 ? authorIntro : "暂无"}}</p>
          <p style="max-height: 292px;">简介：{{bookSummary.length > 0 ? bookSummary : "暂无"}}</p>
          <p class="publisher">{{publisher}}</p>
        </div>
      </transition>
      <div v-show="bookList.length>0" class="page">
        <span class="previous" :class="{'dis':activeIndex==1}" @click="previousPage">上一页</span>
        <div class="pageBox">
          <ul class="pageCon">
            <li v-for="i in pageNum" :class="{active:activeIndex==i}" @click=pageHandle(i,$event)>{{i}}</li>
          </ul>
        </div>
        <span class="next" :class="{'dis':activeIndex==pageNum}" @click="nextPage">下一页</span>
        <button class="go-page" @click="goPage">跳转至</button>
        <input class="page-num" type="text" v-model="pageNumber"/>
      </div>
    </div>
  </transition>
</template>

<script>
  const baseRequstUrl = "https://api.douban.com/";
  import $ from "jquery";
  import { mapState, mapMutations } from "vuex";
  import Search from "../public/Search.vue";
  import Star from "../public/Star.vue";
  import Follow from "../public/Follow.vue";
  import {topicList} from '../api/musicapi'
  export default{
    data: function () {
      return {
        search: "",
        tips: "图书",
        start: 0,
        bookList: [],
        readObj:{},
        code:'t1',
        readTextArr:[
          {
            "text":"读一区",
            "code":"t1"
          },
          {
            "text":"读二区",
            "code":"t2"
          },
          {
            "text":"读三区",
            "code":"t3"
          }
        ],
        count: 20,
        total: 0,
        activeIndex: 1,
        pageNumber: 1,
        starSize: 'Small',
        styleObj: {
          left: "0px",
          top: "0px"
        },
        summaryShow: false,
        followArr: [],
        bookAuthor: "",
        bookSummary: "",
        bookPubdate: "",
        authorIntro: "",
        publisher: ""
      }
    },
    methods: {
      ...mapMutations([
        'setSearch', 'setBook', "setTotal"
      ]),
      showSummary(e, item){
        this.summaryShow = true;
        var left = (e.target.offsetLeft + e.target.offsetWidth + 10) + "px";
        var top = e.target.offsetTop + "px";
        this.styleObj = {"left": left, "top": top}
        this.bookAuthor = item.author;
        this.bookSummary = item.summary;
        this.bookPubdate = item.pubdate;
        this.authorIntro = item.author_intro;
        this.publisher = item.publisher;
      },
      searchBook(reset){
        if (reset == 1) {
          this.start = 0;
          this.activeIndex = 1;
        }
        if (this.search == "") {
          this.$dialog.center("搜索内容不能为空", {
            "background": "#fff",
            "color": "#2ad487"
          });
          return;
        }
        this.$loading.open("加载中");
        this.tips = this.search;
        this.setSearch(this.search);
        this.$http.jsonp(baseRequstUrl + "/v2/book/search?q=" + this.search + "&&start=" + this.start).then(function (res) {
          this.bookList = res.body.books;
          this.setBook(this.bookList);
          if (this.bookList.length == 0) {
            this.$dialog.center("抱歉，暂无该书信息", {
              "background": "#fff",
              "color": "#2ad487"
            });
          }
          for (var i = 0; i < this.bookList.length; i++) {
            for (var j = 0; j < this.followArr.length; j++) {
              if (this.bookList[i].id == this.followArr[j].id) {
                this.$set(this.bookList[i], "isLike", true);
              }
            }
          }
          this.total = res.body.total;
          this.setTotal(this.total);
          this.$loading.close();
        }, function (res) {
          this.$dialog(res)
        });
      },
      toggleLike: function (item) {
        var now=new Date().getTime();
        this.$set(item,'joinTime',now);
        if (item.isLike == undefined) {
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
        window.localStorage.setItem('followBookArr', JSON.stringify(this.followArr));
      },
      goPage(){
        if (this.pageNumber > 20) {
          this.$dialog.center("没有更多的页数了");
          return;
        }
        this.start = (this.pageNumber - 1) * this.count + 1;
        this.searchBook();
        this.activeIndex = this.pageNumber;
        this.changePage();
      },
      previousPage(){
        if (this.activeIndex == 1) {
          return;
        } else {
          this.pageHandle(--this.activeIndex);
        }
      },
      nextPage(){
        if (this.activeIndex == this.pageNum) {
          return;
        }
        this.pageHandle(++this.activeIndex);
      },
      pageHandle: function (index, obj) {
        //this.bookList = [];
        this.activeIndex = index;
        this.pageNumber = index;
        this.start = (index - 1) * this.count + 1;
        this.searchBook();
        this.changePage(index - 1);
      },
      changePage: function () {
        var ul = $(".pageCon");
        var li = ul.find("li");
        var length = this.pageNum;
        var leftIndex = 0;
        leftIndex = this.activeIndex - 6;
        leftIndex = leftIndex > length - 10 ? 10 : leftIndex;
        ul.animate({"left": "-" + leftIndex * li.outerWidth() + "px"}, 200);
      }
    },
    filters: {},
    computed: {
      ...mapState([
        'searchKey', 'bookArr', 'bookTotal'
      ]),
      pageNum(){
        return parseInt(this.total / this.count) > 20 ? 20 : parseInt(this.total / this.count);
      }
    },
    mounted(){
      if (this.searchKey != "") {
        this.search = this.searchKey;
        this.tips = this.searchKey;
      }
      ;
      if (this.bookArr.length > 0) {
        this.bookList = this.bookArr;
      }
      ;
      if (this.bookTotal != "") {
        this.total = this.bookTotal;
      }
      if (window.localStorage.getItem("followBookArr") != null) {
        this.followArr = JSON.parse(window.localStorage.getItem("followBookArr"));
      }
//      this.$loading('加载中...')
//      topicList().then((res)=>{
//        this.$loading.close()
//        this.readObj=res.data.content
//        console.log(this.readObj)
//      })
    },
    components: {
      Search,
      "v-star": Star,
      "v-follow": Follow
    }
  }
</script>

<style>
  .read-list li{
    margin-right: 5px;
    cursor: pointer;
  }
  .read-content{
    text-align: left;
    color: #333333;
    margin-top: 20px;
  }
  .read-list-wrapper{
    background: #fff;
  }
  .read-list{
    width: 1200px;

    margin:0 auto;
    margin-top: 20px;
  }
  .read-list li{
    float: left;
  }
  .summary {
    width: 300px;
    height: 500px;
    position: absolute;
    background: #cab192;
    color: #fff;
    text-shadow: 1px 1px 2px #ccc;
  }

  .publisher {
    position: absolute;
    bottom: 2px;
    right: 2px;
  }

  .summary p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space:;
    padding: 5px;
    text-align: left;
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
  }

  img {
    max-width: 100%
  }

  .go-page {
    width: 50px;
    position: absolute;
    top: 0;
    right: 670px;
    height: 33px;
  }

  .page-num {
    position: absolute;
    top: 0;
    right: 633px;
    width: 30px;
    text-align: center;
  }

  ul.pageCon li.active {
    background: #2ad487
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  .page .dis {
    background: #999999;
    cursor: not-allowed;
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

  .tag_title {
    padding: 2px 4px;
    border-radius: 2px;
    background: #2ad487;
    color: #fff;
    margin: 2px 2px 0 0;
    display: inline-block;
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

  ul.movie_list li {
    background: #222;
    float: left;
    width: 280px;
    margin: 10px; /*#2ad487*/;
    padding: 12px;
    height: 465px;
    transition: all 500ms;
    box-sizing: border-box;
    overflow: hidden;
  }

  ul.movie_list li:hover {
    border-color: #2ad487;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -3px, 0);
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
    margin-bottom: 5px;
    height: 22px;
    line-height: 22px;
    overflow: hidden;
  }

  ul.movie_list li .original_title {
    color: #999;
    font-size: 12px
  }

  .page {
    width: auto;
    height: 30px;
    margin: 20px auto;
    color: #fff;
    position: relative;
  }

  .pageBox {
    width: 300px;
    height: 30px;
    margin: 0px auto;
    position: relative;
    overflow: hidden;
  }

  .page span {
    position: absolute;
    padding: 4px 10px;
    background: #2ad487;
    z-index: 1000;
    top: 0;
    cursor: pointer;
    user-select: none;
  }

  .page .previous {
    left: 38%;
  }

  .page .next {
    right: 38%;
  }

  ul.pageCon {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%
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
    user-select: none;
  }
</style>
