<template>
  <transition name="slide">
    <div class="search-wrapper" @click="resultShow=false">
      <div class="mod_search">
        <div class="mod_search_input">
          <input type="text" placeholder="请输入关键字" @click.stop v-model="key" @focus="resultShow=true"
                 @blur="resultShow=true" @keyup.enter="_searchDetailed">
          <button class="search_btn" @click="_searchDetailed">搜索</button>
          <transition name="slide-down">
            <div class="mod_search_result" v-if="resultShow&&key!=''&&resultObj.song">
              <div class="clear-fix search-single" v-for="(item,key) in resultObj">
                <div class="left-box">{{item.name}}</div>
                <div class="right-box" :class="{'no-border':key=='song'}">
                  <a v-for="(itm,index) in item.itemlist" :href="`https://y.qq.com/n/yqq/${key}/${itm.mid}.html`" target="_blank"><p>
                    {{itm.name}} <span>{{itm.singer}}</span></p></a>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="mod-search-tips">
          热门搜索: <span v-for="(item,index) in hotKeyArr" @click="_searchDetailed($event,item.k)">{{item.k}}</span>
        </div>
      </div>
      <div class="mod-intro-singer" v-if="singerObj.zhida">
        <div class="mod-intro-singer-wrapper clear-fix" v-if="singerObj.zhida.zhida_singer">
          <img :src="singerObj.zhida.zhida_singer.singerPic">
          <div>
            <span>{{singerObj.zhida.zhida_singer.singerName}}</span>
            <span>单曲:{{singerObj.zhida.zhida_singer.songNum}}</span>
            <span>专辑:{{singerObj.zhida.zhida_singer.albumNum}}</span>
            <span>MV:{{singerObj.zhida.zhida_singer.mvNum}}</span>
          </div>
        </div>
        <div class="mod-tab">
          <span @click="getSong" :class="{'active':activeIndex==0}">歌曲</span>
          <span @click="getAlbum(albumClock)" :class="{'active':activeIndex==1}">专辑</span>
          <span @click="getMv($event,mvClock)" :class="{'active':activeIndex==2}">MV</span>
          <span @click="getLyric($event,lyricClock)" :class="{'active':activeIndex==3}">歌词</span>
        </div>
        <div class="wrapper-box">
          <div class="wrapper-container clear-fix" :style="styleObj">
            <div class="wrapper">
              <div class="song-head">
                <ul class="clear-fix">
                  <li class="song-head-name active">歌曲</li>
                  <li class="song-head-single">歌手</li>
                  <li class="song-head-album">专辑</li>
                  <li class="song-head-time">时长</li>
                </ul>
                <ul v-for="(item,index) in songObj.list" :class="{'double':index%2==0}">
                  <div>
                    <li class="song-head-name">
                      <a class="to-song" @click="toSongDetail(item)" >
                        {{item.songname}}
                      </a>
                      <em class="play" @click="selectItem(item,index,true)"></em>
                      <em class="add" @click="addItem(item,index,false)"></em>
                    </li>
                    <li class="song-head-single">
                      <span class="to-song" v-for="(singer,idx) in item.singer" @click="toSinger(singer)">{{singer.name}}</span>
                    </li>
                    <li class="song-head-album" @click="toAlbumDetail(item)" >
                      <a class="to-song" @click="toAlbumDetail(item)">
                        {{item.albumname || '暂无'}}
                      </a>
                    </li>
                    <li v-if="item.interval" class="song-head-time">{{item.interval | format }}</li>
                  </div>
                </ul>
              </div>
              <v-page :pageTotal="songPageTotal" @changePage="changeSongPage"></v-page>
            </div>
            <div class="wrapper album-wrapper">
              <span v-show="!albumObj.list">专辑空空的哦！</span>
              <div class="song-head">
                <ul class="clear-fix">
                  <li class="song-head-name active">专辑</li>
                  <li class="song-head-single">歌手</li>
                  <li class="song-head-album">发行时间</li>
                </ul>
                <ul v-for="(item,index) in albumObj.list" :class="{'double':index%2==0}">
                  <li class="song-head-name">
                    <a class="to-song" @click="toAlbumDetail(item)">{{item.albumName}}</a>
                  </li>
                  <li class="song-head-single">
                    <span v-for="(singer,idx) in item.singer_list">{{singer.name}}</span>
                  </li>
                  <li class="song-head-album">{{item.publicTime || '暂无'}}</li>
                </ul>
              </div>
            </div>
            <div class="wrapper mv-wrapper">
              <span v-show="!mvObj.list">MV空空的哦！</span>
              <ul class="mv-list clear-fix">
                <li class="mv-list-item" v-for="(item,index) in mvObj.list">
                  <a :href="`https://y.qq.com/n/yqq/mv/v/${item.v_id}.html`" target="_blank">
                    <div class="clear-fix">
                      <img v-lazy="{'src':item.mv_pic_url,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    </div>
                      <p class="mv-name"><span v-html="item.mvName_hilight"></span></p>
                      <p v-html="item.singerName_hilight"></p>
                  </a>
                </li>
              </ul>
              <v-page v-if="mvPageTotal" :pageTotal="mvPageTotal" @changePage="changeMvPage"></v-page>
            </div>
            <div class="wrapper lyric-wrapper">
              <span v-show="!lyricObj.list">歌词空空的哦！</span>
              <ul class="lyric-list">
                <li class="lyric-list-item" v-for="(item,index) in lyricObj.list">
                  <p>
                    <a :href="`https://y.qq.com/n/yqq/song/${item.songmid}.html`" target="_blank">{{item.songname}}</a>-
                    <span v-for="(singer,index) in item.singer"><a :href="`https://y.qq.com/n/yqq/singer/${singer.mid}.html`" target="_blank">{{singer.name}}</a></span>
                  </p>
                  <p><a :href="`https://y.qq.com/n/yqq/album/${item.albummid}.html`" target="_blank">{{item.albumname}}</a></p>
                  <div class="lyric-content lyric-close" v-html="lyricContent[index]"></div>
                  <div class="lyric-list-toolbar">
                    <span class="lyric-more" @click="changeExpand">展开</span>
                  </div>
                </li>
              </ul>
              <v-page v-if="lyricPageTotal" :pageTotal="lyricPageTotal" @changePage="changeLyricPage"></v-page>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { getHotKey, search, searchDetailed, searchOther ,getAlbumDetail } from '../api/musicapi'
  import {mapState, mapMutations ,mapActions} from 'vuex'
//  import {addClass,removeClass} from '../assets/js/dom'
  import $ from 'jquery'
  import format from "../filters/formatTime";
  import Page from './qmusic/Page.vue'
  const singerNum = 20
  const mvNum=28
  const lyricNum=10
  export default{
    data(){
      return {
        styleObj:{
          transform:'translateX(0)'
        },
        hotKeyArr: [],
        specialKey: '',
        activeIndex: 0,
        resultObj: {},
        singerObj: {},
        songObj: {},
        albumClock:false,
        albumObj:{},
        mvClock:false,
        mvObj:{},
        lyricClock:false,
        lyricObj:{},
        resultShow: false,
        key: '',
        songPage: 1,
        mvPage:1,
        lyricPage:1
      }
    },
    computed: {
      ...mapState([
        'singer','musicList','playing'
      ]),
      songPageTotal(){
        return Math.ceil(this.songObj.totalnum / singerNum)
      },
      mvPageTotal(){
        return Math.ceil(this.mvObj.totalnum / mvNum)
      },
      lyricPageTotal(){
        return Math.ceil(this.lyricObj.totalnum / lyricNum)
      },
      lyricContent(){
        var lyricArr=[]
        this.lyricObj.list.forEach((item)=>{
          lyricArr.push(item.content.replace(/\\n/g,'<br>'))
        })
        return lyricArr
      }
    },
    watch: {
      key(val){
        search(val).then((res) => {
          this.resultObj = res.data
          this.resultShow = true
        })
      },
      songPage(val){
        this.getSong(event,true)
        $("body").scrollTop('150')
      },
      mvPage(val){
        this.getMv(event,false)
        $("body").scrollTop('150')
      },
      lyricPage(val){
        $("body").scrollTop('150')
        this.getLyric(event,false)
      },
    },
    components: {
      'v-page': Page
    },
    filters: {
      format
    },
    mounted(){
      this.getHotKey()
    },
    methods: {
      ...mapMutations([
        'setSingerShow','addMuisc','setCurrentIndex','setAutoPlay','setSinger','setSingerShow','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toAlbumDetail(album){
        if(album.albummid){
          this.$router.push(`/qmusic/albumdetail/${album.albummid}`)
        }else{
          this.$router.push(`/qmusic/albumdetail/${album.albumMID}`)
        }
      },
      toSongDetail(song){
        this.setSongName(song.songname)
        this.$router.push(`/qmusic/songdetail/${song.albummid}`)
      },
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
          'id':singer.mid,
          'name':singer.name
        },this.singerObj)
        this.setSingerShow(false)
      },
      changeExpand(e){
        if(e.target.innerHTML=='展开'){
          e.target.innerHTML='收起'
          $(e.target).parent().siblings('.lyric-content').addClass('lyric-open')
//          $(e.target).parent().siblings('.lyric-content').animate({'height':'800px'})
        }else{
          e.target.innerHTML='展开'
          $(e.target).parent().siblings('.lyric-content').removeClass('lyric-open')
//          $(e.target).parent().siblings('.lyric-content').animate({'height':'200px'})
        }
      },
      selectItem(itm,index,flag){
        var item={}
        item.musicData=itm
        for(var i=0;i<this.musicList.length;i++){
          if(this.musicList[i]==item){
            this.setCurrentIndex(i)
            return
          }
        }
        this.selectPlay({
          item,
          index,
          flag
        })
      },
      addItem(item){
        for(var i=0;i<this.musicList.length;i++){
          if(this.musicList[i]==item){
            return
          }
        }
        if(this.musicList.length==0){
          this.setCurrentIndex(0)
          this.setAutoPlay(false)
        }
        if(!this.playing){
          this.setAutoPlay(false)
        }
        this.addMuisc(item)
        this.$dialog.center('添加歌曲成功！')
      },
      getSong(e,is){
        this.activeIndex = 0
        this.styleObj.transform='translateX(0)'
        if (is) {
          this.$loading.open('加载中...')
          searchOther(this.key, 'txt.yqq.center', this.songPage, singerNum, 0).then((res) => {
            this.songObj = res.data.song
            this.$loading.close()
          })
        }
      },
      changeSongPage(num){
        this.songPage = num
      },
      getAlbum(clock){
        this.activeIndex = 1
        this.styleObj.transform='translateX(-25%)'
        if(!clock){
          this.$loading.open('加载中...')
          searchOther(this.key, 'txt.yqq.album', 1, 30, 8).then((res) => {
            this.$loading.close()
            this.albumObj=res.data.album
            this.albumClock=true
          })
        }
      },
      getMv(e,clock){
        this.activeIndex = 2
        this.styleObj.transform='translateX(-50%)'
        if(!clock){
          this.$loading.open('加载中...')
          searchOther(this.key, 'txt.yqq.mv', this.mvPage, mvNum, 12).then((res) => {
            this.mvObj=res.data.mv
            this.mvClock=true
            this.$loading.close()
          })
        }
      },
      changeMvPage(num){
        this.mvPage = num
      },
      getLyric(e,clock){
        this.activeIndex = 3
        this.styleObj.transform='translateX(-75%)'
        if(!clock){
          this.$loading.open('加载中...')
          searchOther(this.key, 'txt.yqq.lyric', this.lyricPage, lyricNum, 7).then((res) => {
            this.lyricObj=res.data.lyric
            this.lyricClock=true
            this.$loading.close()
          })
        }
      },
      changeLyricPage(num){
        this.lyricPage = num
      },
      getHotKey(){
        getHotKey().then((res) => {
          this.specialKey = res.data.special_key
          this.hotKeyArr = res.data.hotkey.slice(0, 5)
        })
      },
      _searchDetailed(e, key){
        if (key) {
          this.key = key
        }
        if (this.key === "") {
          this.key = this.specialKey
          this.resultShow = false
        }
        searchOther(this.key, 'txt.yqq.center', this.songPage, singerNum, 0).then((res) => {
          this.singerObj = res.data
          this.songObj = res.data.song
          this.albumClock=false
          this.mvClock=false
          this.lyricClock=false
          this.activeIndex=0
          this.styleObj={
            transform:'translateX(0)'
          }
        })
      }
    }
  }
</script>

<style>
  .q-music li .to-song{
    color: #666666;
  }
  .q-music li .to-song:hover{
    color: #42b983;
  }
  .lyric-content{
    overflow: hidden;
    line-height: 22px;
  }
  .lyric-close{
     height: 120px;
  }
  .lyric-open{
    height: auto;
  }
  .lyric-wrapper{
    overflow: inherit;
    height: auto;
  }
  .lyric-more{
    display: inline-block;
    width: 120px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  .lyric-more:hover{
    background: #f5f5f5;
  }
  .q-music .lyric-wrapper a{
    color: #333;
  }
  .q-music .lyric-wrapper a:hover{
    color: #42b983;
  }
  #app .wrapper-container .song-head-name:hover em{
    display: block;
  }
  #app .wrapper-container .song-head-name em{
    display: block;
    width: 37px;
    height: 37px;
    background: url("./qmusic/icon_list_menu.png");
    position: absolute;
    top: 5px;
    display: none;
    cursor: pointer;
  }
  #app .wrapper-container .play{
    background-position: left top;
    right: 100px;
  }
  #app .wrapper-container .play:hover{
    background-position: -40px top;
  }
  #app .wrapper-container .song-head-name .add{
    background-position: left -80px;
    right: 50px;
  }
  #app .wrapper-container .add:hover{
    background-position: -40px -80px;
  }
  #app .q-music .lyric-list .lyric-list-item{
    float: inherit;
    width: auto;
    font-size: 14px;
    color: #666666;
    padding:20px 0;
    border-bottom: 1px solid #ccc;
  }
  #app .q-music .lyric-list .lyric-list-item p{
    margin: 6px 0;
  }
  #app .q-music .lyric-list .lyric-list-item div{
    color: #999;
    line-height: 20px;
  }
  #app .q-music .lyric-list .lyric-list-item div em{
    font-style: normal;
    color: #42b983;
  }
  .mod-intro-singer .mv-wrapper img{
    width: 100%;
    height: 100%;
    max-height: 152px;
    transition: all .3s;
    border-radius: 0;
    margin-bottom: 10px;
  }
  .mod-intro-singer .mv-wrapper img:hover{
    transform: scale(1.02);
  }

  .mv-list-item .mv-name span{
    color: #333;
    overflow: hidden;
    font-size: 14px;
    display: block;
    text-overflow: ellipsis;
    max-height: 18px;
    line-height: 20px;
    white-space: nowrap;
    font-weight: normal;
  }
  .mv-list-item p{
    color: #999;
  }
  .mv-list-item p em{
    font-style: normal;
    color: #42b983;
  }
  .wrapper-box{
    width: 100%;
    overflow: hidden;
  }
  .wrapper-box .wrapper-container{
    width: 400%;
    transition: all .5s;
  }
  .wrapper-box .wrapper{
    width: 1180px;
    float: left;
  }
  #app .q-music .wrapper-box .wrapper .mv-list-item{
    width: 23%;
    float: left;
    padding: 5px;
    margin-top: 15px;
  }

  #app .q-music .song-head ul {
    height: 50px;
    line-height: 50px;
    background-color: #fbfbfd;
    color: #999;
  }

  #app .q-music .song-head .double {
    background: #fff;
  }

  #app .q-music .song-head li {
    float: left;
    color: #999;
    font-size: 14px;
    text-indent: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 50px;
  }

  #app .q-music .song-head .song-head-name {
    width: 47.685185%;
    position: relative;
    white-space: normal;
  }

  #app .q-music .song-head .song-head-single {
    padding-left: 20px;
    width: 21%;
  }

  #app .q-music .song-head .song-head-single span {
    margin-right: 10px;
  }

  #app .q-music .song-head .song-head-album {
    padding-left: 20px;
    width: 20%;
  }

  #app .q-music .song-head .song-head-time {
    width: 50px;
  }

  .mod-tab {
    text-align: left;
    margin-top: 20px;
  }

  .mod-tab .active {
    color: #42b983;
  }

  .mod-tab span {
    margin-right: 15px;
    cursor: pointer;
  }

  .mod-intro-singer {
    width: 1180px;
    margin: 0 auto;
    text-align: left;
  }

  .mod-intro-singer-wrapper {
    padding: 20px 0;
  }

  .mod-intro-singer-wrapper span {
    margin-left: 30px;
    font-size: 18px;
  }

  .mod-intro-singer img {
    border-radius: 50%;
    display: block;
    float: left;
    width: 94px;
    height: 94px;
  }

  .slide-down-enter-active, .slide-down-leave-active {
    transition: all .3s;
  }

  .slide-down-enter, .slide-down-leave-to {
    /*transform: translate3d(0, -50px, 0);*/
    transform: scaleY(0.1);
    opacity: 0;
  }

  .left-box {
    width: 94px;
    float: left;
    line-height: 36px;
  }

  .right-box a {
    color: #666666;
  }

  .right-box {
    float: left;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    text-align: left;
    width: 457px;
  }

  .right-box p {
    text-indent: 20px;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    transition: all .3s;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .right-box p span {
    transition: all .3s;
    color: #42b983;
  }

  .right-box p:hover {
    background: #42b983;
    color: #fff;
  }

  .right-box p:hover span {
    color: #fff;
  }

  .no-border {
    border-bottom: none;
  }

  .mod-search-tips {
    margin-top: 20px;
    color: #fff;
  }

  .mod-search-tips span {
    color: #fff;
    cursor: pointer;
    display: inline-block;
    margin-right: 10px;
    font-family: poppin, 'PingFang SC', Tahoma, Arial, \5FAE\8F6F\96C5\9ED1, sans-serif;
  }

  .search-wrapper {
    background: #FFFFFF;
    padding-top: 20px;
    margin-top: 20px;
  }

  .mod_search {
    background-image: url(//y.gtimg.cn/mediastyle/yqq/img/bg_search.jpg);
    position: relative;
    height: 207px;
    background-position: 50%;
    background-size: cover;
    padding-top: 60px;
  }

  .mod_search_input {
    position: relative;
    width: 554px;
    margin: 0 auto;
  }

  .mod_search_result {
    transform-origin: center top;
    position: absolute;
    width: 552px;
    min-height: 100px;
    background: #FFFFFF;
    top: 50px;
    border: 1px solid #ccc;
    z-index: 10;
  }

  .mod_search_input input {
    width: 554px;
    height: 50px;
    line-height: 50px;
    border: 0 none;
    font-size: 14px;
    background: #fff;
    border-radius: 4px;
    text-indent: 20px;
    font-size: 16px;
    -webkit-transition: width .6s ease-out, visibility .6s 1ms ease-out;
    transition: width .6s ease-out, visibility .6s 1ms ease-out;
  }

  .search_btn {
    width: 50px;
    height: 50px;
    display: inline-block;
    margin-left: -54px;
    background: #42b983;
    color: #fff;
    text-align: center;
    border: 0 none;
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

</style>
