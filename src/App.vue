<template>
  <div id="app" >
    <div>
      <ul class="nav" @click="hideFollow">
        <li>
          <router-link to="/qmusic">音乐</router-link>
        </li>
        <li>
          <router-link to="/book">图书</router-link>
        </li>
        <li>
          <router-link to="/movie">电影</router-link>
        </li>
        <!--<li>-->
          <!--<router-link to="/music">音乐</router-link>-->
        <!--</li>-->
        <li>
          <router-link to="/follow">我的关注</router-link>
        </li>
        <li>
          <router-link to="/calendar">我的日历</router-link>
        </li>
        <li>
          <router-link to="/todo">我的任务</router-link>
        </li>
      </ul>
      <div class="weather-box">
        <div class="weather-wrapper">
          <div class="weather-left">
            {{area}}
          </div>
          <div>
            <p>{{formatTime}}</p>
            <p>{{lunarDay}}</p>
            <p>{{formatWether}}</p>
            <p>{{detaileAddress}}</p>
          </div>
        </div>
        <div class="user-info" v-if="userInfo.creator">
          <img :src="userInfo.creator.headpic"/>
          <span>{{userInfo.creator.nick}}</span>
        </div>
        <div class="login-in" @click="showLogin">登录</div>
        <p class="down-count"> 离{{year}}年12月31日还有{{downCountText}}</p>
      </div>
      <transition name="fadeScale">
        <v-game :maxLevel="maxLevel" @closeGame="closeGame" v-show="gameShow"></v-game>
      </transition>
      <transition name="fadeScale">
        <v-calculator v-show="calculatorShow" @closeCalculator="closeCalculator"></v-calculator>
      </transition>

      <div class="toolbar" ref="toolbar">
        <div class="toolbar-panels">
            <div class="panel-head">
              <router-link to="/follow">我的关注</router-link><span class="close-follow" @click="hideFollow">&times;</span>
            </div>
            <div class="panel-nav clear-fix">
              <ul>
                <li v-for="(text,index) in followTextArr" :class="{'current':index==followIndex}" @mouseenter="changeFollow(index)">{{text}}</li>
              </ul>
            </div>
            <div class="panel-body ">
              <div class="panel panel-movie">
                <ul>
                  <li v-for="(item,index) in followMovieArr" :key="item">
                    <router-link :to="{ path: '/detail/'+item.id}">
                      <span class="delete" @click.stop.prevent="removeMovie(index)"></span>
                      <img height="100" v-lazy="{'src':item.images.large,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                      <p>{{item.title}}</p>
                    </router-link>
                  </li>
                </ul>
                <p v-show="followMovieArr.length==0">快去关注喜欢的电影吧！</p>
              </div>
              <div class="panel panel-music">
                <ul>
                  <li v-for="(item,index) in followQmusicArr" :key="item" style="height: 150px" @click="selectItem(item,index,true)">
                      <span class="delete" @click.stop.prevent="removeMusic(index)"></span>
                      <img style="margin-top: 20px" height="100" v-lazy="{'src':item.avatar,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                      <p>{{item.songname}}</p>
                  </li>
                </ul>
                <p v-show="followQmusicArr.length==0">快去关注喜欢的音乐吧！</p>
              </div>
              <div class="panel panel-book">
                <ul>
                  <li v-for="(item,index) in followBookArr" :key="item" style="height: 150px">
                    <router-link :to="{ path: '/bdetail/'+item.id}">
                      <span class="delete" @click.stop.prevent="removeBook(index)"></span>
                      <img style="margin-top: 20px" height="100" v-lazy="{'src':item.images.large,'loading':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1497847008067&di=2abd988a7d0e2e6bc7e24dd36707e2e8&imgtype=0&src=http%3A%2F%2Fimages0.cnblogs.com%2Fblog%2F694143%2F201507%2F062245453466958.gif'}">
                      <p>{{item.title}}</p>
                    </router-link>
                  </li>
                </ul>
                <p v-show="followBookArr.length==0">快去关注喜欢的图书吧！</p>
              </div>
            </div>
        </div>
        <div class="toolbar-tabs">
          <div class="tabs tab-follow" @click.stop="toggleFollow">
            <i></i>
            <em>我的关注</em>
          </div>
          <div class="tabs tab-game" @click="showGame">
            <i></i>
            <em>我的游戏</em>
          </div>
          <div class="tabs tab-calcu" @click="showCalculator">
            <i></i>
            <em>计算器</em>
          </div>
          <div class="tabs tab-code">
            <i></i>
            <img src="../static/erwei.jpg">
            <em>二维码</em>
          </div>
          <div class="tabs tab-top" @click="goTop">
            <i></i>
            <em>返回顶部</em>
          </div>
        </div>
      </div>
      <v-login v-show="loginShow" @loginFn="loginFn"></v-login>
      <v-player ref="player" @getMusic="getMusic"></v-player>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import VLogin from './public/Login.vue'
  import getLunarDay from './assets/js/getLunarDay'
  import Player from './components/qmusic/Player.vue'
  import ScrollBar from './assets/js/scrollBar'
  import Game from './public/Game.vue'
  import Calculator from './public/Calculator.vue'
  import {addClass,removeClass} from './assets/js/dom'
  import {getProfile} from './api/musicapi'
  import { mapMutations ,mapActions,mapState} from 'vuex'
  import $ from 'jquery'
  var scrollBar = new ScrollBar();

  window.onscroll = function () {
    var bodyHeight = document.getElementsByTagName('body')[0].scrollHeight;
    var times = 1;
    if (bodyHeight > 1000 && bodyHeight < 2000) {
      times = 2.5
    } else if (bodyHeight > 2000 && bodyHeight < 3000) {
      times = 1.57
    } else {
      times = 1.3
    }
    if (bodyHeight > document.getElementsByTagName('body')[0].clientWidth) {
      var height = parseInt(document.getElementsByTagName('body')[0].scrollTop / bodyHeight * 100) * times
      scrollBar.setWidth(height);
    } else {
      //scrollBar.over();
    }
    //console.log(height);
  }
  export default {
    name: 'app',
    data(){
      return {
        area: '',
        detaileAddress: '',
        formatTime: "",
        formatWether: "",
        weeks: ['日', '一', '二', '三', '四', '五', '六'],
        year: "",
        followMovieArr:[],
        followQmusicArr:[],
        followBookArr:[],
        lunarDay: "",
        downCountText: "",
        maxLevel: 25,
        gameShow: false,
        followTextArr:['我的电影','我的音乐','我的图书'],
        followIndex:0,
        calculatorShow: false,
        isLeft:false,
        loginShow:false
      }
    },
    computed:{
      ...mapState([
        'musicList','playing','userInfo'
      ])
    },
    methods: {
      ...mapMutations([
        'setWeatherArr', 'setWeatherObj','setCurrentIndex','setUserInfo'
      ]),
      ...mapActions([
        'selectPlay'
      ]),
      loginFn(id){
        getProfile(id).then((res)=>{
          this.setUserInfo(res.data)
          this.loginShow=false
        })
      },
      showLogin(){
        this.loginShow=true
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
      removeMovie(index){
        this.followMovieArr.splice(index,1);
        localStorage.setItem('followMovieArr',JSON.stringify(this.followMovieArr))
      },
      removeMusic(index){
        this.followQmusicArr.splice(index,1);
        localStorage.setItem('followQmusicArr',JSON.stringify(this.followQmusicArr))
        this.$refs.player.getFollowMusic()
      },
      removeBook(index){
        this.followBookArr.splice(index,1);
        localStorage.setItem('followBookArr',JSON.stringify(this.followBookArr))
      },
      getMusic(){
        if(localStorage.getItem('followQmusicArr')){
          this.followQmusicArr=JSON.parse(localStorage.getItem('followQmusicArr'))
        }
      },
      changeFollow(index){
        this.followIndex=index
        var translate='-'+index*33.3+"%";
        document.querySelector('.panel-body').style.transform=`translate3D(${translate},0,0)`;
        if(index===0&&localStorage.getItem('followMovieArr')){
          this.followMovieArr=JSON.parse(localStorage.getItem('followMovieArr'))
        }else if(index==1&&localStorage.getItem('followQmusicArr')){
          this.followQmusicArr=JSON.parse(localStorage.getItem('followQmusicArr'))
        }else if(index==2&&localStorage.getItem('followBookArr')){
          this.followBookArr=JSON.parse(localStorage.getItem('followBookArr'))
        }
      },
      toggleFollow(){
        if(!this.isLeft){
          addClass(this.$refs.toolbar,'tool-left')
        }else {
          removeClass(this.$refs.toolbar,'tool-left')
        }
        this.isLeft=!this.isLeft
      },
      hideFollow(){
        removeClass(this.$refs.toolbar,'tool-left')
        this.isLeft=false
      },
      goTop(){
//        document.body.scrollTop = 0;
        var currentPosition,timer;
        timer=setInterval(function(){
          currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
          currentPosition-=10;
          if(currentPosition>0)
          {
            window.scrollTo(0,currentPosition);
          }
          else
          {
            window.scrollTo(0,0);
            clearInterval(timer);
          }
        },1);
      },
      closeCalculator(){
        this.calculatorShow = false;
      },
      showCalculator(){
        this.calculatorShow = true;
      },
      closeGame(){
        this.gameShow = false;
      },
      showGame(){
        this.gameShow = true;
      },
      padLeftZero(str){
        return ("00" + str).substr((str + "").length);
      },
      getLocation(){
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(this.showPosition);
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      },
      showPosition(position){
        var point = new BMap.Point(position.coords.longitude, position.coords.latitude);
        var geoc = new BMap.Geocoder();
        var self = this;
        geoc.getLocation(point, function (rs) {
//          console.log(rs);
          var addComp = rs.addressComponents;
          self.detaileAddress = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
          //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
        });
      }
    },
    components: {
      'v-game': Game,
      'v-calculator': Calculator,
      'v-player':Player,
      VLogin
    },
    mounted(){
      if(this.$router.currentRoute.path=='/'){
        this.$router.push('/qmusic/singer')
      }
      this.changeFollow(0);
      var self = this;
      this.getLocation();
      var endTime = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
      endTime = endTime.getTime();
      setInterval(() => {
        var now = new Date();
        var year = now.getFullYear();
        var month = this.padLeftZero(now.getMonth() + 1);
        var day = this.padLeftZero(now.getDate());
        var week = parseInt(this.padLeftZero(now.getDay()));
        var hour = this.padLeftZero(now.getHours());
        var minute = this.padLeftZero(now.getMinutes());
        var second = this.padLeftZero(now.getSeconds());

        var nowTime = now.getTime();
        this.year = year;
        this.downCountText = Math.floor((endTime - nowTime) / 1000 / 60 / 60 / 24) + "天"
          + Math.floor((endTime - nowTime) / 1000 / 60 / 60 % 24) + "小时"
          + Math.floor((endTime - nowTime) / 1000 / 60 % 60) + "分钟"
          + Math.floor((endTime - nowTime + 2000) / 1000 % 60) + "秒";

        this.lunarDay = getLunarDay(year, month, day);
        var noonText = hour > 12 ? '下午' : '上午';
        hour = hour >= 13 ? hour - 12 : hour;
        this.formatTime = year + '年' + month + '月' + day + '日 ' + '星期' + this.weeks[week] + ' ' + noonText + ' ' + hour + ":" + minute + ":" + second
      }, 1000)

      $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function (_result) {
        new Promise(function (resolve, reject) {
          if (remote_ip_info.ret == '1') {
            resolve();
          } else {
            reject();
          }
        }).then(function () {
          self.area = remote_ip_info.city;
          $.getScript(`http://php.weather.sina.com.cn/js.php?city=${self.area}&day=0&password=DJOYnieT8234jlsK`, function (json) {
            var status = status1 == "" ? status2 : status1;
            var temperature = temperature1 == "" ? parseInt(temperature2) + 5 : temperature1;
            self.formatWether = '天气：' + status + " 温度" + temperature2 + "℃至" + temperature + '℃';
            var now = new Date();
            var year = now.getFullYear();
            var month = self.padLeftZero(now.getMonth() + 1);
            var day = self.padLeftZero(now.getDate());
            self.setWeatherObj({
              weather: self.formatWether, area: self.area, date: {
                year: year,
                month: month,
                day: day
              }
            });
            var lastDateOfMonth = new Date(year, month, 0).getDate()    //当月最后一天
            var weatherJson = [];
            if (window.localStorage.getItem(year + "-" + month + "-weather")) {
              weatherJson = JSON.parse(window.localStorage.getItem(year + "-" + month + "-weather"));
//              console.log(weatherJson);
              if (weatherJson[day - 1].weather == "") {
                weatherJson.splice(day - 1, 1, {
                  weather: self.formatWether, area: self.area, date: {
                    year: year,
                    month: month,
                    day: day
                  }
                })
              }
            } else {
              for (var i = 0; i < lastDateOfMonth; i++) {
                weatherJson.push({
                  weather: '', area: '', date: {
                    year: '',
                    month: '',
                    day: ''
                  }
                });
                if (day == i) {
                  weatherJson.splice(day - 1, 1, {
                    weather: self.formatWether, area: self.area, date: {
                      year: year,
                      month: month,
                      day: day
                    }
                  })
                }
              }
            }
            window.localStorage.setItem(year + "-" + month + "-weather", JSON.stringify(weatherJson));
            self.setWeatherArr(weatherJson);
          });
        }, function () {
          alert('error');
        })

//        if (remote_ip_info.ret == '1') {
//          self.area = remote_ip_info.city;
//          $.getScript(`http://php.weather.sina.com.cn/js.php?city=${self.area}&day=0&password=DJOYnieT8234jlsK`, function (json) {
//            self.formatWether='天气：'+status1+" 温度"+temperature2+"-"+temperature1;
//          });
//        }
      });
    }
  }
</script>

<style>
  .login-in{
    position: absolute;
    left: -66px;
    top:84px;
    cursor: pointer;
    text-decoration: underline;
  }
  .user-info{
    position: absolute;
    text-align: center;
    left: -200px;
    top:0px;
    width: 200px;
  }
  .user-info img{
    width: 60px;
    display: block;
    border-radius: 50%;
    margin-left: 65px;
  }
  .clear-fix:after{content:".";display:block;height:0;clear:both;visibility:hidden}
  .clear-fix{*+height:1%;}
  .panel-music li{
    cursor: pointer;
  }
  body{
    padding-bottom: 60px;
  }
  .panel li .delete{
    width: 9px;
    height: 11px;
    background: url("./assets/img/delete.png");
    display: inline-block;
    position: absolute;
    right: 10px;
    top: 10px;
    background-size: cover;
    display: none;
  }
  .panel p{
    text-align: center;
  }
  .panel ul{
    margin-left: 10px;
    margin-top: 10px;
  }
  .panel li{
    transition: all .5s;
    width: 100px;
    height: 130px;
    background: #fff;
    float: left;
    text-align: center;
    margin-bottom: 10px;
    margin-right: 10px;
    padding: 5px;
    position: relative;
  }
  .panel li:hover .delete{
    display: inline-block;
  }
  .panel li p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #42b983;
  }
  .panel-body{
    width: 810px;
    height: 100%;
    transition: all .5s;
  }
  .panel-body .panel{
    width:270px;
    float: left;
    text-align: left;
    height: 100%;
    overflow-y: auto;
  }
  .panel-nav{
    width:270px;
  }
  .panel-nav li{
    height: 37px;
    border-bottom: 3px solid #FFFFFF;
    background: #fff;
    width: 90px;
    float: left;
    text-align: center;
    line-height: 37px;
    cursor: pointer;
  }
  .panel-nav li.current{
    border-color: #ff6633;
    color: #ff6633;
  }
  .panel-head{
    height: 40px;
    line-height: 40px;
    text-align: left;
    text-indent: 16px;
    color: rgb(94, 80, 80);
  }
  .panel-head a{
    color: rgb(94, 80, 80);
  }
  .panel-head .close-follow{
    position: absolute;
    right: 10px;
    top:0px;
    font-size: 30px;
    transition: all .5s;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    text-indent: 0;
  }
  .panel-head .close-follow:hover{
    transform: rotate(180deg);
  }
  .toolbar {
    position: fixed;
    right: 0px;
    top: 0;
    width: 0;
    height: 100%;
    border-right: 6px solid #42b983;
    -webkit-transition: right .3s ease-in-out 0s;
    -moz-transition: right .3s ease-in-out 0s;
    transition: right .3s ease-in-out 0s;
    z-index: 100;
  }
  .tool-left{
    right: 270px;
  }
  .tool-start{
    right: 0px;
  }
  .toolbar-panels {
    position: absolute;
    left: 6px;
    _left: 6px;
    top: 0;
    width: 270px;
    height: 100%;
    z-index: 200;
    background: #eceaea;
    overflow: hidden;
  }

  .toolbar-tabs {
    position: absolute;
    top: 50%;
    left: -29px;
    width: 29px;
  }

  .toolbar-tabs .tabs {
    position: relative;
    width: 38px;
    height: 29px;
    background: #42b983;
    border-radius: 2px;
    left: 0px;
    z-index: 100;
    transition: all .5s;
    margin-top: 2px;
    cursor: pointer;
  }

  .toolbar-tabs .tabs img {
    position: absolute;
    transition: all .5s;
    min-width: 90px !important;
    left: -134px;
    transform: scale(0);
    top: -90px;
    transform-origin: right bottom;
    opacity: 0;
  }

  .toolbar-tabs .tabs:hover img {
    left: -92px;
    transform: scale(1);
    opacity: 1;
  }

  .toolbar-tabs .tabs:hover em {
    left: -92px;
    background: #ff6633;
  }

  .toolbar-tabs .tabs:hover, .toolbar-tabs .tabs:hover i {
    background-color: #ff6633;
  }

  .toolbar-tabs .tabs i {
    transition: all .5s;
    width: 29px;
    height: 29px;
    background: url("./assets/img/follow-icon.png") no-repeat;
    background-position: 2px;
    background-color: #42b983;
    background-size: 17px 15px;
    border-radius: 2px;
    position: absolute;
    display: inline-block;
    z-index: 111;
    left: 6px;
    top: 0;
  }

  .toolbar-tabs .tab-game i {
    background: url("./assets/img/game-icon.png") no-repeat;
    background-position: 2px;
  }

  .toolbar-tabs .tab-calcu i {
    background: url("./assets/img/calculator-icon.png") no-repeat;
    background-position: 2px;
  }

  .toolbar-tabs .tab-top i {
    background: url("./assets/img/top-icon.png") no-repeat;
    background-position: 1px;
  }

  .toolbar-tabs .tab-code i {
    background: url("./assets/img/code-icon.png") no-repeat;
    background-position: 1px;
  }

  .toolbar-tabs .tabs em {
    transition: all .5s;
    width: 96px;
    height: 29px;
    background: #42b983;
    position: absolute;
    display: inline-block;
    font-style: normal;
    left: 34px;
    z-index: 100;
    top: 0;
    color: #fff;
    border-radius: 4px;
    line-height: 29px;
  }

  .fadeScale-enter-active, .fadeScale-leave-active {
    transition: all .5s;
  }

  .fadeScale-enter .game-wrapper, .fadeScale-leave-active .game-wrapper, .fadeScale-enter .calculator, .fadeScale-leave-active .calculator {
    transform: scale(0.5);
    opacity: 0
  }

  .my-game {
    position: absolute;
    left: -80px;
    bottom: 0px;
    cursor: pointer;
    background: #ff6633;
    border-radius: 4px;
    padding: 2px 4px;
  }

  .animation_paused {
    -webkit-animation-play-state: paused;
    -moz-animation-play-state: paused;
    -ms-animation-play-state: paused;
    animation-play-state: paused;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 70px;
  }

  body {
    overflow-x: hidden;
  }

  .weather-box {
    position: absolute;
    width: 405px;
    color: #FFFFFF;
    right: 0px;
    top: 12px;
    text-align: left;
  }

  .weather-wrapper {
    display: flex;
  }

  .down-count {
    text-indent: 15px;
    background: #2ad487;
    width: 92%;
    border-radius: 4px;
    margin-top: 2px;
  }

  .weather-wrapper .weather-left {
    text-align: center;
    vertical-align: middle;
    border-right: 1px solid #2ad487;
    padding-right: 10px;
    margin-right: 10px;
    font-size: 30px;
    line-height: 84px;
  }

  .nav {
    clear: both;
    height: 55px;
  }

  .nav li {
    float: left;
    margin: 20px;
  }

  .nav li a {
    color: #2ad487;
  }

  .router-link-active {
    background: #fff;
    padding: 2px 6px;
    border-radius: 2px;
  }

  .custom-classes-transition-enter-active, .custom-classes-transition-leave-active {
    transition: all .5s
  }

  .custom-classes-transition-enter {
    transform: translateX(100%);
  }

  .custom-classes-transition-leave-active {
    transform: translateX(-100%);
  }
</style>
