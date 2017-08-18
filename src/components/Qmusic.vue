<template>
  <div class="q-music">
      <div class="q-nav">
        <ul class="clear-fix">
          <li>
            <router-link to="/qmusic/home">首页</router-link>
          </li>
          <li>
            <router-link to="/qmusic/singer">歌手</router-link>
          </li>
          <li>
            <router-link to="/qmusic/album">专辑</router-link>
          </li>
          <li>
            <router-link to="/qmusic/toplist">排行榜</router-link>
          </li>
          <li>
            <router-link to="/qmusic/search">搜索</router-link>
          </li>
          <li>
            <router-link to="/qmusic/playlist">分类歌单</router-link>
          </li>
          <li>
            <router-link to="/qmusic/radio">电台</router-link>
          </li>
          <li>
            <router-link to="/qmusic/mv">MV</router-link>
          </li>
          <li>
            <router-link to="/qmusic/digital">数字专辑</router-link>
          </li>
          <li>
            <router-link to="/qmusic/mymusic">我的</router-link>
          </li>
        </ul>
      </div>
      <router-view></router-view>
  </div>
</template>

<script>
  export default{
    mounted(){
      if(this.$router.currentRoute.path=='/qmusic'){
        this.$router.push('/qmusic/singer')
      }
    },
    watch:{
      $route(to){
        if(to.path=='/qmusic'){
          this.$router.push('/qmusic/singer')
        }
      }
    }
  }
</script>

<style>
  #app .q-music ul{
    text-align: left;
  }
  #app .q-music{
    position: relative;
  }
  #app .q-music li{
    width: 80px;
    float: left;
    color: #42b983;
    text-align: left;
  }
  #app .q-music .q-nav{
    position: relative;
    left: -150px;
    text-align: left;
  }
  #app .q-music .q-nav li{
    text-align: center;
    font-family: -webkit-body
  }
  .q-music li a{
    color: #42b983;
  }
</style>
