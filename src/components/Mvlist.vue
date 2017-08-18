<template>
  <transition name="slide">
    <div class="mv">
      <div class="mv-wrapper">
        <div class="mv-tag">
          <div class="clear-fix">
            <span class="tag-title">地区</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.area" @click="changeArea($event,tag,idx)" :class="{'active':areaIndex==idx}">
                {{tag.title}}
              </span>
            </div>
          </div>
          <div class="clear-fix">
            <span class="tag-title">年份</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.year" @click="changeYear($event,tag,idx)"  :class="{'active':yearIndex==idx}">
                {{tag.title}}
              </span>
            </div>
          </div>
          <div class="clear-fix">
            <span class="tag-title">类型</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.tag" @click="changeTag($event,tag,idx)"  :class="{'active':tagIndex==idx}">
                {{tag.title}}
              </span>
            </div>
          </div>
        </div>
        <div class="detail-hd">
          <h3 v-show="allShow">全部MV</h3>
          <p class="cate" v-show="areaObj.isShow">
            <i >{{areaObj.text}}</i> <span @click="removeArea">&times;</span>
          </p>
          <p class="cate" v-show="yearObj.isShow">
            <i >{{yearObj.text}}</i> <span @click="removeYear">&times;</span>
          </p>
          <p class="cate" v-show="tagsObj.isShow">
            <i >{{tagsObj.text}}</i> <span @click="removeTag">&times;</span>
          </p>
          <div class="part-switch">
            <span v-for="(item,index) in sortArr" @click="changeSort(index)" :class="{'active':index==sortIndex}">{{item.text}}</span>
          </div>
        </div>
        <div class="mv-container">
          <transition-group name="fade" tag="ul" class="clear-fix">
            <li class="mv-item" v-for="(mv,index) in mvObj.mvlist" :key="mv">
              <div class="mv-box">
                <div class="mv-img-box">
                  <a :href="`https://y.qq.com/n/yqq/mv/v/${mv.vid}.html`" target="_blank">
                    <img
                      v-lazy="{'src':mv.picurl,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    <i class="icon-play"></i>
                  </a>
                </div>
                <p class="mv-title">{{mv.mvtitle}}</p>
                <p class="mv-singer"><span v-for="(singer,index) in mv.singers" @click="toSinger(singer)">{{singer.name}}</span></p>
                <p class="listen-num">播放量:{{mv.listennum | formatListen}} &nbsp;&nbsp; {{mv.publictime}}</p>
              </div>
            </li>
          </transition-group>
        </div>
        <v-page :pageTotal="pageTotal" @changePage="changePage"></v-page>
      </div>
    </div>
  </transition>
</template>

<script>
  import {getMvlist} from '../api/musicapi'
  import {hasClass} from '../assets/js/dom'
  import Page from './qmusic/Page.vue'
  import {mapMutations} from 'vuex'
  const pageNum=20
  export default{
     data(){
      return {
        tagObj:{},
        areaIndex:0,
        yearIndex:0,
        tagIndex:0,
//        allShow:true,
        areaObj:{
          isShow:false,
          text:''
        },
        yearObj:{
          isShow:false,
          text:''
        },
        tagsObj:{
          isShow:false,
          text:''
        },
        categoryArr:[],
        mvObj:{},
        sortIndex:1,
        sortArr:[
          {'text':'最新','sortid':1},
          {'text':'最热','sortid':2}
        ]
      }
    },
    computed:{
      pageTotal(){
        return Math.ceil(this.mvObj.sum/pageNum)
      },
      allShow(){
        if(!this.areaObj.isShow&&!this.yearObj.isShow&&!this.tagsObj.isShow){
          return true
        }else{
          return false
        }
      }
    },
    methods:{
      ...mapMutations(
        ['setSinger','setSingerShow']
      ),
      toSinger(singer){
        this.$router.push(`/qmusic/singer/${singer.mid}`)
        this.setSinger({
          'avatar':`https://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.mid}.jpg?max_age=2592000`,
          'id':singer.mid,
          'name':singer.name
        },{})
        this.setSingerShow(false)
      },
      removeArea(){
        this.areaObj.isShow=false
        this.areaIndex=0
        this._getMvlist()
      },
      changeArea(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.areaIndex=index
        if(index===0){
          this.areaObj.isShow=false
        }else{
          this.areaObj.isShow=true
        }
        this.areaObj.text=tag.title
        this._getMvlist()
      },
      removeYear(){
        this.yearObj.isShow=false
        this.yearIndex=0
        this._getMvlist()
      },
      changeYear(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.yearIndex=index
        if(index===0){
          this.yearObj.isShow=false
        }else{
          this.yearObj.isShow=true
        }
        this.yearObj.text=tag.title
        this._getMvlist()
      },
      removeTag(){
        this.tagsObj.isShow=false
        this.tagIndex=0
        this._getMvlist()
      },
      changeTag(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.tagIndex=index
        if(index===0){
          this.tagsObj.isShow=false
        }else{
          this.tagsObj.isShow=true
        }
        this.tagsObj.text=tag.title
        this._getMvlist()
      },
      _getMvlist(){
        this.sortIndex=1
        getMvlist(this.sortArr[this.sortIndex].sortid,this.tagObj.year[this.yearIndex].id,this.tagObj.area[this.areaIndex].id,this.tagObj.tag[this.tagIndex].id ,0,0).then((res)=>{
          this.mvObj=res.data
        })
      },
      changeSort(index){
        this.sortIndex=index
        getMvlist(this.sortArr[index].sortid,this.tagObj.year[this.yearIndex].id,this.tagObj.area[this.areaIndex].id,this.tagObj.tag[this.tagIndex].id ,this.pageNum,0).then((res)=>{
          this.mvObj=res.data
        })
      },
      changePage(num){
        this.pageNum=num-1
        getMvlist(this.sortArr[this.sortIndex].sortid,this.tagObj.year[this.yearIndex].id,this.tagObj.area[this.areaIndex].id,this.tagObj.tag[this.tagIndex].id ,num-1,0).then((res)=>{
          this.mvObj=res.data
        })
        document.body.scrollTop = 150
      }
    },
    filters:{
      formatListen(val){
        return val/10000>=1?(val/10000).toFixed(1)+'万':val
      }
    },
    components:{
      'v-page':Page
    },
    mounted(){
      getMvlist(2,0,0,0,0,1).then((res)=>{
        this.mvObj=res.data
        this.tagObj=res.data.taglist
      })
    }
  }
</script>

<style>
  .mv-box{
    padding-bottom: 35px;
  }
  .mv-box p{
    margin-bottom: 2px;
  }
  .mv .mv-box .listen-num{
    color: #999;
    font-size: 14px;
    text-align: left;
  }
  .mv-img-box{
    position: relative;
    width: 280px;
    height: 162px;
    overflow: hidden;
  }
  .mv-img-box img{
    transition: all .5s;
  }
  .mv-img-box:hover .icon-play{
    transform: scale(1);
  }
  .mv-img-box:hover img{
    transform: scale(1.1);
  }
  #app .q-music .mv-container .mv-item{
    float: left;
    width: 25%;
  }
  .mv .mv-title{
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
  .mv-singer{
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mv-singer span{
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    color: #666;
    font-size: 14px;
  }
  .mv-singer span:hover{
    color: #42b983;
  }
  .mv-container{
    width: 1200px;
  }
  .mv-box{
    margin: 0 20px 0 0px;
  }
  .tag-wrapper .active{
    background: #42b983;
    border-radius: 2px;
    color: #fff;
  }
  .tag-wrapper .active:hover{
    color: #fff;
  }
  .mv {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: 40px 0;
    margin-top: 30px;
  }
  .tag-wrapper{
    float: left;
    width: 93%;
  }
  .tag-wrapper span{
    cursor: pointer;
    margin:0 14px 14px 14px;
    height: 20px;
    padding: 2px 6px;
    font-size: 14px;
    color: #333;
  }
  .tag-wrapper span:hover{
    color: #42b983;
  }
  .mv-tag span{
    display: inline-block;
  }
  .mv-tag .tag-title{
    float: left;
    font-size: 14px;
    margin-top: 2px;
    width: 7%;
  }
  .mv .mv-wrapper{
    width: 1180px;
    margin:0 auto;
  }
</style>
