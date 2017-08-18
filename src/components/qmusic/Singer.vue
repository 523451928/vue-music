<template>
  <transition name="slide">
    <div class="singer-list-wrapper">
      <div v-show="singerShow">
        <div class="singer">
          <div class="music-group">
            <div>
              <ul class="clear-fix">
                <li v-for="(item,index) in manArr" @click="changeMan(item,index)" :class="{'active':index==manIndex}">
                  {{item.key}}
                </li>
              </ul>
            </div>
            <div>
              <ul class="clear-fix">
                <li v-for="(item,index) in letterArr" @click="changeLetter(item,index)"
                    :class="{'active':index==letterIndex}">{{item}}
                </li>
              </ul>
            </div>
          </div>
          <div class="singer-wrapper">
            <div class="top-singer-list clear-fix">
              <transition-group tag="ul" name="fade-in">
                <li class="singer_list_item" v-for="(item,index) in topSingerArr" @click="selectSinger(item)" :key="item">
                  <div class="singer-box">
                    <img
                      onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000';this.onerror=null;"
                      :src="`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`"
                      class="singer-pic">
                    <h3 class="singer_list_title">{{item.Fsinger_name}}</h3>
                  </div>
                </li>
              </transition-group>
            </div>
            <ul class="singer_list_txt">
              <li @click="selectSinger(item)" class="singer_list_txt_item" v-for="(item,index) in singerArr">{{item.Fsinger_name}}</li>
            </ul>
          </div>
          <!--<div class="page-wrapper">-->
            <!--<a ref="page" class="page" @click="changePage($event,item)" v-for="(item,index) in pageArr" v-html="item"-->
               <!--:title="item=='>'?'下一页':item=='<'?'上一页':item"-->
               <!--:class="{'flip':item=='<'||item=='>','active':index==pageIndex,'disabled':item=='...'}"></a>-->
          <!--</div>-->
          <v-page v-if="singerObj.total_page>0" :pageTotal="singerObj.total_page" @changePage="changePage"></v-page>
        </div>
      </div>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
  import { addClass, removeClass } from '../../assets/js/dom'
  import { mapMutations , mapState} from 'vuex'
  import Page from './Page.vue'
  import VPage from './Page'
  export default{
    data(){
      return {
        letterIndex: 0,
        manIndex: 0,
        letterKey: 'all',
        manKey: 'all_all_',
        pageNum: 1,
        pageIndex: 0,
        sliceNum: 10,
        singerObj: {},
        letterArr: [
          '热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ],
        manArr: [
          {'key': '热门', 'code': "all_all_"},
          {'key': '华语男', 'code': "cn_man_"},
          {'key': '华语女', 'code': "cn_woman_"},
          {'key': '华语组合', 'code': "cn_team_"},
          {'key': '韩国男', 'code': "k_man_"},
          {'key': '韩国女', 'code': "k_woman_"},
          {'key': '韩国组合', 'code': "k_team_"},
          {'key': '日本男', 'code': "j_man_"},
          {'key': '日本女', 'code': "j_woman_"},
          {'key': '日本组合', 'code': "j_team_"},
          {'key': '欧美男', 'code': "eu_man_"},
          {'key': '欧美女', 'code': "eu_woman_"},
          {'key': '欧美组合', 'code': "eu_team_"},
          {'key': '乐团', 'code': "c_orchestra_"},
        ]
      }
    },
    computed: {
      ...mapState([
        'singerShow','singersObj'
      ]),
      key(){
        return this.manKey + this.letterKey
      },
      topSingerArr(){
        if (this.singerObj.list) {
          return this.singerObj.list.slice(0, this.sliceNum)
        } else {
          return [];
        }
      },
      singerArr(){
        if (this.singerObj.list) {
          return this.singerObj.list.slice(this.sliceNum)
        } else {
          return [];
        }
      }
    },
    watch: {
      key(val){
        this.searchSinger(true)
      },
      pageNum(val){
        if (val > 1) {
          this.sliceNum = 0
        } else {
          this.sliceNum = 10
        }
        this.searchSinger()
      },
      $route(to){
        if(to.path=='/qmusic/singer'){
          this.setSingerShow(true)
        }
      }
    },
    mounted(){
      this.searchSinger()
      this.setSingerShow(true)
      this.$http.get("http://gank.io/api/history/content/5/1").then((res) => {
        console.log(res.data)
      })
    },
    components:{
      VPage,
      'v-page':Page
    },
    methods: {
      ...mapMutations([
        'setSinger','setSingerShow'
      ]),
      selectSinger(item){
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
          'id':item.Fsinger_mid,
          'name':item.Fsinger_name
        },this.singerObj)
        this.setSingerShow(false)
        this.$router.push({
          path: `/qmusic/singer/${item.Fsinger_mid}`
        })
      },
      changePage(num){
        console.log(num)
        this.pageNum=num
        document.body.scrollTop = 150
      },
      changeMan(item, index){
        this.manKey = item.code
        this.manIndex = index
      },
      changeLetter(item, index){
        if (item == '热门') {
          this.letterKey = 'all'
        } else {
          this.letterKey = item
        }
        this.letterIndex = index
      },
      searchSinger(flag){
        var self = this;
        this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/v8.fcg',
          {
            params: {
              g_tk: 1928093487,
              inCharset: 'utf-8',
              outCharset: 'utf-8',
              notice: 0,
              format: 'jsonp',
              channel: 'singer',
              page: 'list',
              key: self.key,
              pagesize: 100,
              pagenum: self.pageNum,
              hostUin: 0,
              needNewCode: 0,
              platform: 'yqq'
            },
            jsonp: 'jsonpCallback'
          }).then(function (res) {
            this.singerObj = res.body.data
          if(flag){
            this.pageNum=1
          }
        });
      }
    }
  }
</script>

<style>
  .singer_list_txt {
    margin-right: -20px;
    overflow: hidden;
    margin-bottom: 60px;
  }

  #app .q-music .singer_list_txt_item {
    float: left;
    width: 19%;
    padding: 10px 0 10px 10px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
    cursor: pointer;
  }

  #app .q-music .singer_list_txt_item:hover {
    color: #42b983;
  }

  .singer-list-wrapper {
    width: 100%;
    background: #FFFFFF;
  }

  #app .singer {
    max-width: 1200px;
    margin: 0 auto;
    background: #fff;
  }

  #app .singer .singer_list_item {
    float: left;
    width: 20%;
    margin-bottom: 20px;
    overflow: hidden;
    cursor: pointer;
  }

  .singer .singer-box {
    position: relative;
    margin-right: 20px;
    background-color: #fbfbfd;
    min-height: 195px;
    padding: 25px 0;
    overflow: hidden;
    text-align: center;
  }
  .singer .singer-box img{
    transition: all .5s;
  }
  .singer .singer-box:hover img{
    transform: scale(1.2);
  }

  .singer_list_title {
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
    zoom: 1;
    margin: 20px 30px 4px;
  }

  .singer_list_title:hover {
    color: #42b983;
  }

  .music-group {
    background-color: #fbfbfd;
    padding: 34px 0 17px 40px;
    margin: 30px 0 20px;
  }

  .singer-pic {
    border-radius: 50%;
    display: block;
    width: 140px;
    height: 140px;
    margin-left: 38px;
  }

  #app .q-music .music-group li {
    height: 26px;
    width: auto;
    line-height: 27px;
    overflow: hidden;
    padding: 0 8px;
    margin: 0 12px 14px 0;
    color: #333;
    cursor: pointer;
  }

  #app .q-music .music-group li:hover {
    color: #42b983;
  }

  #app .q-music .music-group li.active {
    background: #42b983;
    color: #fff;
  }

  .singer {
    width: 100%;
    height: 100%;
    background: #fff;
    margin-top: 10px;
    text-align: left;
  }

  .slide-enter-active {
    transition: all .5s
  }
  .slide-leave-active{
    transition: all .1s
  }
  .slide-enter{
    transform: translate3d(100%, 0, 0)
  }
  .slide-leave-to{
    transform: translate3d(-100%, 0, 0)
  }
  .fade-in-enter-active, .fade-in-leave-active {
    transition: all .5s
  }

  .fade-in-enter, .fade-in-leave-to {
    opacity: 0;
  }

</style>
