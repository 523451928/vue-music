<template>
  <transition name="slide">
    <div class="song-detail-wrapper" @click="hideMore">
      <div class="song-detail-box">
        <div class="song-detail-head clear-fix">
          <div class="song-img">
            <img v-if="detailObj.mid" :src="`//y.gtimg.cn/music/photo_new/T002R300x300M000${detailObj.mid}.jpg?max_age=2592000`">
          </div>
          <div class="song-info">
            <h2 class="song-name">{{songName}}</h2>
            <p>歌手: <span class="singer-name" @click="toSinger(detailObj)">{{detailObj.singername}}</span></p>
            <div>
              <span class="first-span">专辑: <a @click="toAlbumDetail(detailObj)">{{detailObj.name}}</a> </span><span>语种: {{detailObj.lan}}</span>
            </div>
            <div>
              <span class="first-span">流派: {{detailObj.genre}}</span><span>发行公司: <a  @click="toCompanyDetail(detailObj)">{{detailObj.company}}</a></span>
            </div>
            <div>
              <span>发行时间:{{detailObj.aDate}}</span>
            </div>
            <div>
              <span class="play-btn" @click="playSong(1,true)">播放</span>
            </div>
          </div>
        </div>
        <div class="about-wrapper clear-fix">
          <div class="lyric-box">
            <p v-for="(line,index) in currentLyric.lines">
              {{line.txt}}
            </p>
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
                {{descArr}}
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
  import { getSongDetail ,getLyric,getSongLyric , getCompanyDetail} from 'api/musicapi'
  import Lyric from 'lyric-parser'
  import {Base64} from 'js-base64'
  import {mapState,mapMutations,mapActions} from 'vuex'
  export default{
    data(){
      return {
        detailObj:{},
        currentLyric:'',
        moreShow:false,
        moreStyle:{}
      }
    },
    computed:{
      ...mapState([
        'songName','musicList'
      ]),
      descArr(){
        if(this.detailObj.desc){
          return this.detailObj.desc
        }
      }
    },
    methods:{
      ...mapMutations([
        'setSinger','setSingerShow'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
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
      toCompanyDetail(company){
        console.log(company.company_new.id)
        this.$router.push(`/qmusic/companydetail/${company.company_new.id}`)
      },
      toAlbumDetail(album){
          this.$router.push(`/qmusic/albumdetail/${album.mid}`)
      },
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.singermid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.singermid}.jpg?max_age=2592000`,
          'id':singer.singermid,
          'name':singer.singername
        },{})
        this.setSingerShow(false)
      },
      playSong(index,flag){
        var songObj = {}
        this.detailObj.list.forEach((item,index)=>{
          if(item.songname==this.songName){
              songObj.musicData = item
          }
        })

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
      }
    },
    watch:{

    },
    mounted(){
      getSongDetail(this.$router.currentRoute.params.id).then((res)=>{
        console.log(res)
        this.detailObj=res.data
        this.detailObj.list.forEach((item,index)=>{
          if(item.songname==this.songName){
            getLyric(item.songmid).then((res)=>{
                this.currentLyric=new Lyric(Base64.decode(res.lyric))
            })
          }
        })
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
  .lyric-box{
    width: 70%;
    float: left;
    min-height: 20px;
  }
  .about-wrapper .lyric-box p{
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
  .first-span a:hover,.song-info span a:hover{
    color: #42b983;
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
    overflow: hidden;
    float: left;
  }
  .song-detail-head .song-info{
    float: left;
    width: 865px;
    margin-left: 50px;
  }
</style>
