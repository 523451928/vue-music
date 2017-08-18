<template>
  <transition name="slide">
    <div class="top-list-wrapper" @click="hidePop">
      <div class="top-list-container clear-fix">
        <div class="top-list-nav">
          <dl>
            <dt>音乐巅峰榜</dt>
            <dd v-for="(item,index) in topList" @click="getTopMusic(item,index)"
                :class="{'current':currentIndex==index}">{{item.topTitle}}
            </dd>
          </dl>
        </div>
        <div class="toplist-mod">
          <div class="toplist-hd clear-fix" v-if="topInfo.ListName">
            <h2 class="toplist-title">{{topInfo.ListName}}</h2>
            <span class="toplist-switch">
              <i v-show="currentIndex!=0&&currentIndex!=2&&currentIndex!=3&&currentIndex!=4" @click="prevDate">&lt;</i>
                <span v-if="currentIndex==0||currentIndex==2||currentIndex==3||currentIndex==4" class="update-time">{{topObj.date}}</span>
                <span v-if="currentIndex!=0&&currentIndex!=2&&currentIndex!=3&&currentIndex!=4"
                      class="update-time">{{topObj.update_time | formatDate}}</span>
              <i v-show="currentIndex!=0&&currentIndex!=2&&currentIndex!=3&&currentIndex!=4" :class="{'dis':topObj.date==initDate}" @click="nextDate">&gt;</i>
            </span>
            <a @click.stop="showPop">榜单规则</a>
            <transition name="slide">
              <div class="popup" v-show="popShow" v-html="topInfo.info"></div>
            </transition>
          </div>
          <div class="toplist-btn">
            <span class="play-all" @click="playAll">播放全部</span>
          </div>
          <div class="top-songlist">
            <ul class="song-head clear-fix">
              <li class="song-name">歌曲</li>
              <li class="song-singer">歌手</li>
              <li class="song-time">时长</li>
            </ul>
            <ul class="songlist" v-if="topObj.songlist">
              <li v-for="(item,index) in topObj.songlist">
                <div class="rank-wrapper">
                  <div class="top-num"
                       :class="{'front-top':topObj.song_begin+index+1==1 || topObj.song_begin+index+1==2 || topObj.song_begin+index+1==3}">
                    {{topObj.song_begin + index + 1}}
                  </div>
                  <div class="rank">
                    <i class="icon-rank"
                       :class="{'special-rank':currentIndex==0,'new-rank':item.old_count==0,'rise-rank':item.old_count-item.cur_count>0,'decline-rank':item.old_count-item.cur_count<0,'flat-rank':item.old_count-item.cur_count==0}">
                    </i>
                    <span v-if="currentIndex==0">{{item.in_count | rank}}</span>
                    <span
                      v-if="currentIndex!=0&&item.old_count!=0&&item.old_count-item.cur_count!=0">{{Math.abs(item.old_count - item.cur_count)}}</span>
                  </div>
                </div>
                <div class="song-container">
                  <div class="song-name">
                    <!--<img width="70" :src="`//y.gtimg.cn/music/photo_new/T002R90x90M000${item.data.albummid}.jpg?max_age=2592000`">-->
                    <img width="70"
                         v-lazy="{'src':`//y.gtimg.cn/music/photo_new/T002R90x90M000${item.data.albummid}.jpg?max_age=2592000`,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    <div></div>
                    <span class="to-song" @click="toSongDetail(item.data)">{{item.data.songname}}</span>
                    <span v-show="item.data.isonly" class="only">独家</span>
                    <em class="play" @click="selectItem(item,index,true)"></em>
                    <em class="add" @click="addItem(item)"></em>
                  </div>
                  <div class="song-singer">
                    <span v-for="(singer,idx) in item.data.singer" @click="toSinger(singer)">{{singer.name}}</span>
                  </div>
                  <div class="song-time">{{item.data.interval | format}}</div>
                </div>
              </li>
            </ul>
          </div>
          <v-page :pageTotal="pageTotal" @changePage="changeBegin"></v-page>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Page from './qmusic/Page.vue'
  import { getTopList, getMusicList } from '../api/musicapi'
  import { getYearWeek } from '../assets/js/getYearWeek'
  import format from '../filters/formatTime'
  import { mapMutations, mapState, mapActions } from 'vuex'
  const SongNum = 30
  export default{
    data(){
      return {
        topList: [],
        currentIndex: 0,
        initDate:"",
        date:"",
        popShow: false,
        songBegin: 0,
        topInfo:{},
        topObj: {}
      }
    },
    computed: {
      ...mapState([
        'musicList', 'playing'
      ]),
      pageTotal(){
        return Math.ceil(this.topObj.total_song_num / SongNum)
      }
    },
    watch: {
      songBegin(val){
        this.$loading('加载中...')
        getMusicList(this.topList[this.currentIndex].id, val, '').then((res) => {
          this.$loading.close()
          this.topObj = res
          this.topInfo=res.topinfo
          this.date=res.date
        })
      },
      currentIndex(val){
        this.$loading('加载中...')
        getMusicList(this.topList[val].id, 0, '').then((res) => {
          this.$loading.close()
          this.topObj = res
          this.topInfo=res.topinfo
          this.date=res.date
        })
      }
    },
    methods: {
      ...mapMutations([
        'addMusicList', 'setCurrentIndex', 'setPlaying', 'addMuisc', 'setCurrentIndex', 'setAutoPlay','setSinger','setSingerShow','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toSongDetail(song){
        console.log(song)
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
      prevDate(){
        var date=this.date.split("_")[0]+'_'+(parseInt(this.date.split('_')[1])-1)
        this.getMusic(date)
      },
      nextDate(){
        if(this.date!=this.initDate){
          var date=this.date.split("_")[0]+'_'+(parseInt(this.date.split('_')[1])+1)
          this.getMusic(date)
        }
      },
      getMusic(date){
        this.$loading('加载中...')
        getMusicList(this.topList[this.currentIndex].id,0,date).then((res)=>{
          this.$loading.close()
          this.topObj=res
          this.date=res.date
        })
      },
      getTopMusic(item, index){
        if(index==10){
          this.$dialog.center('接口暂未开放')
          return
        }
        this.currentIndex = index
      },
      selectItem(item, index, flag){
        var songObj = {}
        songObj.musicData = item.data
        for (var i = 0; i < this.musicList.length; i++) {
          if (this.musicList[i] == songObj) {
            this.setCurrentIndex(i)
            return
          }
        }
        this.selectPlay({
          item: songObj,
          index,
          flag
        })
      },
      addItem(itm){
        var item = {}
        item.musicData = itm.data
        for (var i = 0; i < this.musicList.length; i++) {
          if (this.musicList[i] == item) {
            return
          }
        }
        if (this.musicList.length == 0) {
          this.setCurrentIndex(0)
          this.setAutoPlay(false)
        }
        this.addMuisc(item)
        this.$dialog.center('添加歌曲成功！')
      },
      padLeftZero(str){
        return ("00" + str).substr((str + "").length);
      },
      playAll(){
        console.log(this.topObj.songlist)
        var songArr = []
        this.topObj.songlist.forEach((item) => {
          songArr.push({
            musicData: item.data
          })
        })
        this.addMusicList(songArr)
        this.setCurrentIndex(0)
        this.setPlaying(true)
      },
      changeBegin(num){
        this.songBegin = (num - 1) * SongNum
        document.body.scrollTop = 150
      },
      showPop(){
        this.popShow = true
      },
      hidePop(){
        this.popShow = false
      }
    },
    mounted(){
      var now = new Date()
      this.initDate=now.getFullYear()+'_'+getYearWeek(now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate())
      console.log(this.initDate)
      this.$loading('加载中...')
      getTopList().then((res) => {
        this.topList = res.data.topList
        getMusicList(this.topList[0].id, this.songBegin, '').then((res) => {
          this.$loading.close()
          this.topObj = res
          this.topInfo=res.topinfo
          this.date=res.date
        })
      })
    },
    components: {
      'v-page': Page
    },
    filters: {
      rank(val){
        return parseInt(val * 100) + '%'
      },
      formatDate(val){
        var dateArr = val.split('-')
        var day = new Date(dateArr[0], dateArr[1], 0)
        var lastdate = day.getDate()
        var dateStart=parseInt(dateArr[1])+'.'+parseInt(dateArr[2])
        var dateEnd=parseInt(dateArr[2])+6>lastdate?parseInt(dateArr[1])+1+'.'+(parseInt(dateArr[2])+6-lastdate):parseInt(dateArr[1])+'.'+(parseInt(dateArr[2])+6)
        return dateStart+'-'+dateEnd
      },
      format
    }
  }
</script>

<style>
  .song-name .to-song{
    cursor: pointer;
  }
  .song-name .to-song:hover{
    color: #42b983;
  }
  .toplist-switch i {
    font-style: normal;
    font-family: cursive;
    cursor: pointer;
  }

  .toplist-switch i:hover {
    color: #42b983;
  }
  .toplist-switch .dis{
    cursor: not-allowed;
    color: #cccccc;
  }
  .toplist-switch .dis:hover{
    color: #ccc;
  }
  #app .songlist div:hover em {
    display: block;
  }

  #app .songlist .song-name div {
    width: 100px;
  }

  #app .songlist .song-name em {
    display: block;
    width: 37px;
    height: 37px;
    background: url("./qmusic/icon_list_menu.png");
    position: absolute;
    top: 18px;
    display: none;
    cursor: pointer;
  }

  .song-name img {
    top: 5px;
    position: absolute;
    display: inline-block;
    left: 5px;
  }
  #app .songlist .song-singer,#app .songlist .song-time{
    text-indent: 10px;
  }
  #app .songlist .song-singer span{
    cursor: pointer;
  }
  #app .songlist .song-singer span:hover{
    color: #42b983;
  }
  #app .songlist .song-name .play {
    background-position: left top;
    right: 100px;
  }

  #app .songlist .song-name .play:hover {
    background-position: -40px top;
  }

  #app .songlist .song-name .add {
    background-position: left -80px;
    right: 50px;
  }

  #app .songlist .song-name .add:hover {
    background-position: -40px -80px;
  }

  #app .q-music .songlist .rank {
    margin-left: 10px;
    font-size: 14px;
    position: relative;
    line-height: 94px;
    width: 38px;
    font-size: 12px;
  }

  .song-container .only {
    font-size: 12px;
    display: inline-block;
    padding: 1px 2px;
    border: 1px solid #42b983;
    border-radius: 2px;
    height: 14px;
    line-height: 14px;
    position: relative;
    top: -1px;
    color: #42b983;
  }

  .icon-rank {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("./qmusic/icon_rank.png") left -60px;
    position: absolute;
    top: 28px;
    left: 12px;
  }

  .rise-rank {
    background-position: left top;
  }

  .decline-rank {
    background-position: left -15px;
  }

  .flat-rank {
    height: 2px;
    top: 38px;
    background-position: left -30px;
  }

  .new-rank {
    width: 23px;
    height: 8px;
    top: 36px;
    left: 9px;
    background-position: left -40px;
  }

  .special-rank {
    width: 15px;
    height: 15px;
    background-position: left -60px;
    top: 23px;
    left: 12px;
  }

  .top-num {
    width: 40px;
    text-align: right;
    font-size: 24px;
    font-family: poppin, 'PingFang SC', Tahoma, Arial, \5FAE\8F6F\96C5\9ED1, sans-serif;
  }

  #app .q-music .songlist div .front-top {
    color: #ff4222;
  }

  .top-songlist {
    margin-top: 10px;
  }

  #app .q-music .top-songlist .song-head {
    height: 50px;
    line-height: 50px;
    background-color: #fbfbfd;
    color: #999;
    padding-left: 120px;
  }

  #app .q-music .song-head li {
    float: left;
  }

  .song-container {
    width: 855px;
  }

  #app .songlist li {
    width: 100%;
    height: 80px;
    line-height: 80px;
    background: #fff;
    color: #333;
    float: none;
  }

  #app .q-music .songlist div {
    float: left;
    height: 80px;
    line-height: 80px;
    background-color: #fff;
    color: #999;
  }

  #app .q-music .songlist .double {
    background-color: #fbfbfd;
  }

  .songlist .rank-wrapper {
    width: 120px;
  }

  #app .q-music .songlist .song-name {
    color: #333;
    font-size: 14px;
  }

  #app .q-music .songlist .song-name, #app .q-music .song-head .song-name {
    width: 72%;
    position: relative;
  }

  #app .q-music .songlist .song-singer {
    color: #333;
    font-size: 14px;
  }

  #app .q-music .songlist .song-singer, #app .q-music .song-head .song-singer {
    width: 18%;
  }

  #app .q-music .songlist .song-time, #app .q-music .song-head .song-time {
    width: 9%;
    margin: 0;
  }

  .popup {
    position: absolute;
    width: 580px;
    background: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, .35);
    border-radius: 4px;
    border: 1px solid #ddd;
    line-height: 1.2;
    padding: 10px;
    font-size: 14px;
    margin-top: -10px;
    z-index: 10;
  }

  .play-all {
    display: inline-block;
    width: 120px;
    height: 35px;
    text-align: center;
    color: #fff;
    background: #42b983;
    line-height: 35px;
    cursor: pointer;
    font-size: 14px;
    border-radius: 4px;
  }

  .toplist-hd a {
    color: #333;
    font-size: 14px;
  }

  .toplist-hd a:hover {
    color: #42b983;
  }

  .update-time {
    font-size: 14px;
    color: #333;
    margin: 0 5px;
  }

  .toplist-hd {
    height: 64px;
    line-height: 64px;
    margin-bottom: 10px;
  }

  .toplist-title {
    float: left;
    font-weight: 400;
    font-size: 24px;
    margin-right: 15px;
  }

  .top-list-wrapper {
    width: 100%;
    text-align: left;
    padding: 30px 0;
    margin-top: 30px;
    background: #fff;
  }

  .top-list-container {
    width: 1180px;
    margin: 0 auto;
  }

  .top-list-nav {
    width: 178px;
    border: 1px solid #cccccc;
    text-align: center;
    float: left;
    min-height: 100px;
  }

  .top-list-nav dl dt {
    line-height: 60px;
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #ebebeb;
    margin: 0 17px 10px;
  }

  .top-list-nav dl dd {
    color: #333;
    background-color: #fff;
    font-size: 16px;
    line-height: 2.5;
    cursor: pointer;
  }

  .top-list-nav dl .current {
    background: #42b983;
    color: #fff;
  }

  .top-list-nav dl dd:hover {
    color: #42b983;
  }

  .top-list-nav dl .current:hover {
    color: #fff;
  }

  .toplist-mod {
    width: 975px;
    margin-left: 20px;
    float: left;
    min-height: 100px;
  }
</style>
