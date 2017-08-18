<template>
  <transition name="slide">
    <div class="singer-wrapper">
      <div class="singer-detail">
        <div class="singer-title clear-fix">
          <img class="singer-avatar" :src="singer.avatar" onerror="this.src='//y.gtimg.cn/mediastyle/yqq/extra/player_cover.png?max_age=31536000';this.onerror=null;">
          <div class="singer-info">
            <h2>{{singer.name}}</h2>
            <div>
              <span>单曲：<strong>{{songObj.total}}</strong></span>
              <span>专辑：<strong>{{albumObj.total}}</strong></span>
            </div>
            <span class="return" @click="back">返回</span>
          </div>
        </div>
        <h2  v-if="songObj.list&&songObj.list.length>0">热门歌曲</h2>
        <div class="song-list">
          <div class="song-list-head">
            <ul class="clear-fix">
              <li class="song-name song-list-title">歌曲</li>
              <li class="song-album song-list-title">专辑</li>
              <li class="song-time-wrapper song-list-title">
                <span class="song-time">时长</span>
              </li>
              <div class="clear-fix" v-for="(item,index) in songObj.list" :class="{'doubel':index%2==0}" >
                <li class="song-name"><i>{{index + 1}}</i><a @click="toSongDetail(item)">{{item.musicData.songname}}</a>
                  <span v-if="item.musicData.isonly" class="only">独家</span>
                  <em class="play" @click="selectItem(item,index,true)"></em>
                  <em class="add" @click="addItem(item,index,false)"></em>
                </li>
                <li class="song-album"><a @click="toAlbumDetail(item)">{{item.musicData.albumname}}</a></li>
                <li class="song-time-wrapper">
                  <span class="song-time">{{item.musicData.interval | formatTime}}</span>
                </li>
              </div>
            </ul>
          </div>
          <div class="more" :class="{'more-dis':moreDis}" @click="getMore(true)">{{moreText}}</div>
        </div>
        <h2 v-if="albumObj.list&&albumObj.list.length>0">专辑</h2>
        <div class="album-list">
          <ul class="clear-fix">
            <li v-for="(item,index) in albumObj.list">
              <div class="album-box" @click="toAlbumDetail(item)">
                <img :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albumMID}.jpg?max_age=2592000`">
                <p class="album-name">{{item.albumName}}</p>
                <p class="pub-time">{{item.pubTime}}</p>
                <p class="desc">{{item.desc}}</p>
              </div>
            </li>
          </ul>
          <div class="more" :class="{'more-dis':moreAlbumDis}" @click="getMore(false)">{{moreAlbumText}}</div>
        </div>
        <h2 v-if="mvObj.list&&mvObj.list.length>0">MV</h2>
        <mv-list :mvList="mvObj.list"></mv-list>
        <h2 v-if="funMvObj.list&&funMvObj.list.length>0">爱豆视频</h2>
        <mv-list :mvList="funMvObj.list" :nickShow="nickShow"></mv-list>
        <h2 v-if="simiSingerObj.items&&simiSingerObj.items.length>0">相似歌手</h2>
        <div class="similar-singer">
          <ul class="clear-fix">
            <li v-for="(singer,index) in simiSingerObj.items">
              <div class="cover">
                <div>
                  <img  @click="changeSinger(singer)" class="singer-pic"
                        onerror="this.src='//y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=31536000';this.onerror=null;"
                       v-lazy="{'src':singer.pic,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                  <p @click="changeSinger(singer)">{{singer.name}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState, mapMutations ,mapActions} from 'vuex'
  import { getSingerMv,getFunMv,getSimilarSinger } from 'api/musicapi'
  import MvList from './Mvlist.vue'
  export default{
    data(){
      return {
        nickShow:true,
        songNum: 10,
        albumNum:5,
        moreText:"加载更多",
        moreAlbumText:'加载更多',
        moreDis:false,
        moreAlbumDis:false,
        songObj: {},
        albumObj: {},
        mvObj:{},
        funMvObj:{},
        simiSingerObj:{}
      }
    },
    filters: {
      formatTime(val){
        var second = ""
        var minute = ""
        second = Math.floor(val / 60)
        if (val % 60 == 0) {
          minute = '00'
        } else if (val % 60 >= 10) {
          minute = val % 60
        } else {
          minute = '0' + val % 60
        }
        return second+':'+minute
      }
    },
    computed: {
      ...mapState([
        'singer','musicList','playing','singerObj'
      ])
    },
    methods: {
      ...mapMutations([
        'setSingerShow','addMuisc','setCurrentIndex','setAutoPlay','setSinger','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toSongDetail(song){
        this.setSongName(song.musicData.songname)
        this.$router.push(`/qmusic/songdetail/${song.musicData.albummid}`)
      },
      toAlbumDetail(album){
        console.log(album.albumMID)
        if(album.albumMID){
          this.$router.push(`/qmusic/albumdetail/${album.albumMID}`)
        }else{
          this.$router.push(`/qmusic/albumdetail/${album.musicData.albummid}`)
        }
      },
      changeSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
          'id':singer.mid,
          'name':singer.name
        },this.singerObj)
        document.body.scrollTop=150
      },
      selectItem(item,index,flag){
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
        this.addMuisc(item)
        this.$dialog.center('添加歌曲成功！')
      },
      back(){
        this.setSingerShow(true)
//        window.location.back()
        this.$router.push('/qmusic/singer')
      },
      getMore(boll){
        if(boll){
          if(this.moreDis){
            return
          }
          this.songNum+=10
          if(this.songNum>=this.songObj.total){
            this.songNum=this.songObj.total;
            this.moreDis=true
            this.moreText='加载中...'
            this.getSongDetail(true)
            return
          }
          this.moreText='加载中...'
          this.getSongDetail()
        }else{
          if(this.moreAlbumDis){
            return
          }
          this.albumNum+=5
          if(this.albumNum>=this.albumObj.total){
            this.albumNum=this.albumObj.total;
            this.moreAlbumDis=true
            this.moreAlbumText='加载中...'
            this.getAlbumDetail(true)
            return
          }
          this.moreText='加载中...'
          this.getAlbumDetail()
        }
      },
      getSongDetail(is){
        var self = this;
        if (!this.singer.id) {
          this.$router.push('/qmusic/singer')
          return
        }
        this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
          {
            params: {
              g_tk: 1928093487,
              inCharset: 'utf-8',
              outCharset: 'utf-8',
              notice: 0,
              format: 'jsonp',
              hostUin: 0,
              needNewCode: 0,
              platform: 'yqq',
              order: 'listen',
              begin: 0,
              num: this.songNum,
              songstatus: 1,
              singermid: this.singer.id
            },
            jsonp: 'jsonpCallback'
          }).then(function (res) {
            if(is){
              this.moreText='我是有底线的人'
            }else{
              this.moreText='加载更多'
            }
            this.songObj = res.body.data
        });
      },
      getAlbumDetail(is){
        this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg?', {
          params: {
            format: 'jsonp',
            platform: 'yqq',
            singermid: this.singer.id,
            order: 'time',
            begin: 0,
            num: this.albumNum,
            g_tk: 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'jsonp',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: 0,
            platform: 'yqq',
            needNewCode: 0,
          },
          jsonp: 'jsonpCallback'
        }).then(function (res) {
          if(is){
            this.moreAlbumText='我是有底线的人'
          }else{
            this.moreAlbumText='加载更多'
          }
          this.albumObj = res.body.data
        });
      },
      getSingerData(){
        this.getSongDetail()
        this.getAlbumDetail()
        getSingerMv(this.singer.id,5).then((res)=>{
          this.mvObj=res.data
        })
        getFunMv(this.singer.id,5).then((res)=>{
          this.funMvObj=res.data
        })
        getSimilarSinger(this.singer.id).then((res)=>{
          this.simiSingerObj=res.singers
        })
      }
    },
    watch: {
      $route (to, from) {
        // 对路由变化作出响应...
        console.log(to.params.id)
        this.getSingerData()
      }
    },
    mounted(){
      this.getSingerData()
      setTimeout(()=>{
        this.setSingerShow(false)
      },100)
    },
    components:{
      MvList
    }
  }
</script>

<style>
  .q-music .song-name a{
    color: #333;
  }
  .q-music .song-name a:hover{
    color: #42b983;
  }
  #app .q-music .similar-singer li{
    width: 20%;
  }
  .similar-singer p{
    color: #333;
    margin-top: 10px;
  }
  .similar-singer .cover{
    margin-right: 20px;
  }
  .similar-singer .cover div{
    margin-right: 20px;
    text-align: center;
    min-height: 195px;
    margin: 0 auto;
    background: #fbfbfd;
    padding: 10px 0 5px 0;
  }
  .similar-singer .cover p{
    cursor: pointer;
  }
  .similar-singer .cover p:hover{
    color: #42b983;
  }
  .similar-singer .singer-pic{
    border-radius: 50%;
    cursor: pointer;
    margin: 0 auto;
  }
  .album-list li .album-box{
    width: 95%;
    cursor: pointer;
    margin: 0 auto;
    box-sizing: border-box;
    transition: all .5s;
    padding: 5px;
    position: relative;
    overflow: hidden;
    border: 1px solid #fff;
    margin-top: 10px;
  }
  .desc{
    position: absolute;
    transition: all .5s;
    height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(0,0,0,0.8);
    font-size: 14px;
    color: #fff;
    bottom: -110px;
    padding: 5px;
    left: 0;
    line-height: 1.1;
  }
  .album-list li .album-box:hover{
    border:1px solid #42b983;
  }
  .album-list li .album-box:hover .desc{
    bottom: 0;
  }
  .album-list li .album-box:hover img{
    transform: scale(1.1);
  }
  .song-list-head {
    width: 100%;
  }
  .return{
    width: 120px;
    height: 40px;
    line-height: 40px;
    background: #42b983;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    margin-top: 20px;
  }
  .more{
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #dddddd;
    color: #333;
    margin-top: 10px;
    border: 1px solid #ccc;
    width: 1088px;
    cursor: pointer;
  }
  .more-dis{
    cursor: not-allowed;
    color: #999999;
  }
  #app .song-list-head li {
    float: left;
    color: #333;
    height: 48px;
    line-height: 48px;
    background: #fff;
  }
  #app .song-list-head .song-list-title{
    background: #dddddd;
  }
  #app .song-list-head .doubel li{
    background: #fbfbfd;
  }
  #app .song-list-head .song-name {
    text-indent: 20px;
    width: 47.685185%;
    position: relative;
    white-space: normal
  }
  #app .song-list-head div:hover em{
    display: block;
  }
  #app .song-list-head .song-name em{
    display: block;
    width: 37px;
    height: 37px;
    background: url("../qmusic/icon_list_menu.png");
    position: absolute;
    top: 5px;
    display: none;
    cursor: pointer;
  }
  #app .song-list-head .song-name .play{
    background-position: left top;
    right: 50px;
  }
  #app .song-list-head .song-name .play:hover{
    background-position: -40px top;
  }
  #app .song-list-head .song-name .add{
    background-position: left -80px;
    right: 5px;
  }
  #app .song-list-head .song-name .add:hover{
    background-position: -40px -80px;
  }
  #app .song-list-head .song-name i{
    font-style: normal;
    color: #999;
    margin-right: 10px;
  }
  #app .song-list-head .song-name .only{
    border-radius: 2px;
    border: 1px solid #42b983;
    margin-left: 10px;
    right: 34px;
    width: 30px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    text-indent: 0;
    font-size: 12px;
    top: 9px;
    color: #42b983;
  }

  #app .song-list-head .song-album {
    padding-left: 20px;
    width: 23.611111%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #app .song-list-head .song-album a{
    color: #666;
  }
  #app .song-list-head .song-album a:hover{
    color: #42b983;
  }
  #app .song-list-head .song-time-wrapper {
    width: 26%;
  }

  #app .song-list-head .song-time {
    width: 50px;
  }

  .singer-wrapper {
    width: 100%;
    background: #f5f5f5;
    margin-top: 30px;
  }

  .singer-detail {
    width: 1100px;
    margin: 0 auto;
    text-align: left;
    background: #f5f5f5;
  }

  .singer-detail .singer-avatar {
    border-radius: 50%;
    display: block;
    float: left;
  }

  .singer-detail .singer-info {
    float: left;
    margin-left: 50px;
  }

  .singer-title {
    padding: 20px 0;
  }

  .singer-info h2 {
    font-size: 32px;
    margin: 40px 0 10px 0;
  }

  .singer-info span {
    font-size: 18px;
    margin-right: 10px;
  }

  .singer-info span strong {
    font-size: 22px;
    font-weight: normal;
  }
</style>
