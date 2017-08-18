<template>
  <div id="pick-date" :style="pickStyle" @click.stop="">
    <div class="pick-tools">
      <div class="pick-top">
          <span class="prev-year" v-show="isChangeYear" @click.stop="prevYear"></span>
          <span class="pick-prev" @click.stop="prev" :class="{'disPrev':disPrev}" :style="arrowLeft">
              <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink"><g class="transform-group"><g
                transform="scale(0.015625, 0.015625)"><path
                d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z"
                fill="#5e7a88"></path></g></g></svg>
          </span>
        <input type="text" v-model="year" value="year" @change="changeYear" min="1970" max="2100" maxlength="4">
        /
        {{monthString}}
        <span class="pick-next" @click.stop="next" :class="{'disNext':disNext}" :style="arrowRight">
                      <svg width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink"><g class="transform-group"><g
                        transform="scale(0.015625, 0.015625)"><path
                        d="M761.056 532.128c0.512-0.992 1.344-1.824 1.792-2.848 8.8-18.304 5.92-40.704-9.664-55.424L399.936 139.744c-19.264-18.208-49.632-17.344-67.872 1.888-18.208 19.264-17.376 49.632 1.888 67.872l316.96 299.84-315.712 304.288c-19.072 18.4-19.648 48.768-1.248 67.872 9.408 9.792 21.984 14.688 34.56 14.688 12 0 24-4.48 33.312-13.44l350.048-337.376c0.672-0.672 0.928-1.6 1.6-2.304 0.512-0.48 1.056-0.832 1.568-1.344C757.76 538.88 759.2 535.392 761.056 532.128z"
                        fill="#5e7a88"></path></g></g></svg>
                  </span>
        <span class="next-year" v-show="isChangeYear" @click.stop="nextYear"></span>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <td v-for="(item,index) in weeks">{{item}}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day,k1) in days">
          <td v-for="(item,k2) in day" :class="{'selected':item.selected,'disabled':item.disabled,'today':item.today}" @click="select(k1,k2,item.nextMonth,item.prevMonth,item.disabled)">
            {{item.day}}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="time-wrapper" v-show="isTime">
      <input type="text" v-model="hour" min="0" max="23">时<input type="text" v-model="minute" min="0" max="59">分<input type="text" v-model="second" min="0" max="59">秒
      <div class="btn-box">
        <span class="save-btn" @click="sureFn">确定</span>
        <span class="cancel-btn" @click="cancelFn">取消</span>
      </div>
    </div>
    <div class="edit-box" v-show="isEdit">
      <span class="slt-today" @click="sltToday">今天</span><span class="clear-date" @click="clearDate">清空</span>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      pickStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },
      pickDate:{
        type:String,
        default:""
      },
      minDate:{
        type:String,
        default:"1991-12-26"
      },
      maxDate:{
        type:String,
        default:"2050-12-12"
      },
      isChangeYear:{
        type:Boolean,
        default:false
      },
      isEdit:{
        type:Boolean,
        default:false
      },
      isTime:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return {
        monthString: 1,
        days:[],
        year: "",
        pickYear:"",
        month: "",
        pickMonth:"",
        day: "",
        sltDay:"",
        pickDay:"",
        today:"",
        hour:"",
        minute:"",
        second:"",
        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
        weeks: ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    computed:{
      arrowLeft(){
        if(this.isChangeYear){
            return {
                left:"20px"
            }
        }else{
            return {
              left:"10px"
            }
        }
      },
      arrowRight(){
        if(this.isChangeYear){
          return {
            right:"20px"
          }
        }else{
          return {
            right:"10px"
          }
        }
      },
      minYear(){
          if(this.minDate.split('-')!=-1){
            return this.minDate.split('-')[0];
          }else{
            return this.minDate.split('/')[0];
          }
      },
      minMonth(){
        if(this.minDate.split('-')!=-1){
          return this.minDate.split('-')[1];
        }else{
          return this.minDate.split('/')[1];
        }
      },
      minDay(){
        if(this.minDate.split('-')!=-1){
          return this.minDate.split('-')[2]==undefined?"":this.minDate.split('-')[2];
        }else{
          return this.minDate.split('/')[2]==undefined?"":this.minDate.split('/')[2];
        }
      },
      disPrev(){
          return this.minYear>=this.year && parseInt(this.minMonth)-1>=this.month
      },
      maxYear(){
        if(this.maxDate.split('-')!=-1){
          return this.maxDate.split('-')[0];
        }else{
          return this.maxDate.split('/')[0];
        }
      },
      maxMonth(){
        if(this.maxDate.split('-')!=-1){
          return this.maxDate.split('-')[1];
        }else{
          return this.maxDate.split('/')[1];
        }
      },
      maxDay(){
        if(this.maxDate.split('-')!=-1){
          return this.maxDate.split('-')[2]==undefined?"":this.maxDate.split('-')[2];
        }else{
          return this.maxDate.split('/')[2]==undefined?"":this.maxDate.split('/')[2];
        }
      },
      disNext(){
        return this.maxYear<=this.year && parseInt(this.maxMonth)-1<=this.month
      }
    },
    methods: {
      cancelFn(){
        this.$emit('cancelPick');
      },
      paddingZero(val){
          return parseInt(val)<10?"0"+parseInt(val):parseInt(val)
      },
      clearDate(){
          this.$emit('clearDate');
      },
      sltToday(){
        var now = new Date();
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.sltDay=this.paddingZero(now.getDate());
        this.monthString = this.months[this.month];
        this.render(this.year,this.month);
      },
      changeYear(){
          this.render(this.year,this.month);
      },
      init(){
        var now = new Date();
        var splitDate=[];
        if(this.pickDate.split(" ")[0]!=undefined){
          if(this.pickDate.split(" ")[0].indexOf('-')!=-1){
            splitDate=this.pickDate.split(" ")[0].split("-");
          }else if(this.pickDate.split(" ")[0].indexOf('/')!=-1){
            splitDate=this.pickDate.split(" ")[0].split("/");
          }
        }
        if(splitDate.length>=2){
          this.year =parseInt(splitDate[0]);
          this.month = parseInt(splitDate[1])-1;
          this.pickYear=parseInt(splitDate[0]);
          this.pickMonth= parseInt(splitDate[1])-1;
          this.pickDay=parseInt(splitDate[2]);
        }else{
          this.year = now.getFullYear();
          this.month = now.getMonth();
          this.day = now.getDate();
          this.sltDay=this.paddingZero(now.getDate());
        }
        if(this.pickDate.split(" ")[1]!=undefined){
          this.hour=this.pickDate.split(" ")[1].split(":")[0];
          this.minute=this.pickDate.split(" ")[1].split(":")[1];
          this.second=this.pickDate.split(" ")[1].split(":")[2];
        }else{
          this.hour=this.paddingZero(now.getHours());
          this.minute=this.paddingZero(now.getMinutes());
          this.second=this.paddingZero(now.getSeconds());
        }
        this.monthString = this.months[this.month];
        this.render(this.year, this.month);
      },
      render(y, m){
        var firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
        var lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
        var lastDayOfLastMonth = new Date(y, m, 0).getDate()     //上个月的最后一天
        this.year = y
        var i, line = 0, temp = []
        for (i = 1; i <= lastDateOfMonth; i++) {
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
                prevMonth:true,
                disabled: true,
                selected: false
              })
              k++;
            }
          }
          if(i<=this.minDay && parseInt(this.minMonth)-1==this.month &&this.minYear==this.year || i>=this.maxDay && parseInt(this.maxMonth)-1==this.month &&this.maxYear==this.year){
            temp[line].push({
              day: i,
              disabled: true,
              selected: false
            })
          }else{
            temp[line].push({
              day: i,
              disabled: false,
              selected: false
            })
          }

          var chk = new Date()
          var chkY = chk.getFullYear()
          var chkM = chk.getMonth()

          if (chkY == this.year && chkM == this.month && i == this.day  ) {
            temp[line].pop();
            temp[line].push({
              day: i,
              today:true,
              selected: false
            })
            this.today = [line, temp[line].length - 1]
          }
          if( i==this.pickDay && this.pickMonth==this.month && this.pickYear==this.year){
            temp[line].pop();
            temp[line].push({
              day: i,
              selected: true
            })
          }
          // 最后一行
          if (dow == 6) {
            line++
          } else if (i == lastDateOfMonth) {
            var k = 1
            for (dow; dow < 6; dow++) {
              temp[line].push({
                day: k,
                nextMonth:true,
                disabled: true,
                selected: false
              })
              k++
            }
          }
        }
        //end for
        this.days = temp
      },
      prev(){
        if(!this.disPrev){
          if(--this.month<=-1){
            this.year--;
            this.month=11;
          }
          this.render(this.year, this.month);
          this.monthString=this.months[this.month];
        }
      },
      prevYear(){
        this.render(--this.year, this.month);
      },
      nextYear(){
        this.render(++this.year, this.month);
      },
      next(){
          if(!this.disNext){
              if(++this.month>=12){
                this.month=0;
                this.year++;
              }
              this.render(this.year, this.month);
              this.monthString=this.months[this.month];
          }
      },
      select(k1,k2,next,prev,dis){
          if(dis){
//              return;
          }
          for(var i=0;i<this.days.length;i++){
            for(var j=0;j<this.days[i].length;j++){
              this.days[i][j].selected=false;
            }
          }
          this.$set(this.days[k1][k2],'selected',true);
        var formatDate="";
        this.sltDay=this.paddingZero(this.days[k1][k2].day);
        if(!next&&!prev){
          if(this.pickDate.indexOf('/')!=-1){
            formatDate=this.year+"/"+this.paddingZero(this.month+1)+"/"+this.sltDay;
          }else{
            formatDate=this.year+"-"+this.paddingZero(this.month+1)+"-"+this.sltDay;
          }
        }else if(next){
          if(this.pickDate.indexOf('/')!=-1){
            formatDate=this.year+"/"+this.paddingZero(this.month+2)+"/"+this.sltDay;
          }else{
            formatDate=this.year+"-"+this.paddingZero(this.month+2)+"-"+this.sltDay;
          }
        }else if(prev){
          if(this.pickDate.indexOf('/')!=-1){
            formatDate=this.year+"/"+this.paddingZero(this.month)+"/"+this.sltDay;
          }else{
            formatDate=this.year+"-"+this.paddingZero(this.month)+"-"+this.sltDay;
          }
        }
        if(!this.isTime){
          this.$emit('output',formatDate);
        }
      },
      sureFn(){
        var formatDate="";
        if(this.pickDate.indexOf('/')!=-1){
          formatDate=this.year+"/"+this.paddingZero(this.month+1)+"/"+this.sltDay+" "+this.paddingZero(this.hour)+":"+this.paddingZero(this.minute)+":"+this.paddingZero(this.second);
        }else{
          formatDate=this.year+"-"+this.paddingZero(this.month+1)+"-"+this.sltDay+" "+this.paddingZero(this.hour)+":"+this.paddingZero(this.minute)+":"+this.paddingZero(this.second);
        }
        this.$emit('output',formatDate);
      }
    },
    watch:{
      pickDate:function(value){
        this.init()
      },
      hour(newVal,oldVal){
          if(isNaN(newVal)&&newVal!="" || newVal<0){
              this.hour=0;
          }
          if(newVal>=23){
            this.hour=23;
          }
      },
      minute(newVal,oldVal){
        if(isNaN(newVal)&&newVal!="" || newVal<0){
          this.minute=0;
        }
        if(newVal>=59){
          this.minute=59;
        }
      },
      second(newVal,oldVal){
        if(isNaN(newVal)&&newVal!="" || newVal<0){
          this.second=0;
        }
        if(newVal>=59){
          this.second=59;
        }
      }
    },
    mounted(){
        this.init()
    }
  }
</script>

<style>
  #pick-date .time-wrapper{
    border-top: 1px solid #ccc;
    padding: 5px;
  }

  #pick-date .btn-box span{
    border-radius: 3px;
    display: inline-block;
    width: 90px;
    height: 28px;
    line-height: 28px;
    margin:2px ;
    cursor: pointer;
  }
  #pick-date .btn-box .save-btn{
    background: #5cb85c;
    color: #fff;
  }
  #pick-date .btn-box .cancel-btn{
    background: #ccc;
    color: #fff;
  }
  #pick-date .time-wrapper input{
    width: 44px;
    height: 26px;
    border: 1px solid #ccc;
    margin: 2px;
    border-radius:2px;
    text-align: center;
  }
  #pick-date .edit-box{
    border-top:1px solid #ccc;
    padding-top: 5px;
  }
  #pick-date .slt-today{
    float: left;
    margin-left: 10px;
    display: inline-block;
    cursor: pointer;
  }
  #pick-date .slt-today:hover{
    color: #5cb85c;
  }
  #pick-date .clear-date{
    float: right;
    margin-right: 10px;
    display: inline-block;
    cursor: pointer;
  }
  #pick-date .clear-date:hover{
    color: #ff6633;
  }
  #pick-date {
    user-select: none;
    position: absolute;
    width: 260px;
    background: #fff;
    padding-bottom: 5px;
    z-index: 1000;
    box-shadow: 2px 2px 4px #ccc;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  #pick-date .today{
    background: #5cb85c;
    color: #fff;
    border-radius:2px;
  }
  #pick-date .today:hover{
    background: #449d44;
  }
  #pick-date .disabled{
    color: #999;
    /*cursor: not-allowed;*/
  }
  #pick-date .selected{
    background: #60caff;
    color: #fff;
    border-radius: 2px;
  }
  #pick-date .selected:hover{
    background: #3377cc;
    color: #fff;
  }
  #pick-date thead tr{
    background: #f5f5f5;
    line-height: 26px;
    height: 26px;
    padding: 0;
  }
  #pick-date td{
    padding: 0;
    border: none;
  }
  #pick-date tbody td{
    height: 30px;
    cursor: pointer;
    padding: 0;
  }
  #pick-date table {
    width: 100%;
  }

  #pick-date input {
    width: 40px;
  }
  #pick-date td:hover {
    background: #f5f5f5;
  }
  #pick-date .pick-top {
    position: relative;
    height: 36px;
    line-height: 36px;
  }

  #pick-date  .pick-top .pick-prev {
    position: absolute;
    left: 22px;
    top: 2px;
    cursor: pointer;
  }
  #pick-date .prev-year{
    position: absolute;
    left: 6px;
    top: 10px;
    cursor: pointer;
    width: 14px;
    height: 14px;
    display: inline-block;
    background: none;
    background-size: contain;
  }
  #pick-date .next-year{
    position: absolute;
    right: 6px;
    top: 10px;
    cursor: pointer;
    width: 14px;
    height: 14px;
    display: inline-block;
    background:none;
    background-size: contain;
  }
  #pick-date .pick-top input{
    border: none;
    font-size: 16px;
  }
  #pick-date .pick-top .pick-next {
    position: absolute;
    right: 10px;
    top: 2px;
    cursor: pointer;
  }
  #pick-date .pick-top .disPrev, #pick-date .pick-top .disNext{
    cursor: not-allowed;
    opacity: 0.4;
  }
</style>
