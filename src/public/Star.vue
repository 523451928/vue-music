<template>
  <div class="star" :class="starType">
    <span v-for="(item,index) in itemClass" :class="item"></span>
    <i class="score" v-show="showScore==true">{{score}}</i>
  </div>
</template>

<script>
  export default{
    props: ['size', 'score','showScore'],
    computed: {
      starType(){
        return "type" + this.size;
      },
      itemClass(){
        var result = [];
        var score = this.score / 2
        var integer = Math.floor(score);
        var hasHalf = Math.round(score)>integer;
        for (var i = 0; i < integer; i++) {
          result.push("on");
        }
        if (hasHalf) {
          result.push("half");
        }
        while (result.length < 5) {
          result.push("off");
        }
        return result;
      }
    },
    mounted(){

    }
  }
</script>

<style>
  .star span {
    display: inline-block;
  }
  .score{
    font-style: normal;
    color: #FF6633;
    position: relative;
    top: -3px;
    font-size: 16px;
  }
  .star .on{
    background: url("../assets/img/star-on.png") no-repeat;
    background-size: contain;
  }
  .star .half{
    background: url("../assets/img/star-half.png") no-repeat;
    background-size: contain;
  }
  .star .off{
    background: url("../assets/img/star-off.png") no-repeat;
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
