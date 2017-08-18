<template>
  <transition name="slide">
    <div class="playlist" @click="hidePop">
      <div class="playlist-wrapper">
        <div class="playlist-tag clear-fix">
          <div class="playlist-tag-list" v-for="(item,index) in categoryArr">
            <h4>{{item.categoryGroupName}}</h4>
            <i></i>
            <ul>
              <li class="tag" :class="{'active':tag.active}" v-for="(tag,idx) in frontTags[index]" v-html="tag.categoryName" @click="changeCategory($event,tag)"></li>
              <li class="more" v-show="item.items.length>9" @click.stop="togglePop($event,index)">更多&nbsp;<span>+</span></li>
            </ul>
          </div>
          <div class="popup-tag hide" :id="`tag${index}`" v-for="(item,index) in categoryArr" v-if="afterTags[index].length>0">
            <span class="tag" v-for="(tag,idx) in afterTags[index]" @click="changeCategory($event,tag,true)">{{tag.categoryName}}</span>
          </div>
        </div>
        <div class="detail-hd">
          <h3 v-show="!categoryShow">全部歌单</h3>
          <p class="cate" v-show="categoryShow">
            <i v-html="categoryName"></i> <span @click="closeCategory">&times;</span>
          </p>
          <div class="part-switch">
            <span v-for="(item,index) in sortArr" @click="changeSort(index)" :class="{'active':index==sortIndex}">{{item.text}}</span>
          </div>
        </div>
        <div class="detail-contain">
          <ul class="clear-fix">
            <li v-for="(item,index) in playObj.list">
              <div class="item-box">
                <a @click.prevent="toPlaylistDetail(item.dissid)" :href="`https://y.qq.com/n/yqq/playlist/${item.dissid}.html#stat=y_new.playlist.pic_click`" target="_blank">
                  <div class="detail-img">
                    <!--<img :src="item.imgurl"/>-->
                    <img
                      v-lazy="{'src':item.imgurl,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    <i class="icon-play"></i>
                  </div>
                </a>
                <p v-html="item.dissname"></p>
                <p class="singer">{{item.creator.name}}</p>
                <p class="listen-num">播放量{{item.listennum | formatListen}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <v-page v-if="totalPage" :pageTotal="totalPage" @changePage="changePage"></v-page>
    </div>
  </transition>
</template>

<script>
  import { addClass,removeClass,hasClass } from '../assets/js/dom'
  import { getCategory,getPlaylist } from '../api/musicapi'
  import Page from './qmusic/Page.vue'
  export default{
    data(){
      return {
        categoryArr:[],
        sortArr:[
          {'text':'推荐','sortid':5},
          {'text':'最新','sortid':2}
        ],
        sortIndex:0,
        categoryId:10000000,
        categoryShow:false,
        lastMore:"",
        categoryName:"",
        playObj:{},
        sin:0,
        ein:29
      }
    },
    computed:{
      frontTags(){
        var tagArr=[]
        this.categoryArr.forEach((item)=>{
          var items=item.items.slice(0,9)
          tagArr.push(items)
        })
        return tagArr
      },
      afterTags(){
        var tagArr=[]
        this.categoryArr.forEach((item)=>{
          var items=item.items.slice(8)
          tagArr.push(items)
        })
        return tagArr
      },
      totalPage(){
        return Math.ceil(this.playObj.sum/30)
      }
    },
    methods:{
      closeCategory(){
        this.categoryShow=false
        this.sin=0
        this.ein=29
        this.sortIndex=0
        this.categoryId=10000000
        this.removeTagClass()
        this._getPlaylist(this.categoryId,this.sortArr[this.sortIndex].sortid,this.sin,this.ein)
      },
      changeCategory(e,tag,flag){
        var mores=document.getElementsByClassName('more')
        this.removeTagClass()
        addClass(e.target,'active')
        if(flag){
          for(var i=0;i<mores.length;i++){
            mores[i].innerHTML='更多 <span>+</span>'
          }
          addClass(this.lastMore,'active')
          this.lastMore.innerHTML=tag.categoryName+' <span>+</span>'
        }
        this.sin=0
        this.ein=29
        this.categoryId=tag.categoryId
        this.categoryName=tag.categoryName
        this.categoryShow=true
        this._getPlaylist(this.categoryId,this.sortArr[this.sortIndex].sortid,this.sin,this.ein)
      },
      removeTagClass(){
        var tags=document.getElementsByClassName('tag')
        for(var i=0;i<tags.length;i++){
          removeClass(tags[i],'active')
        }
      },
      changeSort(idx){
        this.sin=0
        this.ein=29
        this.sortIndex=idx
        this._getPlaylist(this.categoryId,this.sortArr[this.sortIndex].sortid,this.sin,this.ein)
      },
      changePage(n){
        this.sin=30*(n-1)
        this.ein=30*(n-1)+29
        this._getPlaylist(this.categoryId,this.sortArr[this.sortIndex].sortid,this.sin,this.ein)
        document.body.scrollTop = 150
      },
      togglePop(e,idx){
        var mores=document.getElementsByClassName('more')
        var popTags=document.getElementsByClassName('popup-tag')
        this.lastMore=e.target
        if(!hasClass(e.target,'active')){
          for(var i=0;i<popTags.length;i++){
            addClass(popTags[i],'hide')
          }
          for(var j=0;j<mores.length;j++){
            removeClass(mores[j],'active')
          }
          if(e.target.tagName=='SPAN'){
            addClass(e.target.parentNode,'active')
          }else{
            addClass(e.target,'active')
          }
          removeClass(document.getElementById(`tag${idx}`),'hide')
        }else{
          for(var i=0;i<popTags.length;i++){
            addClass(popTags[i],'hide')
          }
          removeClass(e.target,'active')
        }
      },
      hidePop(){
        var popTags=document.getElementsByClassName('popup-tag')
        var mores=document.getElementsByClassName('more')
        for(var i=0;i<popTags.length;i++){
          addClass(popTags[i],'hide')
        }
        for(var j=0;j<mores.length;j++){
          removeClass(mores[j],'active')
        }
      },
      toPlaylistDetail(id){
        console.log(id)
        this.$router.push(`/qmusic/playlistdetail/${id}`)
      },
      _getPlaylist(cid,sortid,sin,ein){
        getPlaylist(cid,sortid,sin,ein).then((res)=>{
          this.playObj=res.data
        })
      }
    },
    mounted(){
      this.$loading('加载中...')
      getCategory().then((res)=>{
        res.data.categories.splice(0,1)
        this.categoryArr=res.data.categories
        for(var i=0;i<this.categoryArr.length;i++){
          for(var j=0;j<this.categoryArr[i].items.length;j++){
            if(this.categoryArr[i].items[j].categoryId==this.$router.currentRoute.query.categoryId){
              this.$set(this.categoryArr[i].items[j],'active',true)
            }
          }
        }
        this.$loading.close()
      })
      this.$http.get('/listRadio').then((res)=>{

      })
      console.log(this.$router.currentRoute.query.categoryId)

      if(this.$router.currentRoute.query.categoryId&&this.$router.currentRoute.query.categoryName){
        this.categoryId=this.$router.currentRoute.query.categoryId
        this.categoryName=this.$router.currentRoute.query.categoryName
        this.categoryShow=true
      }
      this._getPlaylist(this.categoryId,this.sortArr[this.sortIndex].sortid,this.sin,this.ein)
    },
    components:{
      'v-page':Page
    },
    filters:{
      formatListen(val){
        return (val/10000).toFixed(1)+'万'
      }
    }
  }
</script>

<style>
  #app .q-music .detail-contain li{
    float: left;
    width: 20%;
  }
  .detail-img{
    width: 216px;
    height: 220px;
    position: relative;
    overflow: hidden;
  }
  .detail-img img{
    transition: all .5s;
  }
  .detail-img:hover .icon-play{
    transform: scale(1);
  }
  .detail-img:hover img{
    transform: scale(1.1);
  }
  .detail-hd{
    height: 60px;
    line-height: 60px;
    margin-top: 10px;
  }
  .detail-hd h3{
    float: left;
    font-size: 24px;
    font-weight: 400;
  }
  .detail-hd .cate{
    float: left;
    position: relative;
    padding: 0 20px 0 10px;
    margin-right: 10px;
    height: 40px;
    text-align: left;
    font-size: 14px;
    line-height: 40px;
    top:10px;
    border: 1px solid #c9c9c9;
  }
  .detail-hd .cate i{
    font-style: normal;
  }
  .detail-hd .cate:hover{
    background: #42b983;
    color: #fff;
    border: 1px solid #42b983;
  }
  .detail-hd .cate span{
    cursor: pointer;
    font-size: 20px;
    margin-left: 5px;
    position: absolute;
    top:1px;
    right: 5px;
  }
  .item-box{
    margin:0 10px;
    padding-bottom: 32px;
  }
  .item-box p{
    font-size: 14px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .item-box .singer{
    color: #999;
    height: 30px;
    line-height: 30px;
  }
  .item-box .listen-num{
    color: #999999;
    text-align: left;
  }
  .part-switch{
    float: right;
  }
  .part-switch span{
    display: inline-block;
    font-size: 14px;
    font-weight: normal;
    width: 62px;
    height: 40px;
    text-align: center;
    cursor: pointer;
    line-height: 40px;
    margin-top: 10px;
    border: 1px solid #ccc;
  }
  .part-switch .active{
    background: #42b983;
    border: 1px solid #42b983;
    color: #fff;
  }

  .playlist-tag{
    padding-top: 30px;
  }
  .hide{
    display: none;
  }
  .popup-tag{
    position: absolute;
    width: 100%;
    top: 139px;
    text-align: left;
    left: 0px;
    -webkit-box-shadow: 0 0 10px rgba(183,183,183,.65);
    box-shadow: 0 0 10px rgba(183,183,183,.65);
    border: 0 none;
    background-color: #fff;
    padding: 19px 0 15px;
    z-index: 4;
  }
  .popup-tag span{
    max-width: 60px;
    font-size: 14px;
    padding: 4px 18px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    color: #333333;
    cursor: pointer;
  }
  .popup-tag .active{
    background: #42b983;
    border: 1px solid #42b983;
    color: #fff;
  }
  .popup-tag .active:hover{
    color: #fff;
  }
  .popup-tag span:hover{
    color: #42b983;
  }
  #app .q-music .playlist-tag-list li{
    max-width: 60px;
    font-size: 14px;
    padding: 4px 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333333;
    cursor: pointer;
  }
  #app .q-music .playlist-tag-list .more{
    position: absolute;
    right: 10px;
    bottom: 0px;
    line-height: 24px;
    border-radius: 2px;
    height: 20px;
    background: #fff;
    border: none;
  }
  .more span{
    font-size: 24px;
    position: absolute;
    top:3px;
  }
  #app .q-music .playlist-tag-list .active{
    background: #42b983;
    color: #fff;
  }
  #app .q-music .playlist-tag-list .active:hover{
    color: #FFFFFF;
  }
  #app .q-music .playlist-tag-list li:hover{
    color: #42b983;
  }
  .playlist-tag-list i{
    position: absolute;
    width: 1px;
    background: #eeeef0;
    height: 100%;
    right: 0;
    top: 0;
  }
  .playlist {
    width: 100%;
    background: #fff;
    padding-bottom: 40px;
    margin-top: 30px;
  }

  .playlist-wrapper {
    width: 1180px;
    margin: 0 auto;
    text-align: left;
    position: relative;
  }
  .playlist-tag-list{
    width: 20%;
    float: left;
    position: relative;
  }
  .playlist-tag-list h4{
    color: #999999;
    font-weight: 400;
    font-size: 14px;
    padding-left: 8px;
    margin-bottom: 8px;
  }
</style>
