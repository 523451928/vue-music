<template>
  <transition name="slide">
    <div class="my-music-wrapper">
      <div class="profile-wrapper">
        <div class="my-info">
          <img v-if="userInfo.creator" :src="userInfo.creator.headpic"/>
          <span v-if="userInfo.creator">{{userInfo.creator.nick}}</span>
          <span v-if="!userInfo.creator">赶紧去登录吧!</span>
        </div>
        <div class="my-nav">
          <span @click="changeNav(index)" v-for="(nav,index) in myNav" :class="{'active':index==navIndex}">{{nav}}</span>
        </div>
      </div>
      <div class="my-music-box">
        <transition name="slide">
          <div class="nothing" v-if="navIndex==0&&songList.length==0">暂无！</div>
          <div class="i-like" v-if="navIndex==0&&songList.length>0">
            <div >
              <div class="song-list-head">
                <ul class="clear-fix">
                  <li class="song-name song-list-title">歌曲</li>
                  <li class="song-album song-list-title">专辑</li>
                  <li class="song-time-wrapper song-list-title">
                    <span class="song-time">时长</span>
                  </li>
                  <div class="clear-fix" v-for="(item,index) in songList" :class="{'doubel':index%2==0}" >
                    <li class="song-name"><i>{{index + 1}}</i><a @click="toSongDetail(item)">{{item.songname}}</a>
                      <span v-if="item.isonly" class="only">独家</span>
                      <em class="play" @click="selectItem(item,index,true)"></em>
                      <em class="add" @click="addItem(item,index,false)"></em>
                    </li>
                    <li class="song-album"><a @click="toAlbumDetail(item)">{{item.albumname}}</a></li>
                    <li class="song-time-wrapper">
                      <span class="song-time">{{item.interval | formatTime}}</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </transition>
        <transition name="slide">
          <div class="i-song-list" v-if="navIndex==1&&userInfo.mydiss">
            <div class="song-list-header clearfix">
              <div>歌单</div>
              <div>曲目数</div>
              <div class="end-div">收听</div>
            </div>
            <div class="song-list-item clearfix" v-for="(item,index) in userInfo.mydiss.list" :class="{'bg-item':index%2!=0}">
              <div @click="toDetail(item)">
                <img :src="item.picurl"/> <span class="item-title">{{item.title}}</span>
              </div>
              <div>{{item.subtitle.split(" ")[0]}}</div>
              <div class="end-div">
                {{item.subtitle.split(" ")[4]}}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>
<script>
  import {getMySong} from '../api/musicapi'
  import {mapState,mapMutations,mapActions} from 'vuex'
  export default{
    data(){
      return {
        myNav:['我喜欢','我创建的歌单'],
        songList:[],
        navIndex:0
      }
    },
    computed:{
      ...mapState(
        ['userInfo','musicList']
      )
    },
    methods:{
      ...mapMutations([
        'setSingerShow','addMuisc','setCurrentIndex','setAutoPlay','setSinger','setSongName'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      changeNav(index){
        this.navIndex=index
      },
      toAlbumDetail(album){
        this.$router.push(`/qmusic/albumdetail/${album.albummid}`)
      },
      toDetail(item){
        this.$router.push(`/qmusic/playlistdetail/${item.dissid}`)
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
          if(this.musicList[i]==itm){
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
    },
    watch:{
      userInfo(val){
        if(val.mymusic){
          console.log(val.mymusic[0].id)
          getMySong(val.mymusic[0].id).then((res)=>{
            this.songList=JSON.parse(res.substring(13,res.length-1)).songlist
            console.log(JSON.parse(res.substring(13,res.length-1)).songlist)
          })
        }
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
    mounted(){
      if(!this.userInfo.creator){
        this.$dialog.center('请先登录')
      }
      if(this.userInfo.mymusic){
        getMySong(this.userInfo.mymusic[0].id).then((res)=>{
          this.songList=JSON.parse(res.substring(13,res.length-1)).songlist
        })
      }
    }
  }
</script>

<style>
  .nothing{
    text-align: center;
    color: #fff;
  }
  .my-music-wrapper .song-list-header div,.song-list-item div{
    height: 50px;
    line-height: 50px;
    float: left;
    text-align: left;
    background: #f5f5f5;
    font-size: 14px;
    width: 30%;
    position: relative;
    padding: 0 10px;
  }
  .my-music-wrapper .item-title{
    position: absolute;
    cursor: pointer;
  }
  .my-music-wrapper .song-list-item img{
    width: 40px;
    cursor: pointer;
    margin: 10px;
  }
  .my-music-wrapper  .song-list-item div{
    height: 60px;
    line-height: 60px;
    background: #fff;
  }
  .my-music-wrapper   .i-song-list .bg-item div{
    background: #f6f6f6;
  }
  .my-music-wrapper .song-list-header .end-div,.song-list-item .end-div{
    text-align: right;
  }
  .my-music-wrapper   .my-nav{
    width: 1180px;
    margin: 0 auto;
    text-align: left;
    color: #fff;
    position: relative;
    bottom: -130px;
  }
  .my-music-wrapper .my-nav span{
    margin-right: 15px;
    cursor: pointer;
  }
  .my-music-wrapper  .my-nav .active{
    color: #42b983;
  }
  .my-music-wrapper .my-info{
    width: 200px;
    margin: 0 auto;
    padding-top: 80px;
    text-align: center;
    color: #fff;
    height: 138px;
  }
  .my-music-wrapper  .my-info img{
    width: 100px;
    border-radius: 50%;
    border: 3px solid #fff;
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
    font-size: 18px;
  }
  .my-music-wrapper .profile-wrapper{
    width: 100%;
    height: 380px;
    position: relative;
    background: url("https://y.gtimg.cn/mediastyle/yqq/img/bg_profile.jpg") no-repeat;
  }
  .my-music-wrapper  .my-music-wrapper{
    margin-top: 20px;
    width: 100%;
    background: #fff;
  }
  .my-music-wrapper  .my-music-box{
    padding-top: 20px;
    width: 1180px;
    text-align: left;
    margin: 0 auto;
  }
</style>
