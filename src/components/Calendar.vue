<style scoped>
  .calendar-wrapper{
    position: relative;
  }
  .calendar-wrapper:before {
    content: '';
    position: absolute;
    clear: both;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }
  .calendar {
    width: 95%;
    padding: 10px;
    background: #f1f3fa;
    border: 1px solid #DEDEDE;
    border-radius: 2px;
    transition: all .5s ease;
    margin: 0 auto;
    box-shadow: 2px 2px 4px #ccc;
    user-select:none;
  }

  .slide-enter-active, .slide-leave-active {
    transition: all .5s;
  }

  .fade-enter-active, slide-leave-active {
    transition: all .5s;
  }

  .rotate-enter-active, .rotate-leave-active {
    transform-origin: 50% top ;
    transition: all 1s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  .slide-enter, .slide-leave-active {
    transform: translateX(100%);
    opacity: 0
  }

  .rotate-enter, .rotate-leave-active {
    transform: rotateX(-180deg);
    opacity: 0;
    background: #666;
  }

  .slideLeft-enter-active, .slideLeft-leave-active {
    transition: all 0.5s;
  }

  .slideLeft-enter, .slideLeft-leave-active {
    transform: translateX(-100%);
    opacity: 0
  }

  .calendar-enter, .calendar-leave {
    opacity: 0;
    transform: translate3d(0, -10px, 0);
  }

  .calendar:before {
    position: absolute;
    left: 30px;
    top: -10px;
    content: "";
    border: 5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #DEDEDE;
  }

  .calendar:after {
    position: absolute;
    left: 30px;
    top: -9px;
    content: "";
    border: 5px solid rgba(0, 0, 0, 0);
    border-bottom-color: #fff;
  }

  .calendar-tools {
    height: 32px;
    font-size: 20px;
    line-height: 32px;
    color: #5e7a88;
    position: relative;
  }

  .calendar-tools .float.left {
    float: left;
  }

  .calendar-tools .float.right {
    float: right;
  }

  .calendar-tools input {
    font-size: 20px;
    line-height: 32px;
    color: #5e7a88;
    width: 70px;
    text-align: center;
    border: none;
    background-color: transparent;
  }

  .calendar-tools span {
    cursor: pointer;
  }

  .calendar-prev {
    float: left;
    margin-left: 40%;
  }

  .calendar-next {
    float: right;
    margin-right: 40%;
  }

  .calendar table {
    clear: both;
    width: 100%;
    margin-bottom: 10px;
    border-collapse: collapse;
    color: #444444;
  }

  .calendar thead td {
    border: none;
  }

  .calendar thead tr {
    height: 50px;
  }

  .calendar tr {
    height: 50px;
    line-height: 50px;
  }

  .calendar td {
    margin: 2px !important;
    padding: 0px 0;
    width: 14.28571429%;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    line-height: 125%;
    border: 1px solid #ccc;
  }

  .calendar td.week {
    pointer-events: none !important;
    cursor: default !important;
  }

  .calendar td.disabled {
    color: #888888;
    background: #f5f5f5;
  }

  .calendar td.selected {
    background-color: #fff;
    border: 1px solid #93d4fc;
    box-shadow: 0 0 5px #60caff;
    border-collapse: separate;
    transition: width .1s linear, height .1s linear, box-shadow .2s linear;
  }

  .calendar thead td {
    text-transform: uppercase;
  }

  .calendar .timer {
    margin: 10px 0;
    text-align: center;
  }

  .calendar .timer input {
    border-radius: 2px;
    padding: 5px;
    font-size: 14px;
    line-height: 18px;
    color: #5e7a88;
    width: 50px;
    text-align: center;
    border: 1px solid #efefef;
  }

  .calendar .timer input:focus {
    border: 1px solid #5e7a88;
  }

  .calendar-button {
    text-align: center;
  }

  .calendar-button span {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    min-width: 5em;
    vertical-align: baseline;
    background: #5e7a88;
    color: #fff;
    margin: 0 .25em 0 0;
    padding: .6em 2em;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    border-radius: .3em;
  }

  .calendar-button span.cancel {
    background: #efefef;
    color: #666;
  }

  .calendar .lunar {
    font-size: 11px;
    line-height: 150%;
    color: #aaa;
  }

  .calendar td.selected .lunar {
    color: #fff;
  }

  .wrapper {
    width: 100%;
    height: 125px;
    position: relative;
  }
  .wrapper:hover .weather{
    opacity: 1;
    bottom: 3px;
  }
  .weather{
    transition: all .5s;
    position: absolute;
    bottom: -5px;
    width: 100%;
    color: #5eb2e6 ;
    text-shadow:1px 1px 1px #f5f5f5;
    opacity: 0;
  }
  .month-date {
    text-align: left;
  }

  .today {
    background: #0f7dc2;
    color: #fff;
  }

  .month-date span {
    display: inline-block;
    margin: 4px 0 0 8px;
  }

  .calendar-today {
    display: inline-block;
    border: 1px solid #ccc;
    font-size: 16px;
    width: 80px;
    border-radius: 4px;
    position: absolute;
    left: 16px;
  }

  .month-date .cn-date {
    float: right;
    margin-right: 5px;
    color: #b2b7bf;
  }

  .page span {
    position: absolute;
    padding: 7px 10px;
    border: 1px solid #cccccc;
    color: #3377cc;
    background: #ffffff;
    z-index: 10;
    top: 0;
    cursor: pointer;
    user-select: none;
  }

  .page .previous {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    left: 0;
  }

  .page .next {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    right: 0;
  }

  ul.pageCon {
    position: absolute;
    top: 0;
    left: 64px;
    width: 3000%;
    transition: all 0.5s;
  }

  ul.pageCon li {
    float: left;
    height: 30px;
    line-height: 30px;
    background: #fff;
    box-sizing: border-box;
    border: 1px solid #dddddd;
    border-right: none;
    width: 30px;
    color: #33a6dc;
    text-align: center;
    list-style: none;
    cursor: pointer;
    user-select: none;
  }

  ul.pageCon li:hover {
    color: #23527c;
    background-color: #eee;
    border-color: #ddd;
  }

  .go-page {
    display: inline-block;
    width: 50px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #cccccc;
    position: relative;
    top: -11px;
  }

  ul.pageCon li.active {
    background: #33a6dc;
    color: #ffffff;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  .add-event,.my-event{
    text-align: left;
    text-indent: 15px;
    color: #ccc;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 260px;
  }
  .add-event{

  }
  .my-event{
    color: #666;
  }
  .my-event:hover,.add-event:hover {
    background: #ceeafb;
    color: #151515;
  }

  .slt {
    background: #5eb2e6;
    color: #fff;
  }

  .slt:hover {
    background: #5eb2e6;
    color: #fff;
  }
  .date-num {
    font-family: georgia;
    font-size: 18px;
  }

</style>

<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div class="calendar" transition="calendar"
         transition-mode="out-in" >
      <transition name="slide">
        <div v-show="calendarShow" class="calendar-wrapper" style="background: #fff;padding-top: 10px;" v-if="type!='time'">
          <div class="calendar-tools">
            <span class="calendar-today">今天</span>
            <span class="calendar-prev" @click="prev">
                      <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink"><g class="transform-group"><g
                        transform="scale(0.015625, 0.015625)"><path
                        d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z"
                        fill="#5e7a88"></path></g></g></svg>
                  </span>
            <span class="calendar-next" @click="next">
                      <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink"><g class="transform-group"><g
                        transform="scale(0.015625, 0.015625)"><path
                        d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z"
                        fill="#5e7a88"></path></g></g></svg>
                  </span>
            <div class="text center">
              <input type="text" v-model="year" value="year" @change="render(year,month)" min="1970" max="2100"
                     maxlength="4">
              /
              {{monthString}}
            </div>
          </div>
          <table cellpadding="5" @mousedown="startFn" @mousemove="moveFn" @mouseup="endFn" >
            <thead>
              <tr>
                <td v-for="week in weeks" class="week">{{week}}</td>
              </tr>
            </thead>
            <!--<transition-group name="rotate" tag="tbody">-->
              <tr v-for="(day,k1) in days">
                <td
                  v-for="(child,k2) in day"
                  :class="{'selected':child.selected,'disabled':child.disabled}"
                  @click="select(k1,k2,$event,child.disabled)">
                  <div class="wrapper">
                    <div class="month-date" :class="{'today':child.Today}">
                      <span v-show="child.Today">今天</span><span
                      v-if="child.Today">({{monthString}}月{{child.day >= 10 ? child.day : "0" + child.day}}日)</span><span
                      v-if="!child.Today"
                      class="date-num">{{child.day}}</span>
                      <span class="cn-date">{{child.cnDate.split(" ")[1] == "五月初五" ? "端午节"
                        : child.cnDate.split(" ")[1] == "正月初一" ? "春节"
                          : child.cnDate.split(" ")[1] == "八月十五" ? "中秋节"
                            : child.cnDate.split(" ")[1] == "七月初七" ? "七夕节"
                              : child.cnDate.split(" ")[1]}}</span>
                    </div>
                    <div>
                      <transition-group name="fade">
                        <p class="my-event" @click.stop="showEdit($event,child.data,item.content,index,k2)" v-for="(item,index) in child.data.remark" :key="item">{{index+1}}:{{item.content}}</p>
                      </transition-group>
                      <p class="add-event" v-show="child.selected" @click.stop="showPop($event,k2)">新建事件</p>
                      <p class="weather" v-if="child.weather.area!=''"> {{child.weather.area}} {{child.weather.weather}}</p>
                    </div>
                  </div>
                </td>
              </tr>
            <!--</transition-group>-->
          </table>
        </div>
      </transition>
      <transition name="fade">
        <v-popup :styleObj="styleObj" :dotStyle="dotStyle" v-show="popShow" @hidePop="hidePop" @refresh="refresh" :year="year" :month="month" :day="day"
                 :week="week"></v-popup>
      </transition>
      <transition name="fade">
        <v-popedit :styleObj="styleObj" :dotStyle="dotStyle" v-show="editShow" :content="content" :planObj="planObj" :planName="planName" :planIndex="planIndex" @hideEdit="hideEdit"></v-popedit>
      </transition>
    </div>
  </transition>
</template>

<script>
  import GetLunarDay from '../assets/js/getLunarDay'
  import Popup from '../public/Popup.vue'
  import {mapState} from 'vuex'
  import Popedit from "../public/Popedit.vue"
  export default {
    props: {
      show: {
        type: Boolean,
        twoWay: true,
        default: false
      },
      type: {
        type: String,
        default: "date"
      },
      value: {
        type: String,
        twoWay: true,
        default: ""
      },
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      },
      begin: {
        type: String,
        twoWay: true,
        default: ""
      },
      end: {
        type: String,
        default: ""
      },
      range: {
        type: Boolean,
        default: false
      },
      sep: {
        type: String,
        twoWay: true,
        default: "-"
      },
      weeks: {
        type: Array,
        default: function () {
          return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        }
      },
      months: {
        type: Array,
        default: function () {
          return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        }
      }
    },
    data() {
      return {
        storeData: {data: [], total: 0},
        year: 0,
        month: 0,
        week: "",
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        date: "",
        days: [],
        today: [],
        currentMonth: Number,
        monthString: "",
        plans: {
          date:'2017-06',
          data: [
            {
              day: 1,
              remark: [
                {
                  content: '今天看摔跤吧'
                }
              ]
            }
          ]
        },  //模拟数据
        styleObj: {'left': 0, top: 0},
        dotStyle: true,
        yI: "",
        xI: "",
        zI: "",
        sI: "",
        calendarShow: true,
        pickStyle: {
          left: 0,
          top: 0
        },
        popShow: false,
        editShow:false,
        isMouseDown:false,
        planObj:{
          remark:[
            {time:"",content:""}
          ]
        },
        content:"",
        dateNum: "",
        planName: "",
        planIndex:0,
        startX:0,
        disX:0
      }
    },
    computed: {
      ...mapState(
        ['weatherObj']
      ),
      pageNum(){
        return Math.ceil(this.storeData.total / this.count);
      },
      weatherArr(){
        var date=this.year+'-'+this.padLeftZero((this.month+1))
        if(window.localStorage.getItem(date+"-weather")){
          return JSON.parse(window.localStorage.getItem(date+"-weather"));
        }else{
          var lastDateOfMonth = new Date(this.year, this.month+1 , 0).getDate()
          var weatherJson=[];
          for(var i=0;i<lastDateOfMonth;i++){
            weatherJson.push({weather:'',area:'',date:{
              year:'',
              month:'',
              day:''
            }});
          }
          return weatherJson;
        }
      }
    },
    watch: {
      dateStart(value){
        if (value != "") {

        }
      },
      dateEnd(value){
        if (value != "") {

        }
      },
      month(value){
        this.monthString = this.months[this.month]
        if(window.localStorage.getItem(this.year+"-"+this.month+'plan')!=null){
          this.planName=this.year+"-"+this.month+'plan';
          this.plans=JSON.parse(window.localStorage.getItem(this.year+"-"+this.month+'plan'));
        }else{
          this.plans={date:'',
            data: [
              {
                day: "",
                remark: [
                  {
                    content: ''
                  }
                ]
              }
            ]
          };
        }
        this.render(this.year, this.month)
      }
    },
    components: {
      'v-popup': Popup,
      'v-popedit':Popedit
    },
    directives:{
    },
    created() {
      this.init();
    },
    mounted(){
      if(window.localStorage.getItem(this.year+"-"+this.month+'plan')!=null){
        this.planName=this.year+"-"+this.month+'plan';
        this.plans=JSON.parse(window.localStorage.getItem(this.year+"-"+this.month+'plan'));
//        this.render(this.year, this.month);
        var self=this;
        this.plans.data.forEach(function(item){
//          setInterval(function(){
//            var now=new Date();
//            var date=now.getFullYear()+"-"+self.padLeftZero((now.getMonth()+1))+"-"+self.padLeftZero(now.getDate());
//            var time=self.padLeftZero(now.getHours())+":"+self.padLeftZero(now.getMinutes())+":"+self.padLeftZero(now.getSeconds());
//            item.remark.forEach(function(remark){
//              if(remark.time.split(" ")[0]==date&&remark.time.split(" ")[1]==time){
//                alert(remark.content);
//              }
//            });
//          },1000);
        });
      }
    },
    methods: {
      padLeftZero(str){
        return ("00"+str).substr((str+"").length);
      },
      startFn(e){
        this.startX=e.clientX;
        this.isMouseDown=true;
      },
      moveFn(e){
        if(this.isMouseDown){
          this.disX=e.clientX-this.startX;
        }
      },
      endFn(){
        if(this.disX<-100){
          ++this.month
        }else if(this.disX>100){
          --this.month
        }
        this.isMouseDown=false;
        this.startX=0;
        this.disX=0;
      },
      showEdit(e,data,content,index,i){
        this.editShow = true;
        document.querySelectorAll('.my-event').forEach(function(item){
          item.className='my-event'
        });
        e.target.className = 'my-event slt'
        if(i>1){
          this.styleObj = {
            left: this.getOffset(e.target).left - 342 + "px",
            top: this.getOffset(e.target).top - 20 + "px"
          }
          this.dotStyle=false;
        }else{
          this.dotStyle=true;
          this.styleObj = {
            left: this.getOffset(e.target).left + e.target.clientWidth + "px",
            top: this.getOffset(e.target).top - 20 + "px"
          }
        }
        this.planObj=data;
        this.content=content;
        this.planIndex=index;
      },
      showPop(e,index){
        this.popShow = true;
        e.target.className = 'add-event slt'
        if(index>1){
          this.styleObj = {
            left: this.getOffset(e.target).left - 342 + "px",
            top: this.getOffset(e.target).top - 20 + "px"
          }
          this.dotStyle=false;
        }else{
          this.dotStyle=true;
          this.styleObj = {
            left: this.getOffset(e.target).left + e.target.clientWidth + "px",
            top: this.getOffset(e.target).top - 20 + "px"
          }
        }
      },
      hideEdit(){
        document.querySelectorAll(".my-event").forEach(function (item) {
          item.className = "my-event";
        });
        this.editShow = false;
        this.refresh();
      },
      hidePop(){
        document.querySelectorAll(".add-event").forEach(function (item) {
          item.className = "add-event";
        });
        this.popShow = false;
      },
      refresh(){
        this.hidePop();
        if(window.localStorage.getItem(this.year+"-"+this.month+'plan')!=null){
          this.planName=this.year+"-"+this.month+'plan';
          this.plans=JSON.parse(window.localStorage.getItem(this.year+"-"+this.month+'plan'));
          this.render(this.year,this.month);
        }
      },
      // 日期补零
      zero(n) {
        return n < 10 ? '0' + n : n
      },
      // 初始化一些东西
      init(){
        var now = new Date();
        if (this.value != "") {
          if (this.value.indexOf("-") != -1) this.sep = "-"
          if (this.value.indexOf(".") != -1) this.sep = "."
          if (this.value.indexOf("/") != -1) this.sep = "/"
          if (this.type == "date") {
            var split = this.value.split(this.sep)
            this.year = parseInt(split[0])
            this.month = parseInt(split[1]) - 1
            this.day = parseInt(split[2])
          } else if (this.type == "datetime") {
            var split = this.value.split(" ")
            var splitDate = split[0].split(this.sep)
            this.year = parseInt(splitDate[0])
            this.month = parseInt(splitDate[1]) - 1
            this.day = parseInt(splitDate[2])
            if (split.length > 1) {
              var splitTime = split[1].split(":")
              this.hour = splitTime[0]
              this.minute = splitTime[1]
              this.second = splitTime[2]
            }
          }
          if (this.range) {
            var split = this.value.split(" ~ ")
            if (split.length > 1) {
              var beginSplit = split[0].split(this.sep)
              var endSplit = split[1].split(this.sep)
              this.rangeBegin = [parseInt(beginSplit[0]), parseInt(beginSplit[1] - 1), parseInt(beginSplit[2])]
              this.rangeEnd = [parseInt(endSplit[0]), parseInt(endSplit[1] - 1), parseInt(endSplit[2])]
            }
          }
        } else {
          if (this.sep == "") this.sep = "/"
          this.year = now.getFullYear()
          this.month = now.getMonth()
          this.day = now.getDate()
          this.hour = this.zero(now.getHours())
          this.minute = this.zero(now.getMinutes())
          this.second = this.zero(now.getSeconds())
          if (this.range) {
            this.rangeBegin = Array
            this.rangeEnd = Array
          }
        }
        this.monthString = this.months[this.month]
      },
      // 渲染日期
      render(y, m) {
        if (!this.range) {
          this.rangeBegin = [];
          this.rangeEnd = [];
        }

        var firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
        var lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
        var lastDayOfLastMonth = new Date(y, m, 0).getDate()     //当月前一月的最后一天
        this.year = y
        this.currentMonth = this.months[m]
        var seletSplit = this.value.split(" ")[0].split(this.sep);
        var i, line = 0, temp = []
        for (i = 1; i <= lastDateOfMonth; i++) {
          if (!this.plans.data[i - 1]) {
            this.plans.data[i - 1] = {
              "date": "",
              "remark": []
            }
          }
          var dow = new Date(y, m, i).getDay()
          // 第一行
          if (dow == 0) {
            temp[line] = []
          } else if (i == 1) {
            temp[line] = []
            var k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (var j = 0; j < firstDayOfMonth; j++) {
              temp[line].push({
                day: k,
                cnDate: GetLunarDay(y, m, k),
                disabled: true,
                weather:{weather:'',area:'',date:{
                  year:'',
                  month:'',
                  day:''
                }},
                data: [{
                  "date": "",
                  "remark": []
                }]
              })
              k++;
            }
          }
          // 单选模式
          var chk = new Date()
          var chkY = chk.getFullYear()
          var chkM = chk.getMonth()
          // 匹配上次选中的日期
          if (
            parseInt(seletSplit[0]) == this.year &&
            parseInt(seletSplit[1]) - 1 == this.month &&
            parseInt(seletSplit[2]) == i) {
            temp[line].push({
              day: i,
              selected: true,
              cnDate: GetLunarDay(y, m + 1, i),
              data: this.plans.data[i - 1],
              weather:this.weatherArr[i - 1],
              Today: true
            })
            this.today = [line, temp[line].length - 1]
          }
          // 没有默认值的时候显示选中今天日期
          else if (chkY == this.year && chkM == this.month && i == chk.getDate() && this.value == "") {
            temp[line].push({
              day: i,
              selected: true,
              cnDate: GetLunarDay(y, m + 1, i),
              data: this.plans.data[i - 1],
              weather:this.weatherArr[i - 1],
              Today: true
            })
            this.today = [line, temp[line].length - 1]
          } else {
            // 设置可选范围
            // console.log(this.begin,this.end);
            var options = {
              day: i,
              selected: false,
              cnDate: GetLunarDay(y, m + 1, i),
              weather:this.weatherArr[i - 1],
              data: this.plans.data[i - 1]
            }
            if (this.begin != "") {
              var beginSplit = this.begin.split(this.sep)
              var beginTime = Number(new Date(
                parseInt(beginSplit[0]),
                parseInt(beginSplit[1]) - 1,
                parseInt(beginSplit[2])
              ))
              if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.end != "") {
              var endSplit = this.end.split(this.sep)
              var endTime = Number(new Date(
                parseInt(endSplit[0]),
                parseInt(endSplit[1]) - 1,
                parseInt(endSplit[2])
              ))
              if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            temp[line].push(options)
          }
          // 最后一行
          if (dow == 6) {
            line++
          } else if (i == lastDateOfMonth) {
            var k = 1
            for (dow; dow < 6; dow++) {
              temp[line].push({
                day: k,
                cnDate: GetLunarDay(y, m + 2, k),
                data: [{
                  "date": "",
                  "remark": []
                }],
                weather:{weather:'',area:'',date:{
                  year:'',
                  month:'',
                  day:''
                }},
                disabled: true
              })
              k++
            }
          }
        }
        //end for
        console.log(temp)
        this.days = temp
      },
      // 上月
      prev(e) {
        e.stopPropagation()
        if (this.month == 0) {
          this.month = 11
          this.year = parseInt(this.year) - 1
        } else {
          this.month = parseInt(this.month) - 1
        }

      },
      //  下月
      next(e) {
        e.stopPropagation()
        if (this.month == 11) {
          this.month = 0
          this.year = parseInt(this.year) + 1
        } else {
          this.month = parseInt(this.month) + 1
        }
      },
      // 选中日期
      select(k1, k2, e,dis) {
        if(dis){
          return;
        }
        if (e != undefined) { e.stopPropagation()}
        this.popShow = false;
        this.editShow = false;
        document.querySelectorAll(".add-event").forEach(function (item) {
          item.className = "add-event";
        });
        document.querySelectorAll(".my-event").forEach(function (item) {
          item.className = "my-event";
        });
        // 取消上次选中
        if (this.today.length > 0) {
          this.days.forEach(v => {
            v.forEach(vv => {
              vv.selected = false
            })
          })
//          this.days.forEach(function(v){
//            v.forEach(function(vv){
//              vv.selected=false
//            })
//          })
          // this.days[this.today[0]][this.today[1]].selected = false
        }
        this.day = this.days[k1][k2].day;
        this.week = this.weeks[k2];
        // 设置当前选中天
        this.days[k1][k2].selected = true
      },
      getOffset (elm){
        var offsetObj = {
          left: elm.offsetLeft,
          top: elm.offsetTop
        }
        if (elm.offsetParent != null) {
          elm = elm.offsetParent;
          offsetObj.left += this.getOffset(elm).left;
          offsetObj.top += this.getOffset(elm).top;
        }
        return offsetObj;
      },
      // 隐藏控件
      cancel() {
        this.show = false
      }
    }
  }
</script>
