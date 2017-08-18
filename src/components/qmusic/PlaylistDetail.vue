<template>
  <transition name="slide">
    <div class="palylist-detail">
      <div class="play-detail-box">
        <div class="song-detail-wrapper" @click="hideMore">
          <div class="song-detail-box">
            <div class="song-detail-head clear-fix">
              <div class="song-img">
                <img v-if="detailObj.logo" :src="detailObj.logo">
                <i></i>
              </div>
              <div class="song-info">
                <h2 class="song-name">{{detailObj.dissname}}</h2>
                <p>作者:<span class="nick-name" @click="toMyMusic(detailObj)">{{detailObj.nickname}}</span></p>
                <div>
                  <span class="first-span">标签:<a @click="toPlaylist(tag)" v-for="(tag,index) in detailObj.tags">{{tag.name}}</a></span>
                </div>
                <div>
                  <span class="first-span">播放量: {{detailObj.visitnum}}</span>
                </div>
                <div>
                  <span class="play-btn" @click="playAll()">播放全部</span>
                </div>
              </div>
            </div>
            <div class="about-wrapper clear-fix">
              <div class="songlist-box">
                <div class="song-list">
                  <div class="song-list-head">
                    <ul class="clear-fix">
                      <li class="song-name song-list-title">歌曲</li>
                      <li class="song-album song-list-title">歌手</li>
                      <li class="song-time-wrapper song-list-title">
                        <span class="song-time">时长</span>
                      </li>
                      <div class="clear-fix" v-for="(item,index) in detailObj.songlist" :class="{'doubel':index%2==0}" >
                        <li class="song-name"><i>{{index + 1}}</i><a @click="toSongDetail(item)">{{item.songname}}</a>
                          <span v-if="item.isonly" class="only">独家</span>
                          <em class="play" @click="selectItem(item,index,true)"></em>
                          <em class="add" @click="addItem(item,index,false)"></em>
                        </li>
                        <li class="song-album" >
                          <span class="singer-name" v-for="(singer,idx) in item.singer" @click="toSinger(singer,false)">{{singer.name}}</span>
                        </li>
                        <li class="song-time-wrapper">
                          <span class="song-time">{{item.interval | formatTime}}</span>
                        </li>
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="detail-other">
                <h4 class="about-tit">简介</h4>
                <div class="about-content">
                  {{detailObj.desc}}
                </div>
                <span class="more" @click.stop="showMore">[更多]</span>
              </div>
              <transition name="slide">
                <div class="about-con" v-show="moreShow" :style="moreStyle" @click.stop>
                  <div class="popup-about">
                    <h4 class="about-tit">专辑简介</h4>
                    {{detailObj.desc}}
                  </div>
                  <i class="arrow"></i>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {getPlaylistDetail,getProfile} from '../../api/musicapi'
  import {mapState,mapMutations,mapActions} from 'vuex'
  export default{
    data(){
      return {
        detailObj:{},
        moreShow:false,
        moreStyle:{}
      }
    },
    mounted(){
      getPlaylistDetail(this.$router.currentRoute.params.id).then((res)=>{
        var str=res.substring(13,res.length-1)
        this.detailObj=JSON.parse(str).cdlist[0]
        console.log(this.detailObj)
      })
    },
    computed:{
      ...mapState([
        'musicList'
      ])
    },
    methods:{
      ...mapMutations([
        'setSinger','setSingerShow','addMusicList','setCurrentIndex','setPlaying','addMuisc','setSongName','setUserInfo'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toMyMusic(obj){
        getProfile(obj.encrypt_uin).then((res)=>{
          this.setUserInfo(res.data)
          this.$router.push({
            path:'/qmusic/mymusic'
          })
        })
      },
      toPlaylist(tag){
        console.log(tag)
        this.$router.push({
          path: '/qmusic/playlist',
          query:{'categoryId':tag.id,'categoryName':tag.name}
        })
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
        },{})
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
      addItem(itm){
        var item={}
        item.musicData=itm
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
      playAll(){
        var songArr = []
        this.detailObj.songlist.forEach((item) => {
          songArr.push({
            musicData: item
          })
        })
        this.addMusicList(songArr)
        this.setCurrentIndex(0)
        this.setPlaying(true)
      },
      showMore(e){
        this.moreShow=true
        this.moreStyle={
          left:e.target.offsetLeft-590+'px',
          top:e.target.offsetTop-100+'px'
        }
      },
      hideMore(){
        this.moreShow=false
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
    watch:{

    }
  }
</script>

<style>
  .nick-name{
    cursor: pointer;
    transition: all .3s;
  }
  .nick-name:hover{
    color: #42b983;
  }
  .first-span a{
    margin-left: 5px;
  }
  .palylist-detail{
    margin-top: 20px;
    width: 100%;
    background: #fff;
    text-align: left;
  }
  .play-detail-box{
    width: 1180px;
    text-align: left;
    margin: 0 auto;
  }
</style>
