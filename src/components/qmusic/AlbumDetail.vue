<template>
  <transition name="slide">
    <div class="song-detail-wrapper" @click="hideMore">
      <div class="song-detail-box">
        <div class="song-detail-head clear-fix">
          <div class="song-img">
            <img v-if="detailObj.mid" :src="`//y.gtimg.cn/music/photo_new/T002R300x300M000${detailObj.mid}.jpg?max_age=2592000`">
            <i></i>
          </div>
          <div class="song-info">
            <h2 class="song-name">{{detailObj.name}}</h2>
            <p>歌手: <span class="singer-name" @click="toSinger(detailObj,true)">{{detailObj.singername}}</span></p>
            <div>
              <span class="first-span">发行时间:{{detailObj.aDate}}</span><span>语种: {{detailObj.lan}}</span>
            </div>
            <div>
              <span class="first-span">流派: {{detailObj.genre}}</span><span>发行公司: <a @click="toCompanyDetail(detailObj)">{{detailObj.company}}</a></span>
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
                  <div class="clear-fix" v-for="(item,index) in detailObj.list" :class="{'doubel':index%2==0}" >
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
  </transition>
</template>

<script>
  import { getAlbumDetail } from 'api/musicapi'
  import {mapState,mapMutations,mapActions} from 'vuex'
  export default{
    data(){
      return {
        detailObj:{},
        moreShow:false,
        moreStyle:{}
      }
    },
    computed:{
      ...mapState([
        'songName','musicList'
      ])
    },
    methods:{
      ...mapMutations([
        'setSinger','setSingerShow','addMusicList','setCurrentIndex','setPlaying','addMuisc','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      toCompanyDetail(company){
        console.log(company.company_new.id)
        this.$router.push(`/qmusic/companydetail/${company.company_new.id}`)
      },
      toSongDetail(song){
        this.setSongName(song.songname)
        this.$router.push(`/qmusic/songdetail/${song.albummid}`)
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
      showMore(e){
        this.moreShow=true
        this.moreStyle={
          left:e.target.offsetLeft-590+'px',
          top:e.target.offsetTop-100+'px'
        }
      },
      hideMore(){
        this.moreShow=false
      },
      toSinger(singer,flag){
        if(flag){
          this.$router.push(`/qmusic/singer/${singer.singermid}`)
          this.setSinger({
            'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.singermid}.jpg?max_age=2592000`,
            'id':singer.singermid,
            'name':singer.singername
          },{})
        }else{
          this.$router.push(`/qmusic/singer/${singer.mid}`)
          this.setSinger({
            'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
            'id':singer.mid,
            'name':singer.name
          },{})
        }
        this.setSingerShow(false)
      },
      playAll(){
        var songArr = []
        this.detailObj.list.forEach((item) => {
          songArr.push({
            musicData: item
          })
        })
        this.addMusicList(songArr)
        this.setCurrentIndex(0)
        this.setPlaying(true)
      },
    },
    watch:{

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
    mounted(){
      getAlbumDetail(this.$router.currentRoute.params.id).then((res)=>{
        console.log(res)
        this.detailObj=res.data
      })
    }
  }
</script>

<style>

  .arrow{
    position: absolute;
    top: 100px;
    right: -11px;
    width: 11px;
    height: 17px;
    background:url("https://y.gtimg.cn/mediastyle/yqq/img/popup_arrow.png") ;
  }
  .about-wrapper{
    position: relative;
    min-height: 600px;
    margin-top: 20px;
  }
  .song-info  .singer-name:hover{
    color: #42b983;
  }
  .about-con{
    position: absolute;
    top: 364px;
    right: 303px;
    width: 580px;
    background: #fff;
    box-shadow: 0 0 4px rgba(0,0,0,.35);
    border-radius: 4px;
  }
  .popup-about{
    white-space: pre-line;
    max-height: 400px;
    font-size: 14px;
    line-height: 22px;
    margin: 30px 5px 30px 10px;
    overflow-y: auto
  }
  .popup-about p{
    margin-bottom: 15px;
    line-height: 18px;
  }
  .detail-other{
    width: 30%;
    float: left;
  }
  .detail-other .more{
    background: #fff;
    border: none;
    font-size: 14px;
  }
  .detail-other .more:hover{
    color: #42b983;
  }
  .detail-other .about-tit,.popup-about .about-tit{
    font-size: 20px;
    font-weight: 400;
    line-height: 46px;
  }
  .about-content{
    max-height: 88px;
    overflow: hidden;
    font-size: 14px;
    line-height: 22px;
    color: #333;
  }
  .songlist-box{
    width: 70%;
    float: left;
    min-height: 20px;
  }
  .about-wrapper .songlist-box p{
    font-size: 14px;
    line-height: 26px;
    color: #666666;
  }
  .song-info div{
    margin: 8px 0;
  }
  .song-detail-head .song-info div .first-span{
    width: 150px;
  }
  .song-detail-head .song-info div span{
    font-size: 14px;
    overflow: hidden;
    display: inline-block;
    height: 18px;
    color: #666;
  }
  .song-detail-head .song-info div .play-btn{
    display: inline-block;
    width: 110px;
    height: 38px;
    text-align: center;
    color: #fff;
    line-height: 38px;
    border-radius: 4px;
    background: #42b983;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  .song-info .song-name{
    font-size: 31px;
    line-height: 50px;
    font-weight: 400;
    white-space: nowrap;
    height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .singer-name{
    margin-right: 2px;
  }
  .song-info .singer-name{
    font-size: 16px;
    color: #333;
    text-align: left;

  }
  .song-detail-wrapper{
    margin-top: 20px;
    width: 100%;
    background: #fff;
  }
  .song-detail-box{
    width: 1180px;
    text-align: left;
    margin: 0 auto;
  }
  .song-detail-head{
    padding-top: 50px;
  }
  .song-detail-head .song-img{
    width: 250px;
    height: 250px;
    float: left;
    overflow: visible;
    position: relative;
  }

  .song-img i{
    content: "";
    position: absolute;
    right: -35px;
    top: -2px;
    z-index: 10;
    width: 280px;
    height: 250px;
    background: url(./album_cover_player.png) no-repeat;
    background-size: contain;
  }
  .song-detail-head .song-info{
    float: left;
    width: 865px;
    margin-left: 50px;
  }
</style>
