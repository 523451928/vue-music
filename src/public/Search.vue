<template>
  <div>
    <input type="text" v-model="search" placeholder="请输入关键词" @keyup.enter="childSearch"/><span class="search" @click="childSearch">搜索</span>
  </div>
</template>

<script>
  const baseRequstUrl = "https://api.douban.com/";
  export default{
    methods: {
      childSearch(){
        this.$emit("search", this.search);
      }
    },
    data(){
      return {
        search: ""
      }
    },
    props: ['ikey']
  }
</script>

<style>

</style>
