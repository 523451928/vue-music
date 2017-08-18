<template>
  <div class="player-song-list">
    <ul class="qmusic-list">
      <li>
        <div>
          <span v-for="(item,index) in songText">{{item}}</span>
        </div>
      </li>
      <li v-for="(item,index) in musicList">
        <div>
          <span>
            <i v-if="!isRecent" v-show="!playing||index!=currentIndex">{{index+1}}</i>
            <i v-if="isRecent">{{index+1}}</i>
            <i v-if="!isRecent" v-show="playing&&index==currentIndex" class="wave"></i>
            <i class="to-song" @click="toSongDetail(item.musicData)">{{item.musicData?item.musicData.songname:item.data.songname}}</i>
            <em class="play" @click="play(index,item)"></em>
          </span>
          <span>{{item.musicData?item.musicData.albumname:item.data.albumname}}</span>
          <span v-if="item.musicData">
            <span  v-for="(singer,idx) in item.musicData.singer" class="to-singer" @click="toSinger(singer)">{{singer.name}}</span>
            <em class="del" @click="del(index)"></em>
          </span>
          <span v-if="item.data">
            <span v-if="item.data.singer" v-for="(singer,idx) in item.data.singer">{{singer.name}}</span>
            <em class="del" @click="del(index)"></em>
          </span>
        </div>
      </li>
    </ul>
    <p class="none-info" v-show="musicList.length==0||!musicList">{{noneText}}</p>
  </div>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  export default{
    computed:{
      ...mapState([
        'playing','currentIndex'
      ]),
      noneText(){
        if(this.isRecent){
          return '暂无最近播放记录!'
        }else{
          return '播放列表空空的，快去添加歌曲吧!'
        }
      }
    },
    watch:{
      musicList(val){
      }
    },
    data(){
      return {
        songText:[
          '歌曲名','专辑名','歌手'
        ]
      }
    },
    props:{
      musicList:{
        type:Array,
        default:[]
      },
      isRecent:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      ...mapMutations([
        'setMusiclist','setSinger','setSingerShow','setSongName'
      ]),
      toSongDetail(song){
        this.$emit('toggleScreen')
        this.setSongName(song.songname)
        this.$router.push(`/qmusic/songdetail/${song.albummid}`)
      },
      alt(msg){
        alert(msg)
      },
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
          'id':singer.mid,
          'name':singer.name
        },this.singerObj)
        this.setSingerShow(false)
        this.$emit('toggleScreen')
      },
      play(index,item){
        if(!this.isRecent){
          this.$emit('play',index)
//          this.setMusiclist(item)
        }else{
          this.$emit('playRecent',index,item,true)
        }
      },
      del(index){
        if(!this.isRecent){
          this.$emit('del',index)
        }else{
          this.$emit('delRecent',index)
        }
      }
    }
  }
</script>

<style>
  #app .qmusic-list .to-singer{
    cursor: pointer;
  }
  .to-song{
    cursor: pointer;
  }
  .to-song:hover{
    color: #42b983;
  }
  #app .qmusic-list .to-singer:hover{
    color: #42b983;
  }
  .none-info{
    text-align: center;
  }
  .player-song-list{
    max-height: 600px;
    overflow: auto;
  }
  .qmusic-list i{
    font-style: normal;
  }
  .qmusic-list .wave{
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url("./wave.gif") no-repeat;
  }
  .qmusic-list em{
    display: block;
    width: 37px;
    height: 37px;
    background: url("../qmusic/icon_list_menu.png");
    position: absolute;
    top: 6px;
    display: none;
    cursor: pointer;
  }
  .qmusic-list .play{
    background-position: left top;
    right: 10px;
  }
  .qmusic-list .del{
    background-position: left -160px;
    right: 10px;
  }
  .qmusic-list .del:hover{
    background-position: -40px -160px;
  }
  .qmusic-list .play:hover{
    background-position: -40px top;
  }
  .music-list-wrapper .qmusic-list li{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #fff;

  }
  .qmusic-list li span{
    position: relative;
  }

  .music-list-wrapper .qmusic-list li:hover em{
    display: block;
  }

  .music-list-wrapper .qmusic-list li span{
    display: inline-block;
    width: 32%;
    text-indent: 5px;
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
