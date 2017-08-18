<template>
  <div id="vue-game">
    <div class="game-wrapper">
      <span class="close-btn" @click="closeGame">&times;</span>
      <p>第{{ levelText }}关<span class="life" :class="{'success':life>7,'warning':life>3&&life<=7,'danger':life<=3}">还剩{{life}}条生命</span></p>
      <div id="wrapper" @keyup="keydowns($event)">
        <!--<transition-group name="change" tag="table">-->
          <!--<tr v-for="row in table" :key="row">-->
            <!--<td v-for="v in row" @click="choose(v)" :key="v" title="点击选择" v-bind:style="{backgroundColor:textMap[v]}"><span v-show="tipShow">{{v}}</span></td>-->
          <!--</tr>-->
        <!--</transition-group>-->
        <table>
          <tr v-for="row in table" :key="row">
            <td v-for="v in row" @click="choose(v)" :key="v" title="点击选择" v-bind:style="{backgroundColor:textMap[v],width:styleObj.width,height:styleObj.height}">
              <transition name="fade">
                <span v-show="tipShow">{{v}}</span>
              </transition>
            </td>
          </tr>
        </table>
      </div>
      <p class="game-tip" >总共{{maxLevel}}关,找出不同颜色的方块
        <span class="tip-btn" ref="tip" :class="{'dis':isDis,'success':tipNum>=4,'warning':tipNum==3,'danger':tipNum<=2}"  @click="showTip" >提示{{tipNum}}</span>
      </p>
    </div>
    <transition name="fade">
      <v-pay :payTip="payTip" v-show="payShow" @closePay="closePay"></v-pay>
    </transition>
  </div>
</template>

<script>
  import {removeClass,addClass} from '../assets/js/dom'
  import VPay from './Pay.vue'
  export default{
    props:{
      maxLevel:{
        type:Number,
        default:10
      }
    },
    data(){
      return {
        table: [],
        textMap: [],
        level: 1,
        difficulty:30,
        life:3,
        tipNum:5,
        isLive:true,
        tipShow:false,
        tipClock:false,
        payShow:false,
        payTip:"",
        isDis:false,
        styleObj:{
          width:'40px',
          height:'40px'
        }
      }
    },
    computed:{
      levelText: function() {
        return this.level > 9 ? this.level : "12345678910".split('')[this.level - 1]
      }
    },
    mounted(){
      this.generateTable()
    },
    watch:{
      level(val){
        switch (val){
          case 24:
            this.styleObj={
              width:'23px',
              height:'23px'
            }
            break;
          case 23:
            this.styleObj={
              width:'24px',
              height:'24px'
            }
            break;
          case 22:
            this.styleObj={
              width:'26px',
              height:'26px'
            }
            break;
          case 20:
            this.styleObj={
              width:'30px',
              height:'30px'
            }
            break;
          case 18:
            this.styleObj={
              width:'32px',
              height:'32px'
            }
            break;
          case 16:
            this.styleObj={
              width:'34px',
              height:'34px'
            }
            break;
          case 14:
            this.styleObj={
              width:'36px',
              height:'36px'
            }
            break;
          case 12:
            this.styleObj={
              width:'38px',
              height:'38px'
            }
            break;
          case 2:
            this.styleObj={
              width:'38px',
              height:'38px'
            }
            break;
        }
      }
    },
    components:{
      VPay
    },
    methods:{
      closePay(){
        this.payShow=false;
      },
      showTip(){
        if(this.tipNum>0&&!this.tipClock){
          this.isDis=true;
          this.tipClock=true;
          this.tipShow=true;
          this.tipNum--;
        }else if(this.tipNum==0){
          this.payShow=true;
          this.payTip="你的提示用完，请购买";
          this.$dialog.center('loser,你的提示用完，请购买')
        }
      },
      closeGame(){
        this.$emit('closeGame');
      },
      choose: function(v) {
        if(!this.isLive){
          this.payShow=true;
          this.payTip="你的生命已用完，请购买";
          this.$dialog.center('loser，命已用完，请购买')
          return
        }
        if(v) {
          if(this.tipShow){
            this.isDis=false;
            this.tipShow=false;
            this.tipClock=false;
          }
          this.level++ ;
          this.difficulty--;
          this.generateTable();
          if(this.level>this.maxLevel){
            this.$dialog.center('您已经通关了')
            this.level=1 ;
            this.difficulty=30;
            this.generateTable();
          };
        }else{
          if(this.life>0){
            this.life--
          }
          if(this.life<=0){
            this.isLive=false
            return
//            this.life=10;
//            this.level=1 ;
//            this.difficulty=30;
//            this.generateTable();
          }
        }
      },
      generateTable: function() {
        var r=Math.random()*255 |0;
        var g=Math.random()*255 |0;
        this.textMap=['rgb('+r+','+g+','+g+')','rgb('+r+','+(g-this.difficulty)+','+(g-this.difficulty)+')']
        var size = this.level + 1
        var table = new Array(size).fill(0).map(function() {
          return new Array(size).fill(0)
        });
        var newTable=[];
        for(var i=0;i<this.level+1;i++){
          newTable[i]=[];
          for(var j=0;j<this.level+1;j++){
            newTable[i][j]=0;
          }
        }
        var num = Math.random();
        var random = num * size * size | 0;
        var row = random / size | 0;
        var col = random - row * size;
        table[row][col] = 1;
        this.table = table
      }
    }
  }
</script>

<style>
  .change-enter-active, .change-leave-active {
    transition: all .5s;
  }
  .dis{
    cursor: not-allowed;
  }
  .tip-btn{
    user-select: none;
    display: inline-block;
    border: 1px solid #2ad487;
    border-radius: 4px;
    float: right;
    cursor: pointer;
    margin-right: 10px;
    padding: 2px 4px;
    font-size: 14px;
    transition:all 0.5s;
  }
  .tip-btn:hover{
    border-color: #42b983;
    transform: translateY(-2px);
  }
  .dis{
    cursor: not-allowed;
  }
  .dis:hover{
    border-color: #eee;
    transform: translateY(2px);
  }
  .life{
    margin-left:10px;
  }
  .success{
    color: #449d44;
  }
  .warning{
    color:#ea9518;
  }
  .danger{
    color:red;
  }
  .change-enter td, .change-leave-active td{
    transform: scale(0.2);
    opacity: 0
  }
  #wrapper {
    display: flex;
    justify-content: center;
  }
  .close-btn{
    position: absolute;
    right: 10px;
    top:0px;
    font-size: 30px;
    transition: all .5s;
    cursor: pointer;
  }
  .close-btn:hover{
    transform: rotate(180deg);
  }
  .game-wrapper p{
    margin-bottom: 10px;
  }
  .game-wrapper .game-tip{
    position: absolute;
    bottom: 0px;
    color: #666;
    width: 100%;
    text-align: center;
  }
  .game-wrapper{
    transition: all .5s;
    margin: 30px auto;
    padding-top: 20px;
    background: #fff;
    width: 800px;
    height: 800px;
    border-radius: 4px;
    position: relative;
  }
  #vue-game{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 100;
    top:0;
    overflow-y: auto;
  }
  #wrapper table {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px；
  }
  #wrapper td {
    transition: all .5s;
    background: #5bba6e;
    color: #fff;
    font-size: 25px;
    width: 40px;
    height: 40px;
    border-radius: 4px;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
  }
</style>
