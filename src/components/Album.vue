<template>
  <transition name="slide">
    <div class="album">
      <div class="album-wrapper" @click="hidePop">
        <div class="mv-tag">
          <div class="clear-fix">
            <span class="tag-title">语种</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.language" @click="changeLan($event,tag,idx)" :class="{'active':lanIndex==idx}">
                {{tag.name}}
              </span>
            </div>
          </div>
          <div class="clear-fix">
            <span class="tag-title">流派</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.genre" @click="changeGenre($event,tag,idx)" :class="{'active':genreIndex==idx}">
                {{tag.name}}
              </span>
            </div>
          </div>
          <div class="clear-fix">
            <span class="tag-title">价格</span>
            <div class="tag-wrapper" >
              <span v-for="(tag,idx) in tagObj.pay" @click="changePay($event,tag,idx)" :class="{'active':payIndex==idx}">
                {{tag.name}}
              </span>
            </div>
          </div>
          <div class="clear-fix">
            <span class="tag-title">筛选</span>
            <div class="tag-wrapper">
              <span class="pop-btns" v-for="(item,index) in filterArr" @click.stop="showPop($event,index)">
                {{item}}<i>&gt;</i>
              </span>
            </div>
          </div>
          <div class="popup-tag" v-show="popShow">
            <span class="tag" v-for="(item,index) in popTagArr" @click="changeFliter($event,item,index)" >{{item.name}}</span>
          </div>
        </div>
        <div class="detail-hd">
          <h3 v-show="allShow">全部专辑</h3>
          <p class="cate" v-show="lanObj.isShow">
            <i >{{lanObj.text}}</i> <span @click="removeLan">&times;</span>
          </p>
          <p class="cate" v-show="genreObj.isShow">
            <i >{{genreObj.text}}</i> <span @click="removeGenre">&times;</span>
          </p>
          <p class="cate" v-show="payObj.isShow">
            <i >{{payObj.text}}</i> <span @click="removePay">&times;</span>
          </p>
          <p class="cate" v-show="typeObj.isShow">
            <i >{{typeObj.text}}</i> <span @click="removeType">&times;</span>
          </p>
          <p class="cate" v-show="yearObj.isShow">
            <i >{{yearObj.text}}</i> <span @click="removeYear">&times;</span>
          </p>
          <p class="cate" v-show="companyObj.isShow">
            <i >{{companyObj.text}}</i> <span @click="removeCompany">&times;</span>
          </p>
          <div class="part-switch">
            <span v-for="(item,index) in sortArr" @click="changeSort(index)" :class="{'active':index==sortIndex}">{{item.text}}</span>
          </div>
        </div>
        <div class="album-container">
          <transition-group name="fade" tag="ul" class="clear-fix">
            <li class="album-item" v-for="(album,index) in albumObj.albumlist" :key="album">
              <div class="album-box">
                <div class="album-img-box">
                  <a @click="toAlbumDetail(album)">
                    <img
                      v-lazy="{'src':`//y.gtimg.cn/music/photo_new/T002R300x300M000${album.album_mid}.jpg?max_age=2592000`,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    <i class="icon-play"></i>
                  </a>
                </div>
                <p class="mv-title">{{album.album_name}}</p>
                <p class="mv-singer"><span v-for="(singer,index) in album.singers">{{singer.singer_name}}</span></p>
                <p class="public-time"> {{album.public_time}}</p>
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
  import {getAlbum} from '../api/musicapi'
  import {addClass,removeClass,hasClass} from '../assets/js/dom'
  import Page from './qmusic/Page.vue'
  const pageNum=20
  export default{
    data(){
      return {
        albumObj:{},
        popShow:false,
        popTagArr:[],
        filterArr:['类别','年代','唱片公司'],
        tagObj:{},
        lanObj:{
          isShow:false,
          text:''
        },
        genreObj:{
          isShow:false,
          text:''
        },
        payObj:{
          isShow:false,
          text:''
        },
        typeObj:{
          isShow:false,
          text:''
        },
        yearObj:{
          isShow:false,
          text:''
        },
        companyObj:{
          isShow:false,
          text:''
        },
        lanIndex:0,
        genreIndex:0,
        payIndex:0,
        typeId:-1,
        yearId:1,
        companyId:-1,
        sortIndex:0,
        sortArr:[
          {'text':'最新','sortid':1},
          {'text':'最热','sortid':2}
        ]
      }
    },
    computed:{
      allShow(){
        if(!this.lanObj.isShow&&!this.genreObj.isShow&&!this.payObj.isShow&&!this.typeObj.isShow&&!this.yearObj.isShow&&!this.companyObj.isShow){
          return true
        }else{
          return false
        }
      },
      pageTotal(){
        return Math.ceil(this.albumObj.sum/pageNum)
      }
    },
    methods:{
      toAlbumDetail(album){
        this.$router.push(`/qmusic/albumdetail/${album.album_mid}`)
      },
      changePage(num){
        getAlbum('get_album_info', num-1 ,this.sortArr[this.sortIndex].sortid ,this.tagObj.language[this.lanIndex].id,
          this.tagObj.genre[this.genreIndex].id ,this.yearId ,this.tagObj.pay[this.payIndex].id ,this.typeId ,this.companyId).then((res)=>{
          this.albumObj=res.data
        })
      },
      showPop(e,idx){
        switch (idx){
          case 0:
            this.popTagArr=this.tagObj.type
            break;
          case 1:
            this.popTagArr=this.tagObj.year
            break;
          case 2:
            this.popTagArr=this.tagObj.company
            break;
        }
        this.lastIndex=idx
        var tags=document.getElementsByClassName('tag')
        this.$nextTick(()=>{
          if(e.target.tagName=="I"){
            var text=e.target.parentNode.innerText
            text=text.substring(0,text.length-1)
          }else{
            var text=e.target.innerText
            text=text.substring(0,text.length-1)
          }
          for(var i=0;i<tags.length;i++){
            removeClass(tags[i],'active')
            if(text==='类别'||text==='年代'||text==='唱片公司'){
              addClass(tags[0],'active')
            }else if(text==tags[i].innerText){
              addClass(tags[i],'active')
            }
          }
        })
        this.removePopClass()
        if(e.target.tagName=="I"){
          if(!hasClass(e.target.parentNode,'slt')){
            addClass(e.target.parentNode,'slt')
          }
          this.lastBtn=e.target.parentNode
        }else{
          if(!hasClass(e.target,'slt')){
              addClass(e.target,'slt')
          }
          this.lastBtn=e.target
        }
        this.popShow=true
      },
      hidePop(){
        this.popShow=false
        this.removePopClass()
      },
      changeSort(index){
        this.sortIndex=index
        this._getAlbumlist()
      },
      changeLan(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.lanIndex=index
        if(index===0){
          this.lanObj.isShow=false
        }else{
          this.lanObj.isShow=true
        }
        this.lanObj.text=tag.name
        this._getAlbumlist()
      },
      removeLan(){
        this.lanObj.isShow=false
        this.lanIndex=0
        this._getAlbumlist()
      },
      changeGenre(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.genreIndex=index
        if(index===0){
          this.genreObj.isShow=false
        }else{
          this.genreObj.isShow=true
        }
        this.genreObj.text=tag.name
        this._getAlbumlist()
      },
      removeGenre(){
        this.genreObj.isShow=false
        this.genreIndex=0
        this._getAlbumlist()
      },
      changePay(e,tag,index){
        if(hasClass(e.target,'active')){
          return
        }
        this.payIndex=index
        if(index===0){
          this.payObj.isShow=false
        }else{
          this.payObj.isShow=true
        }
        this.payObj.text=tag.name
        this._getAlbumlist()
      },
      removePay(){
        this.payObj.isShow=false
        this.payIndex=0
        this._getAlbumlist()
      },
      removeType(){
        this.typeObj.isShow=false
        this.typeId=-1
        var btn=document.getElementsByClassName('pop-btns')[0]
        btn.innerHTML='类别<i>></i>'
        this.removePopClass()
        this._getAlbumlist()
      },
      removeYear(){
        this.yearObj.isShow=false
        this.yearId=1
        var btn=document.getElementsByClassName('pop-btns')[1]
        btn.innerHTML='年代<i>></i>'
        this.removePopClass()
        this._getAlbumlist()
      },
      removeCompany(){
        this.companyObj.isShow=false
        this.companyId=-1
        var btn=document.getElementsByClassName('pop-btns')[2]
        btn.innerHTML='唱片公司<i>></i>'
        this.removePopClass()
        this._getAlbumlist()
      },
      changeFliter(e,item,index){
        if(this.lastIndex==0){
          this.typeId=item.id
          if(index===0){
            this.typeObj.isShow=false
          }else{
            this.typeObj.isShow=true
          }
          this.typeObj.text=item.name
        }else if(this.lastIndex==1){
          this.yearId=item.id
          if(index===0){
            this.yearObj.isShow=false
          }else{
            this.yearObj.isShow=true
          }
          this.yearObj.text=item.name
        }else if(this.lastIndex==2){
          this.companyId=item.id
          if(index===0){
            this.companyObj.isShow=false
          }else{
            this.companyObj.isShow=true
          }
          this.companyObj.text=item.name
        }
        this.lastBtn.innerHTML=`${item.name}<i>></i>`
        if(item.name=="全部"){
          this.lastBtn.innerHTML=`${this.filterArr[this.lastIndex]}<i>></i>`
          this._getAlbumlist()
          return
        }
        addClass(this.lastBtn,'slts')
        if(hasClass(e.target,'active')){
          return
        }else{
          this._getAlbumlist()
        }
      },
      removePopClass(){
        var popBtns=document.getElementsByClassName('pop-btns')
        for(var i=0;i<popBtns.length;i++){
          removeClass(popBtns[i],'slt')
          if(popBtns[i].innerText=='唱片公司>'||popBtns[i].innerText=='年代>'||popBtns[i].innerText=='类别>'){
            removeClass(popBtns[i],'slts')
          }
        }
      },
      _getAlbumlist(){
        getAlbum('get_album_info', 0 ,this.sortArr[this.sortIndex].sortid ,this.tagObj.language[this.lanIndex].id,
                  this.tagObj.genre[this.genreIndex].id ,this.yearId ,this.tagObj.pay[this.payIndex].id ,this.typeId ,this.companyId).then((res)=>{
          this.albumObj=res.data
        })
      }
    },
    components:{
      'v-page':Page
    },
    mounted(){
      getAlbum('firstpage',0 ,1, -1, 0 ,1 ,0 ,-1 ,-1).then((res)=>{
        this.albumObj=res.data
        this.tagObj=res.data.tag
        console.log(this.tagObj)
      })
    }
  }
</script>

<style>
  .album-box .mv-title{
    text-align: left;
  }
  .public-time{
    font-size: 14px;
    color: #999;
  }
  .album-img-box{
    position: relative;
    /*width: 224px;*/
    height: 224px;
    overflow: hidden;
  }
  .album-img-box img{
    transition: all .5s;
  }
  .album-img-box:hover .icon-play{
    transform: scale(1);
  }
  .album-img-box:hover img{
    transform: scale(1.1);
  }
  .album-container{
    width: 1200px;
  }
  .album-container .album-box{
    padding-bottom: 35px;
    margin-right: 20px;
  }
  #app .q-music .album-container li{
    width: 20%;
    float: left;
  }
  .mv-tag .tag-wrapper .slts:hover{
    color: #fff;
  }
  .mv-tag .popup-tag{
    top:175px;
  }
  .album {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: 40px 0;
    margin-top: 30px;
  }
  .album .album-wrapper{
    width: 1180px;
    position: relative;
    margin:0 auto;
  }
  .tag-wrapper i{
    font-style: normal;
    margin-left: 4px;
    font-family: cursive;
    transition: all .5s;
    display: inline-block;
    transform: rotate(90deg);
  }
  .tag-wrapper span{
    line-height: 20px;
    user-select: none;
  }
  .tag-wrapper .slt,.tag-wrapper .slts{
    background: #42b983;
    color: #fff;
  }
  .tag-wrapper .slts i{
    transform: rotate(90deg);
  }
  .tag-wrapper .slt i{
    transform: rotate(-90deg);
  }

  .tag-wrapper .slt:hover{
    color: #fff;
  }

</style>
