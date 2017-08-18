<template>
  <div class="pop-up" :style="styleObj">
    <input v-focus type="text" placeholder="接下来你有什么安排？"v-model="content" @keyup.enter="savePlan" @keyup.esc="hidePop" />
    <p><span>时间:</span>{{year}}年{{padLeftZero(month+1)}}月{{padLeftZero(day)}}  {{week}}</p>
    <div class="time-wrapper">
      <input  type="text" v-model="hour" min="0" max="23">时<input type="text" v-model="minute" min="0" max="59">分<input type="text" v-model="second" min="0" max="59">秒
    </div>
    <div class="pop-btn">
      <span class="sure" @click="savePlan">确定</span>
      <span class="cancel" @click="hidePop">关闭</span>
    </div>
    <span  :class="{'dot-left':dotStyle,'dot-right':!dotStyle}"></span>
  </div>
</template>

<script>
  export default{
    props:{
      styleObj:{
        type:Object,
        default:{

        }
      },
      year:{
        type:Number,
        default:''
      },
      month:{
        type:Number,
        default:''
      },
      day:{
        type:Number,
        default:''
      },
      week:{
        type:String,
        default:''
      },
      dotStyle:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return {
        content:"",
        plan:{},
        hour:"",
        minute:"",
        second:""
      }
    },
    directives:{
      'focus': function(el){
        el.focus();
      }
    },
    methods:{
      hidePop(){
        this.$emit("hidePop");
      },
      padLeftZero(str){
        return ("00"+str).substr((str+"").length);
      },
      savePlan(){
        if(this.content==""){
          this.$dialog.center("内容不能为空!");
          return;
        }
        var planName=this.year+"-"+this.month+'plan';
        if(window.localStorage.getItem(planName)!=null){
          this.plan=JSON.parse(window.localStorage.getItem(planName));
        }else{
          this.plan = {
            date:this.year+"-"+this.month,
            data: []
          };
          for(var i=0;i<31;i++){
            this.plan.data.push({
              day:"",
              index:i,
              remark:[]
            });
          }
        }
        this.plan.data[this.day-1].remark.unshift({
          content: this.content,
          time:this.year+"-"+this.padLeftZero(this.month+1)+"-"+this.padLeftZero(this.day)+" "+this.hour+":"+this.minute+":"+this.second+"  "+this.week
        });
        this.plan.data[this.day-1].day=this.year+"-"+this.padLeftZero(this.month+1)+"-"+this.padLeftZero(this.day)+"  "+this.week
        this.content="";
        window.localStorage.setItem(planName,JSON.stringify(this.plan));
        this.$emit("refresh");
      }
    },
    watch:{
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
      var now=new Date();
      this.hour=this.padLeftZero(now.getHours());
      this.minute=this.padLeftZero(now.getMinutes());
      this.second=this.padLeftZero(now.getSeconds());
    }
  }
</script>

<style>
  .pop-up .time-wrapper input{
    width: 44px;
    height: 26px;
    text-indent: 0;
    text-align: center;
  }
  .pop-up{
    text-align: left;
    position: absolute;
    width: 340px;
    height: 190px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 8px #666;
  }
  .pop-up input{
    border: 1px solid #ccc;
    border-radius: 2px;
    text-indent: 6px;
  }
  .pop-up input:focus{
    border: 1px solid #bee9ff;
    box-shadow: 0px 0px 6px #bee9ff;
  }
  .pop-up input,.pop-up p{
    margin: 10px;
  }
  .pop-up p{
    font-size: 14px;
  }
  .pop-up p span{
    color: #b2b2b2;
  }
  .pop-btn{
    height: 34px;
    border-top:1px solid #cccccc;
    line-height: 34px;
    background: #f1f1f1;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .pop-btn span{
    display: inline-block;
    width: 48px;
    height: 22px;
    border-radius: 2px;
    line-height: 22px;
    text-align: center;
    margin-left: 10px;
    font-size: 12px;
    cursor: pointer;
  }
  .pop-btn .sure{
    background: #2788c7;
    color: #fff;
    border: 1px solid #1d567d;
  }
  .pop-btn .cancel{
    background: #eee;
    color: #151515;
    border: 1px solid #888888;
  }
  .dot-right{
    position: absolute;
    right: -10px;
    top: 18px;
    font-size: 0;
    line-height: 0;
    border-width: 10px;
    border-color: #fff;
    border-right-width: 0;
    border-style: dashed;
    border-left-style: solid;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
  }
  .dot-left{
    position: absolute;
    left: -10px;
    top: 18px;
    font-size: 0;
    line-height: 0;
    border-width: 10px;
    border-color: #fff;
    border-left-width: 0;
    border-style: dashed;
    border-right-style: solid;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
  }
</style>
