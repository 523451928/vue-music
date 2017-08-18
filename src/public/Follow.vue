<template>
  <div>
    <a class="love-heart" @click.stop.prevent="childToggle(item)" :style="styleObj">
      <em :class="{'focus-out':!item.isLisk,'focus-in':item.isLike}"></em>
      <i :class="{'focus-scale':item.isLike}"></i>
      <span class="focus-info">{{item.isLike?"已关注":"关注"}}</span>
    </a>
  </div>
</template>

<script>
  export default{
    data(){
      return {

      }
    },
    props:['item','styleObj'],
    methods:{
      childToggle(){
        this.$emit("childToggle", this.item);
      }
    },
    mounted(){

    }
  }
</script>

<style>
  .love-heart {
    position: absolute;
    right: 0px;
    bottom: 10px;
    height: 50px;
    line-height: 72px;
  }
  .focus-out,.focus-scale,.focus-in{
    display: inline-block;
    width: 26px;
    height: 26px;
    background: url("../assets/img/follow.png") no-repeat;
    background-size: cover;
    position: absolute;
    top: 5px;
    left: 28px;
  }
  .focus-scale{
    background-position: left bottom;
    animation: focusedScale .5s 1 ease 0s;
  }
  .focus-out{
    background-position: left top;
  }
  .focus-in{
    background-position: left bottom;
  }
  .focus-info{
    color: #fff;
    font-size: 14px;
    display: block;
    width: 80px;
    text-align: center;
  }
</style>
