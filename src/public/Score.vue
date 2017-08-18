<template>
  <div>
    <div class="score-star" :class="starType">
      <div @mouseleave="hideScore" style="width: 200px; margin: 0 auto;">
        <i>评价:</i>
        <span v-for="(item,index) in itemClass" :class="item" @click="sltScore(index)" @mouseenter="showScore(index)"></span>
      </div>
    </div>
    <i style="font-size: 14px; font-style: normal;position: absolute;" v-show="tipShow">{{tip[index]}}</i>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        itemClass:['off','off','off','off','off'],
        tip:["很差","较差","一般","推荐","力荐"],
        tipShow:false,
        isSlt:false,
        index:0
      }
    },
    props:[
      'size'
    ],
    computed:{
      starType(){
        return "type"+this.size;
      }
    },
    methods:{
      showScore(idx){
        if(!this.isSlt){
          this.tipShow=true;
          this.index=idx;
          for(var i=0;i<this.itemClass.length;i++){
            if(i<=idx){
              this.itemClass[i]='on';
            }else{
              this.itemClass[i]='off';
            }
          }
        }
      },
      hideScore(){
          this.tipShow=false;
          if(!this.isSlt){
            this.itemClass=['off','off','off','off','off'];
          }
      },
      sltScore(idx){
        this.isSlt=true;
        this.$emit("change");
        for(var i=0;i<this.itemClass.length;i++){
          if(i<=idx){
            this.itemClass[i]='on';
          }else{
            this.itemClass[i]='off';
          }
        }
      }
    }
  }
</script>

<style>
  .score-star i{font-style: normal;position: relative;top:-5px;}
  .score-star span {
    display: inline-block;
    cursor: pointer;
  }
  .score{
    font-style: normal;
    color: #FF6633;
    position: relative;
    top: -3px;
    font-size: 16px;
  }
  .score-star .on{
    background: url("../assets/img/star-on.png");
    background-size: contain;
  }
  .score-star .half{
    background: url("../assets/img/star-half.png");
    background-size: contain;
  }
  .score-star .off{
    background: url("../assets/img/star-border.png");
    background-size: contain;
  }
  .typeIn span{
    width: 18px;
    height:18px;
    display: inline-block;
    margin: 2px;
  }
  .typeSmall span{
    width: 16px;
    height:16px;
    display: inline-block;
    margin: 1px;
  }
</style>
