<template>
  <div class="player-wrapper"  @mouseup="upFn"  @mousemove="moveFn">
    <transition name="slide">
      <div class="player clear-fix" v-show="fullScreen">
        <div class="background" >
          <img v-if="currentSong.albummid" :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${currentSong.albummid}.jpg?max_age=2592000`">
        </div>
        <div class="bg-mask"></div>
        <div class="music-list-wrapper">
          <h4><span v-for="(item,index) in switchText" @click="switchFn(index)" :class="{'slt':index==swicthIndex}">{{item.text}}</span><span class="clear" @click="showConfirm">{{clearText}}</span></h4>
          <v-songlist v-show="swicthIndex==0" :musicList="musicList" @del="del" @play="play" @toggleScreen="toggleScreen" ref="songlist" ></v-songlist>
          <v-songlist v-show="swicthIndex==1" :isRecent="isRecent" :musicList="recentList" @delRecent="delRecent" @playRecent="playRecent" @toggleScreen="toggleScreen"></v-songlist>
        </div>
        <div class="song-detail">
          <div class="song-info">
            <div class="player-img">
              <span>
                <img v-if="currentSong.albummid"
                     onerror="this.src='//y.gtimg.cn/mediastyle/yqq/extra/player_cover.png?max_age=31536000';this.onerror=null;"
                     :src="`https://y.gtimg.cn/music/photo_new/T002R300x300M000${currentSong.albummid}.jpg?max_age=2592000`">
                <img v-if="!currentSong.albummid" src="//y.gtimg.cn/mediastyle/yqq/extra/player_cover.png?max_age=31536000">
              </span>
            </div>
            <p v-if="currentSong.songname">歌曲名:{{currentSong.songname}}</p>
            <p v-if="currentSong.singer">歌手名:<span v-for="singer in currentSong.singer">{{singer.name}}</span></p>
            <p v-if="currentSong.albumname">专辑名:{{currentSong.albumname}}</p>
          </div>
          <div class="lyric-wrapper">
            <div v-if="currentLyric" class="lyric-box" ref="lyricBox">
              <p ref="lyricLine"
                 class="text"
                 :class="{'current': currentLineNum ===index}"
                 v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="mini-player">
      <div class="mini-player-box clear-fix">
        <p class="song-lyric">{{playingLyric}}</p>
        <div class="control-btn">
          <a class="btn-prev" @click="prevSong"></a>
          <a :class="playClass" @click="togglePlay"></a>
          <a class="btn-next" @click="nextSong"></a>
        </div>
        <div class="progress-bar-wrapper">
          <div class="song-info clear-fix">
            <span class="song-name">{{currentSong.songname}}<i v-for="(item,index) in currentSong.singer" @click="toSinger(item)">{{item.name}}</i></span>

            <span class="song-time">{{currentTime | format}}/<span v-show="currentSong.interval">{{currentSong.interval | format}}</span></span>
          </div>
          <div class="progress-bar" @click="changeTime" ref="progressBar">
            <p :style="barStyle" ref="progress"></p>
            <!--<span class="dot" :style="dotStyle" @mousedown.stop.prevent="dotDown" @mousemove.stop.prevent="dotMove" @mouseup.stop.prevent="dotUp" ></span>-->
            <span class="dot" :style="dotStyle" ></span>
          </div>
        </div>
        <div class="play-mod clear-fix">
          <em  class="mod" @click="changeMod" :class="{'sequen-play':mod==0,'random-play':mod==1,'singles-play':mod==2,'lists-play':mod==3}" :title="modTitle"></em>
          <em class="like" @click="toggleLike" :class="{'slt-like':currentSong.isLike}"></em>
          <div class="volume-wrapper">
            <em class="volume" @click="toggleVolume" :style="volumeStyle"></em>
            <div class="volume-line" @click.stop="changeVolume">
              <p ref="volume"></p>
              <span class="volume-circle" ref="circle" @mousedown.stop="startFn"></span>
            </div>
          </div>
        </div>
      </div>
      <span class="toggle" @click="toggleScreen">{{toggleText}}</span>
      <audio ref="audio" v-if="currentSong.songid" :src="`http://ws.stream.qqmusic.qq.com/${currentSong.songid}.m4a?fromtag=46`"
             @play="ready" @timeupdate="updateTime" @ended="end" @error="error"></audio>
    </div>
    <transition name="fade">
      <v-confirm :msg="confirmText" v-show="confirmShow" @sureFn="clearAll" @cancelFn="hideConfirm"></v-confirm>
    </transition>
  </div>
</template>

<script>
  import {mapState,mapMutations,mapActions} from 'vuex'
  import Songlist from './Songlist.vue'
  import VSonglist from './Songlist'
  import Confirm from './Confirm.vue'
  import Lyric from 'lyric-parser'
  import {getLyric} from 'api/musicapi'
  import {Base64} from 'js-base64'
  export default{
    data(){
      return {
        confirmShow:false,
        songReady:false,
        hasVolume:true,
        currentLyric:null,
        playingLyric:"",
        volume:1,
        currentLineNum:0,
        currentTime:0,
        isRecent:true,
        switchText:[
          {'text':'播放列表','code':'play'},
          {'text':'最近播放','code':'recent'}
        ],
        swicthIndex:0,
        recentList:[],
        toggleText:'展开',
        followArr:[],
        mod:0,      //0 顺序播放（sequential） 1 随机播放（random） 2单曲循环（singles） 3列表循环（lists）
        barStyle:{
          width:'0%'
        },
        dotStyle:{
          left:'0%'
        }
      }
    },
    computed:{
      ...mapState([
        'musicList','playing','currentIndex','fullScreen','autoPlay','singer','singerObj'
      ]),
      volumeStyle(){
        if(!this.hasVolume){
          return {
            backgroundPosition:'left -182px'
          }
        }else{
          return {
            backgroundPosition:'left -144px'
          }
        }
      },
      clearText(){
        if(this.swicthIndex==0){
          return '清空播放列表'
        }else{
          return '清空最近播放'
        }
      },
      confirmText(){
        if(this.swicthIndex==0){
          return '确认清空播放列表吗?'
        }else{
          return '确认清空最近播放吗？'
        }
      },
      modTitle(){
        switch (this.mod){
          case 0 :
            return '顺序播放'
            break;
          case 1 :
            return '随机播放'
            break;
          case 2 :
            return '单曲循环'
            break;
          case 3 :
            return '列表循环'
            break;
        }
      },
      currentSong(){
        if(this.musicList[this.currentIndex]){
          getLyric(this.musicList[this.currentIndex].musicData.songmid).then((res)=>{
            if(this.playing){
              this.currentLyric=new Lyric(Base64.decode(res.lyric),this.handleLyric)
              this.currentLyric.play()
            }
          })
        }
        var music=this.musicList[this.currentIndex]
        if(music){
          if(music.musicData){
            return music.musicData
          }else if(music.data){
            return music.data
          }else{
            return {}
          }
        }else{
          return {}
        }
      },
      playClass(){
        return this.playing?'btn-play btn-pause':'btn-play'
      },
      percent(){
        return this.currentTime/this.currentSong.interval
      }
    },
    methods:{
      ...mapMutations([
        'setFullScreen','setPlaying','setCurrentIndex','delMusic','setAutoPlay','clearMusic','setSinger','setSingerShow'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
          'id':singer.mid,
          'name':singer.name
        },this.singerObj)
        this.setSingerShow(false)
      },
      handleLyric({lineNum, txt}){
        if(this.playing){
          this.currentLineNum = lineNum
          this.playingLyric=this.currentLyric.lines[lineNum].txt
          if(lineNum>2){
            this.$refs.lyricBox.style.transform=`translateY(${(lineNum-2)*-34}px)`
          }else{
            this.$refs.lyricBox.style.transform=`translateY(0px)`
          }
        }
      },
      startFn(e){
        this.volumeMouse.init=false
        this.volumeMouse.startX=e.pageX
        this.volumeMouse.startVolume=this.volume
      },
      moveFn(e){
        if(this.volumeMouse.init==undefined||this.volumeMouse.init){
          return
        }
        var deltaX=e.pageX-this.volumeMouse.startX
        var width=document.querySelector('.volume-line').clientWidth
        this.volume=this.volumeMouse.startVolume+(deltaX/width)
      },
      upFn(){
        this.volumeMouse.init=true
      },
      changeVolume(e){
        if(!this.volumeMouse.init){
          return
        }
        var audio=this.$refs.audio
        var left=document.querySelector('.volume-line').getBoundingClientRect().left
        var width=document.querySelector('.volume-line').clientWidth
        var vol=(e.pageX-left)/width>1?1:(e.pageX-left)/width<0?0:(e.pageX-left)/width
        this.volume=vol
         if(audio){
          audio.volume = vol
        }
//        this.$refs.volume.style.width=e.pageX-left+'px'
//        this.$refs.circle.style.left=e.pageX-left+'px'
      },
      toggleVolume(){
        this.$nextTick(()=>{
          var audio=this.$refs.audio
          if(audio){
            this.hasVolume=!this.hasVolume
            if(this.hasVolume){
              audio.volume = 1
              this.volume=1
            }else{
              audio.volume = 0
              this.volume=0
            }
          }else{
            this.$dialog.center("没有歌曲，不能设置")
          }
        })
      },
      hideConfirm(){
        this.confirmShow=false
      },
      showConfirm(){
//        this.$refs.songlist.alt('父组件触发子组件事件')
        if(this.musicList.length==0&&this.clearText=='清空播放列表'){
          this.$dialog.center('播放列表空空的哦!',{
            background:'#fff',
            color:'#333'
          })
          return
        }else if(this.recentList.length==0&&this.clearText=='清空最近播放'){
          this.$dialog.center('最近播放空空的哦!',{
            background:'#fff',
            color:'#333'
          })
          return
        }
        this.confirmShow=true
      },
      switchFn(index){
        this.swicthIndex=index
        if(index==1){
          if(window.localStorage.getItem('recentMusicList')){
            this.recentList=JSON.parse(window.localStorage.getItem('recentMusicList'))
          }
        }
      },
      clearAll(){
        this.confirmShow=false
        if(this.swicthIndex==0){
          this.clearMusic()
        }else{
          window.localStorage.removeItem('recentMusicList')
          this.recentList=[]
        }
      },
      delRecent(index){
        this.recentList.splice(index,1)
        window.localStorage.setItem('recentMusicList',JSON.stringify(this.recentList))
      },
      playRecent(index,item,flag){
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
      toggleScreen(){
        this.setFullScreen(!this.fullScreen)
        if(this.toggleText=='展开'){
          this.toggleText='收起'
        }else{
          this.toggleText='展开'
        }
      },
      toggleLike(){
        if(!this.currentSong.songid){
          return
        }
        var item=this.currentSong
        var now=new Date().getTime();
        this.$set(item,'joinTime',now);
        if (item.isLike === undefined) {
          this.$set(item, 'isLike', false);
//          https://y.gtimg.cn/music/photo_new/T002R300x300M000004FES4i1g0uWJ.jpg?max_age=2592000
//          004FES4i1g0uWJ
          this.$set(item,'avatar',`https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.currentSong.albummid}.jpg?max_age=2592000`)
        }
        item.isLike = !item.isLike;
        if (item.isLike) {
          this.followArr.unshift(item);
        } else {
          for (var i = 0; i < this.followArr.length; i++) {
            if (item.songid === this.followArr[i].songid) {
              this.followArr.splice(i, 1);
            }
          }
        }
        window.localStorage.setItem('followQmusicArr', JSON.stringify(this.followArr));
        this.$emit('getMusic')
      },
      changeMod(){
        switch (this.mod){
          case 0:
            this.mod=1
            break;
          case 1:
            this.mod=2
            break;
          case 2:
            this.mod=3
            break;
          case 3:
            this.mod=0
            break;
        }
      },
      play(idx){
        this.setCurrentIndex(idx)
        this.setPlaying(true)
        this.loop()
      },
      del(idx){
        this.delMusic(idx)
        this.setCurrentIndex(this.currentIndex-1)
      },
      dotDown(e){
        this.mouse.init=true
        this.mouse.startX=e.pageX
        this.mouse.width=this.$refs.progressBar.clientWidth
      },
      dotMove(e){
        if(!this.mouse.init){
          return
        }
        var deltaX=e.pageX-this.mouse.startX
        var width=this.$refs.progress.clientWidth
        this.offset(width+deltaX)
      },
      dotUp(){
        this.mouse.init=false
      },
      ready(){
        this.songReady=true
      },
      error(){
        this.songReady=true
      },
      togglePlay(){
        if(!this.currentSong.songid){
          this.$dialog.center('暂无歌曲！',{
            background:'#fff',
            color:'#333'
          })
          return
        }
        this.setPlaying(!this.playing)
        if(this.currentLyric){
          this.currentLyric.togglePlay()
        }
      },
      prevSong(){
        if(!this.currentSong.songid){
          return
        }
        if(this.mod!=1){
          var index=this.currentIndex-1
          if(index<0){
            index=this.musicList.length-1
          }
          this.setCurrentIndex(index)
        }else{
          this.setCurrentIndex(Math.floor(Math.random()*this.musicList.length))
        }
        this.loop()
      },
      nextSong(){
        if(!this.currentSong.songid){
          return
        }
        if(this.mod!=1){
          var index=this.currentIndex+1
          if(index>this.musicList.length-1){
            index=0
          }
          this.setCurrentIndex(index)
        }else{
          this.setCurrentIndex(Math.floor(Math.random()*this.musicList.length))
        }
        this.loop()
      },
      updateTime(e){
        if(!this.currentSong.songid){
          return
        }
        this.currentTime = e.target.currentTime|0
      },
      end(){
        switch (this.mod){
          case 0:
              this.setCurrentIndex(this.currentIndex+1)
              if(this.currentIndex==this.musicList.length){
                this.setCurrentIndex(this.musicList.length-1)
                this.$refs.audio.currentTime=0
                this.setAutoPlay(false)
                this.setPlaying(false)
              }
            break;
          case 1:
              this.setCurrentIndex(Math.floor(Math.random()*this.musicList.length))
              this.loop()
            break;
          case 2:
            this.setCurrentIndex(this.currentIndex)
            this.loop()
            break;
          case 3:
              if(this.currentIndex==this.musicList.length-1){
                this.setCurrentIndex(0)
              }else{
                this.setCurrentIndex(this.currentIndex+1)
              }
              this.loop()
            break;
        }
      },
      loop(){
        this.$nextTick(()=>{
          var audio= this.$refs.audio
          audio.currentTime=0
          if (this.currentLyric) {    //重置歌词
            this.currentLyric.stop()
//            this.currentLyric.seek(0)
            this.currentTime = 0
            this.currentLineNum = 0
            this.playingLyric=''
          }
          audio.play()
        })
      },
      changeTime(e){
        if(this.mouse.init || !this.currentSong.songid){
          return
        }
        var pageX=e.pageX
        this.trigerPecent(pageX)
      },
      offset(width){
        this.dotStyle={
          left:width+'px'
        }
        this.barStyle={
          width:width+'px'
        }
      },
      trigerPecent(pageX){
        var rect = this.$refs.progressBar.getBoundingClientRect()
        var width=this.$refs.progressBar.clientWidth
        this.$refs.audio.currentTime=(pageX-rect.left)/width*this.currentSong.interval
        if(this.currentLyric){
          this.currentLyric.seek(this.$refs.audio.currentTime*1000)
        }
      },
      getFollowMusic(){
        if (window.localStorage.getItem("followQmusicArr") != null) {
          this.followArr = JSON.parse(window.localStorage.getItem("followQmusicArr"));
          for (var j = 0; j < this.followArr.length; j++) {
            if (this.currentSong.songid == this.followArr[j].songid) {
              this.$set(this.currentSong, "isLike", true);
            }else{
              this.$set(this.currentSong, "isLike", false);
            }
          }
          if(this.followArr.length==0){
            this.$set(this.currentSong, "isLike", false);
          }
        }
      }
    },
    watch:{
      volume(newVal){
        newVal=newVal>1?1:newVal<0?0:newVal
        if(newVal==0){
          this.hasVolume=false
        }else{
          this.hasVolume=true
        }
        var width=document.querySelector('.volume-line').clientWidth
        this.$refs.volume.style.width=newVal*width+'px'
        this.$refs.circle.style.left=newVal*width+'px'
      },
      musicList(newVal){
        if(newVal.length==0){
          this.setPlaying(false)
          this.currentTime=0
        }
      },
      playing(newVal){
        this.$nextTick(()=>{
          var audio=this.$refs.audio
          if(this.currentSong.songid){
            newVal?audio.play():audio.pause()
          }
        })
      },
      currentSong(newSong,oldSong){
        if (this.currentLyric) {    //重置歌词
          this.currentLyric.stop()
          this.currentTime = 0
          this.currentLineNum = 0
          this.playingLyric=''
        }
        if(newSong.songname){
          for (var j = 0; j < this.followArr.length; j++) {
            if (newSong.songid == this.followArr[j].songid) {
              this.$set(newSong, "isLike", true);
            }
          }
        }
        if(newSong.songname&&this.autoPlay){
          this.$nextTick(()=>{
            var audio=this.$refs.audio
            audio.play()
          })
        }
      },
      percent(newVal){
        var width=newVal*this.$refs.progressBar.clientWidth|0
        this.offset(width)
      }
    },
    components:{
      VSonglist,
      'v-songlist':Songlist,
      'v-confirm':Confirm
    },
    filters:{
      format(val) {
        var second = ''
        var minute = ''
        second = Math.floor(val / 60)
        if (val % 60 == 0) {
          minute = '00'
        } else if (val % 60 >= 10) {
          minute = val % 60
        } else {
          minute = '0' + val % 60
        }
        return second + ':' + minute
      }
    },
    mounted(){
      this.mouse={}
      this.volumeMouse={}
      if (window.localStorage.getItem("followQmusicArr") != null) {
        this.followArr = JSON.parse(window.localStorage.getItem("followQmusicArr"));
      }
    }
  }
</script>

<style>

  .player-img span{
    position: relative;
  }
  .player-img span:after{
    content: "";
    position: absolute;
    left: 9px;
    top: -169px;
    z-index: -1;
    width: 201px;
    height: 180px;
    background: url(./album_cover_player.png);
  }
  .song-lyric{
    position: absolute;
    top:3px;
    left: 0;
    z-index: -1;
    text-align: center;
    width: 90%;
  }
  .lyric-wrapper{
    margin-top: 20px;
    height: 210px;
    overflow: hidden;
  }
  .lyric-wrapper .lyric-box{
    width: 100%;
  }
  .lyric-wrapper p{
    line-height: 34px;
  }
  .lyric-box{
    transition: all .5s;
  }
  .lyric-wrapper .current{
    color: #31c27c;
    background: none;
  }
  .music-list-wrapper h4{
    position: relative;
  }
  .music-list-wrapper h4 .clear{
    text-align: center;
    display: inline-block;
    border: 1px solid #fff;
    cursor: pointer;
    position: absolute;
    right: 10px;
    opacity: .8;
    top: 0;
    font-size: 14px;
    padding: 6px 14px;
  }
  .music-list-wrapper h4 .clear:hover{
    opacity: 1;
  }
  ::-webkit-scrollbar/*整体部分*/
  {
    width: 10px;
    height:10px;
  }

  ::-webkit-scrollbar-track/*滑动轨道*/
  {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0px;
    background: rgba(255,255,255,0.1);
  }

  ::-webkit-scrollbar-thumb/*滑块*/
  {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(255,255,255,0.2);
  }

  ::-webkit-scrollbar-thumb:hover/*滑块效果*/
  {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(255,255,255,0.4);
  }
  .music-list-wrapper h4 span{
    display: inline-block;
    margin: 10px;
    padding: 4px 10px;
    border: 1px solid #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  .music-list-wrapper h4 .slt{
    background: #fff;
    color: #42b983;
  }
  .song-detail{
    float: left;
    width: 36%;
    text-align: center;
  }
  .song-detail .lyric-wrapper{
    overflow: hidden;
    height: 210px;
  }
  .song-detail .lyric-wrapper p{
    width: 100%;
  }
  .song-info img{
    width: 186px;
    height: 186px;
    margin-top: 50px;
  }
  .progress-bar-wrapper{
    float: left;
    width: 66%;
  }
  .play-mod{
    float: left;
    width: 16%;
    height: 100%;
    position: relative;
  }
  .play-mod em{
    display: block;
    width: 27px;
    height: 22px;
    background: url("../qmusic/player.png") ;
    position: absolute;
    top: 16px;
    cursor: pointer;
  }
  .play-mod .mod{
    background-position: left -260px;
    left: 0;
  }
  .play-mod .sequen-play{
    background-position: left -260px;
  }
  .play-mod .random-play{
    background-position: left -74px;
  }
  .play-mod .singles-play{
    background-position: left -232px;
  }
  .play-mod .lists-play{
    background-position: left -205px;
  }
  .play-mod .like{
    background-position: left -96px;
    left: 40px;
  }
  .play-mod .volume{
    background-position: left -144px;
    left: 0px;
  }
  .volume-wrapper{
    position: relative;
    left: 80px;
  }
  .volume-line{
    width: 100px;
    height: 4px;
    border-bottom: 2px solid #fff;
    cursor: pointer;
    position: absolute;
    top:21px;
    left: 28px;
  }
  .volume-line p{
    height: 2px;
    position: absolute;
    left: 0;
    top: 4px;
    width: 100px;
    background: #42b983;
  }
  .volume-circle{
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    right: 0;
    top:0;
    background: #fff;
  }
  .play-mod .slt-like{
    background-position: -30px -96px;
  }

  .toggle{
    position: absolute;
    right: 40px;
    bottom: 20px;
    cursor: pointer;
    user-select: none;
  }

  .music-list-wrapper{
    width: 55%;
    padding: 20px 50px 0 50px;
    float: left;
  }
  .music-list-wrapper h4{
    text-align: center;
    font-weight: normal;
    margin: 10px;
  }

  .song-info{
    width: 100%;
    padding: 5px ;
    margin: 0 auto;
  }
  .progress-bar{
    width: 85%;
    cursor: pointer;
    margin: 0 auto;
    position: relative;
    height: 4px;
    padding-bottom: 2px;
    border-bottom: 2px solid #fff;
  }
  .progress-bar p{
    cursor: pointer;
    width: 0%;
    transition: all .1s;
    position: absolute;
    left: 0;
    top:6px;
    height: 2px;
    background: #42b983;
  }
  .progress-bar .dot{
    cursor: pointer;
    transition: all .1s;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    left: 0;
    top: 1px;
  }
  .progress-bar-wrapper .song-info .song-name{
    font-size: 16px;
    max-width: 180px;
    height: 20px;
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
  }
  .song-name i{
    color: #fff;
    cursor: pointer;
    font-style: normal;
    margin-left: 10px;
    max-width: 100px;
    height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .song-name i:hover{
    color: #42b983;
  }
  .song-time{
    float: right;
    margin-right: 80px;
  }
  .player-wrapper{
    text-align: left;
     color:#fff;
  }
  .control-btn{
    height: 100%;
    width: 14%;
    float: left;
  }
  .mini-player-box{
    width: 80%;
    position: relative;
    margin: 0 auto;
  }
  .mini-player-box .btn-prev,.mini-player-box .btn-next{
    width: 19px;
    height: 20px;
    display: inline-block;
    background: url("./player.png");
    position: relative;
    top:10px;
  }
  .mini-player-box .btn-play{
    width: 21px;
    height: 29px;
    display: inline-block;
    background: url("./player.png");
    position: relative;
    top:15px;
    margin: 0 40px;
    background-position: left top;
  }
  .mini-player-box .btn-pause{
    background-position: -30px top;
  }
  .mini-player-box .btn-prev{
    background-position: left -30px;
  }
  .mini-player-box .btn-next{
    background-position: left -52px;
  }
  .player{
    position: fixed;
    top:0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    left: 0;
  }
  .background{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    filter:blur(60px);
    -webkit-filter: blur(60px);
    z-index: -1;
    opacity: .9;
  }
  .bg-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -3;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.95);
  }
  .background img{
    width: 140%;
    height: 140%;
  }
  .mini-player{
    position: fixed;
    bottom:0;
    width: 100%;
    height: 60px;
    background: rgba(0,0,0,0.6);
    z-index: 1000;
    left: 0;
  }
</style>
