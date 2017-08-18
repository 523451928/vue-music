<template>
  <div class="cast">
    <p class="performer">导演：<span v-for="(director,index) in directors">{{director.name}}</span></p>
    <p class="performer" v-for="(avatar,index) in casts">
                <span class="avatar">
                  <img :src="avatar.avatars.small"/>
                </span>
      <i>{{avatar.name}}</i>
    </p>
  </div>
</template>

<script>
  export default{
    props:[
      'directors','casts'
    ],
    methods:{
      say:function(){
        console.log(0)
      }
    }
  }
</script>

<style>

</style>
