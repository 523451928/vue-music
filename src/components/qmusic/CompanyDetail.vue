<template>
  <transition name="slide">
    <div class="company-detail-wrapper">
      <div class="company-detail-box">
        <div class="company-detail-head">
          <div class="company-img">
            <img :src="companyObj.headPic" onerror="this.src='//y.gtimg.cn/mediastyle/event/template_record_company/img/logo_company.png?max_age=31536000';this.onerror=null;">
            <p>{{companyObj.name}}</p>
          </div>
        </div>
      </div>
      <div class="company-detail-album">
        <h2>专辑</h2>
        <div class="album-container">
          <transition-group name="fade" tag="ul" class="clear-fix">
            <li class="album-item" v-for="(album,index) in companyObj.recommand_album" :key="album">
              <div class="album-box">
                <div class="album-img-box">
                  <a @click="toAlbumDetail(album)">
                    <img
                      v-lazy="{'src':`//y.gtimg.cn/music/photo_new/T002R300x300M000${album.Falbum_mid}.jpg?max_age=2592000`,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                    <i class="icon-play"></i>
                  </a>
                </div>
                <p class="mv-title">{{album.Falbum_name}}</p>
                <p class="mv-singer" ><span>{{album.singer.Fsinger_name}}</span></p>
                <p class="public-time"> {{album.Fupload_time}}</p>
              </div>
            </li>
          </transition-group>
        </div>
        <h2>MV</h2>
        <mv-list :mvList="companyObj.recommand_mv"></mv-list>
      </div>
    </div>
  </transition>
</template>

<script>
  import MvList from './Mvlist.vue'
  import { getCompanyDetail } from 'api/musicapi'
  export default{
    data(){
      return {
        companyObj:{}
      }
    },
    methods:{
      toAlbumDetail(album){
        this.$router.push(`/qmusic/albumdetail/${album.Falbum_mid}`)
      }
    },
    components:{
      MvList
    },
    mounted(){
      getCompanyDetail(this.$router.currentRoute.params.id).then((res)=>{
        console.log(res.data.company)
        this.companyObj=res.data.company
      })
    }
  }
</script>

<style>
  .company-detail-album{
    margin-top: 20px;
    width: 1200px;
    margin: 0 auto;
  }
  .company-detail-album h2{
    text-align: left;
    font-weight: normal;
    margin:20px 0;
  }
  .company-img{
    width: 160px;
    height: 160px;
    margin: 50px auto;
  }
  .company-img p{
    text-align: center;
    color: #fff;
    font-size: 24px;
  }
  .company-img img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .company-detail-wrapper{
    padding-top: 20px;
    margin-top: 20px;
    width: 100%;
    background: #fff;
    background-image: url(https://y.gtimg.cn/mediastyle/event/template_record_company/img/bg_top.jpg?max_age=2592000&v=f7e5061002c451bbea324afeadb31688);
    background-position: center 20px;
    background-repeat: repeat-x;
    min-height: 500px;
  }
  .company-detail-box{
    width: 1180px;
    text-align: left;
    height: 334px;
    margin: 0 auto;
  }
  .company-detail-head{
    width: 100%;
    height: 320px;
  }
</style>
