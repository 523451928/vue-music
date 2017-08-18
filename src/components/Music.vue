<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div>
      <div>
        <h1>{{search}}</h1>
        <v-search v-on:search="searchMusic"></v-search>
      </div>
      <transition-group name="fade" tag="ul" class="music-list clearfix content" mode="out-in">
        <li v-for="(item,index) in musicList" :key="item">
          <router-link :to="{ path: '/mdetail/'+item.id}">
            <div class="left-con">
              <!--<img :src="item.image" height="80">-->
              <img height="80" v-lazy="{'src':item.image,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
              <span>{{item.title}}</span>
            </div>
            <v-follow :item="item" v-on:childToggle="toggleLike(item)"></v-follow>
            <div class="right-con">
              <p>出版日期 : {{item.attrs.pubdate?item.attrs.pubdate[0]:"暂无"}}</p>
              <p>歌手 : {{singer.length>1 ? singer.join("|") : singer[0]}}</p>
              <p class="tag">
                <span v-for="(tag,index) in item.tags">{{tag.name}}</span>
              </p>
              <v-star :size="starSize" :score="item.rating?item.rating.average:''"></v-star>
            </div>
          </router-link>
        </li>
      </transition-group>
    </div>
  </transition>
</template>

<script>
  import Search from '../public/Search.vue'
  import Star from '../public/Star.vue'
  import Follow from '../public/Follow.vue'
  import {mapState , mapMutations} from 'vuex'
  const baseRequstUrl = "https://api.douban.com/"
  import {getSingerList,getRecommend} from '../api/musicapi'
  import Singer from '../assets/js/singer'

  export default{
    data(){
      return {
        search:"音乐",
        start:0,
        count:20,
        musicList:[],
        followArr:[],
        starSize:"Small",
        HOT_NAME:'热门',
        HOT_SINGER_LEN:10
      }
    },
    computed:{
      ...mapState([
        'musicArr','musicKey'
      ]),
      singer(){
        for(var i=0;i<this.musicList.length;i++){
          return this.musicList[i].attrs.singer;
        }
      }
    },
    methods:{
      ...mapMutations([
        'setMusic','setMusicKey'
      ]),
      searchMusic(k){
        this.search=k;
        this.setMusicKey(k);
        this.$http.jsonp(baseRequstUrl + "v2/music/search?q=" + this.search +"&&start="+this.start +"&&count=" +this.count).then(function (res) {
          this.musicList=res.data.musics;
          this.setMusic(this.musicList);
          for (var i = 0; i < this.musicList.length; i++) {
            for (var j = 0; j < this.followArr.length; j++) {
              if (this.musicList[i].id == this.followArr[j].id) {
                this.$set(this.musicList[i], "isLike", true);
              }
            }
          }
        })
      },
      toggleLike: function (item) {
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
            if (item.id === this.followArr[i].id) {
              this.followArr.splice(i, 1);
            }
          }
        }
        window.localStorage.setItem('followMusicArr', JSON.stringify(this.followArr));
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: this.HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < this.HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === this.HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    },
    components:{
      "v-search":Search,
      'v-star':Star,
      'v-follow':Follow
    },
    mounted(){
      if(this.musicArr.length>0){
        this.musicList=this.musicArr;
      }
      if(this.musicKey!=""){
        this.search=this.musicKey;
      }
      if (window.localStorage.getItem("followMusicArr") != null) {
        this.followArr = JSON.parse(window.localStorage.getItem("followMusicArr"));
      }

//      getRecommend().then((res) => {
//
//      })
    }
  }
</script>

<style>
  .music-list li{height:120px;padding-top: 38px;border: 1px solid #666; margin: 4px; overflow: hidden;  -webkit-transform: translate3d(0, -2px, 0);
    transform: translate3d(0, -2px, 0);}
  .left-con{
    width: 30%;
    float: left;
    color: #fff;
  }
  .left-con span{width: 60%;display: inline-block;}
  .right-con{
    width:70%;
    float: left;
    color: #2ad487;;
  }
  .right-con span{
    display: inline-block;
    height:20px;
    line-height: 24px;margin: 2px;
    border-radius:4px;
    padding: 2px 4px;
    background: #2ad487;
    color: #FFFFFF;
  }
  ul.music-list li:hover {
    border-color: #2ad487;
    -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    -webkit-transform: translate3d(0, -5px, 0);
    transform: translate3d(0, -5px, 0);
  }
  .right-con .star{
    margin:0 auto;
    float: none;
  }
</style>
