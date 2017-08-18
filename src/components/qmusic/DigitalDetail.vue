<template>
  <transition name="slide">
    <div class="song-detail-wrapper" @click="hideMore">
      <div class="song-detail-box">
        <div class="song-detail-head clear-fix">
          <div class="song-img">
            <img v-if="detailObj.album_mid" :src="`//y.gtimg.cn/music/photo_new/T002R300x300M000${detailObj.album_mid}.jpg?max_age=2592000`">
            <i></i>
          </div>
          <div class="song-info">
            <h2 class="song-name">{{detailObj.album_name}}</h2>
            <p>歌手: <span class="singer-name" v-for="(singer,index) in detailObj.singerinfo" @click="toSinger(singer,true)">{{singer.singername}}</span></p>
            <div>
              <span class="first-span">发行时间:{{detailObj.publictime}}</span><span>语种: {{albumObj.lan}}</span>
            </div>
            <div>
              <span class="first-span">流派: {{albumObj.genre}}</span><span>发行公司: <a @click="toCompanyDetail(albumObj.company_new)" v-if="albumObj.company">{{albumObj.company_new.name}}</a></span>
            </div>
            <span class="sale" v-if="detailObj.sale_info">已售{{detailObj.sale_info.album_count}}张</span>
            <div>
              <span class="play-btn" @click="playAll()">播放全部</span>
            </div>
          </div>
        </div>
        <div class="about-wrapper clear-fix">
          <div class="songlist-box">
            <div class="song-list">
              <div class="nav">
                <span v-for="(nav,index) in navArr" @click="changeNav($event,index)" :class="{'active':index==activeIndex}">{{nav}}</span>
              </div>
              <transition name="slide">
                <div class="song-list-head" v-show="activeIndex==0">
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
              </transition>
              <transition name="slide">
                <div class="funs" v-show="activeIndex==1">
                  <div class="nav no-border">
                    <span v-for="(nav,index) in funsNav" @click="changeFuns($event,index)" :class="{'active':index==funsIndex}">{{nav}}</span>
                  </div>
                  <div class="funs-wrapper">
                    <ul>
                      <li class="funs-item funs-head clearfix">
                        <div class="funs-rank">排名</div>
                        <div class="funs-nick">用户名称</div>
                        <div class="funs-contribution">贡献</div>
                      </li>
                      <li class="funs-item clearfix" v-for="(item,index) in funsArr" :class="{'funs-bg':index%2!==0}">
                        <div class="funs-rank"><span class="f-rank" :class="{'f-top-rank':beginNum+index==0||beginNum+index==1||beginNum+index==2}">{{beginNum+index+1}}</span></div>
                        <div class="funs-nick">
                          <!--<img :src="item.headurl"/>-->
                          <img
                               v-lazy="{'src':`${item.headurl}`,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                          <span>{{item.strNick}}</span>
                        </div>
                        <div class="funs-contribution">{{item.iScore}}张</div>
                      </li>
                    </ul>
                  </div>
                  <v-page :pageTotal="4" @changePage="changePage"></v-page>
                </div>
              </transition>
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
  import VPage from './Page.vue'
  import { getDigitalDetail , getAlbumDetail,getFunsRank } from 'api/musicapi'
  import {mapState,mapMutations,mapActions} from 'vuex'
  import {hasClass} from '../../assets/js/dom'
  export default{
    data(){
      return {
        detailObj:{},
        albumObj:{},
        funsObj:{},
        beginNum:0,
        funsSort:"uin_rank_peract_112",
        moreShow:false,
        moreStyle:{},
        activeIndex:0,
        funsIndex:0,
        navArr:['曲目列表','粉丝榜'],
        funsNav:['土豪榜','铁粉榜']
      }
    },
    computed:{
      ...mapState([
        'songName','musicList'
      ]),
      funsArr(){
        return this.funsObj[this.funsSort]
      }
    },
    methods:{
      ...mapMutations([
        'setSinger','setSingerShow','addMusicList','setCurrentIndex','setPlaying','addMuisc','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      changePage(num){
        this.beginNum=(num-1)*25
        getFunsRank((num-1)*25,num*25-1).then((res)=>{
          console.log(res)
          this.funsObj=res.data
        })
      },
      changeFuns(e,index){
        if(hasClass(e.target,'active')){
          return
        }
        if(index==0){
          this.funsSort='uin_rank_peract_112'
        }else{
          this.funsSort='uin_rank_peract_112_day'
        }
        this.funsIndex=index
      },
      changeNav(e,idx){
        if(hasClass(e.target,'active')){
          return
        }
        if(idx==1&&!this.funsObj.uin_rank_peract_112_day_count){
          getFunsRank(0,24).then((res)=>{
            console.log(res)
            this.funsObj=res.data
          })
        }
        this.activeIndex=idx
      },
      toCompanyDetail(company){
        this.$router.push(`/qmusic/companydetail/${company.id}`)
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
      }
    },
    components:{
      VPage
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
      getDigitalDetail(this.$router.currentRoute.params.id).then((res)=>{
        this.detailObj=res.data
        getAlbumDetail(res.data.album_mid).then((res)=>{
          this.albumObj=res.data
        })
      })
    }
  }
</script>

<style>
  #app .q-music .funs-wrapper li{
    width: 100%;
    color: #666666;
  }
  .f-rank{
    color: #666666;
    margin-left: 10px;
  }
  .f-top-rank{
    color: #ff6633;
  }
  .song-detail-box .detail-other{
    width: 27%;
    margin-left: 30px;
  }
  .funs-item{
    height: 60px;
    line-height: 60px;
  }
  .funs-head{
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    background: #f5f5f5;
  }
  .funs-bg{
    background: #fffbfb;
  }
  .funs-item .funs-rank{
    float: left;
    width: 10%;
  }
  .funs-item .funs-nick{
    float: left;
    width: 75%;
    height: 60px;
    line-height: 60px;
    position: relative;
  }
  .funs-item .funs-nick span{
    height: 60px;
    line-height: 60px;
    display: inline-block;
    position: absolute;
  }
  .funs-item .funs-nick img{
    width: 50px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 10px;
  }
  .funs-item .funs-contribution{
    float: left;
    width: 15%;
  }
  .funs .nav{
    text-align: left;
    border-bottom: 1px solid #dddddd;
  }
  .no-border{
    border: none;
  }
  .nav span{
    line-height: 55px;
    margin-right: 20px;
    cursor: pointer;
    color: #333;
  }
  .no-border span{
    margin-right: 12px;

  }
  .nav .active{
    color: #42b983;
  }
  .nav span:hover{
    color: #42b983;
  }

  .sale{
    color: #999;
    font-size: 14px;
  }
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
