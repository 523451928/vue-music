<template>
  <div class="page-wrapper">
    <a ref="page" class="page" @click.stop="changePage($event,item)" v-for="(item,index) in pageArr" v-html="item"
       :title="item=='>'?'下一页':item=='<'?'上一页':item"
       :class="{'flip':item=='<'||item=='>','active':index==pageIndex,'disabled':item=='...'}"></a>
  </div>
</template>

<script>
  export default{
    props:['pageTotal'],
    data(){
      return {
        pageNum: 1,
        isPage:false,
        pageIndex: 0,
        pageArr:[]
      }
    },
    watch:{
      pageNum(val){
        this.renderPage()
      },
      pageTotal(val){
        this.pageNum=1
        this.pageIndex=0
        this.renderPage()
      }
    },
    methods:{
      changePage(e, item){
        if (item === '...') {
          return
        }
        if (item === '<') {
          this.pageNum--
          if (!this.isPage) {
            this.pageIndex--
          }
        } else if (item === ">") {
          this.pageNum++
          if (!this.isPage) {
            this.pageIndex++
          }
        } else {
          this.pageNum = item
          if(this.pageTotal<=5){
            this.pageIndex=item-1
            this.$emit('changePage',this.pageNum)
            return
          }
          if (item == 1) {
            this.pageIndex = 0
            this.$emit('changePage',this.pageNum)
            return
          }
          if ( item==this.pageTotal ) {
            this.pageIndex = 6
            return
          }
          if(item==3){
            this.pageIndex=2
          }else if(item==4){
            this.pageIndex=3
          }else{
            this.pageArr.forEach((itm, index) => {
              if (item === itm) {
                if (!this.isPage) {
                  this.pageIndex = index
                }
              }
            })
          }
        }
        this.$emit('changePage',this.pageNum)
      },
      renderPage(){
        var totalPage = this.pageTotal
        if (totalPage > 1) {
          this.isPage = false
          if (this.pageNum <= 4) {
            if(totalPage<=7){
              var pageArr=[]
              for(var i=1;i<=totalPage;i++){
                pageArr.push(i)
              }
              this.pageArr=pageArr
            }else{
              this.pageArr = [1, 2, 3, 4, 5, "...", totalPage, '>']
            }
          } else if (this.pageNum > 4 && this.pageNum < totalPage - 2) {
            this.pageArr = ['<', '1', '...', this.pageNum - 2, this.pageNum - 1, this.pageNum, this.pageNum + 1, this.pageNum + 2, "...", totalPage, '>']
            this.pageIndex = 5
            this.isPage = true
          } else if (this.pageNum == totalPage - 2 ) {
            this.pageArr = ['<', '1', '...',  this.pageNum-1, this.pageNum, this.pageNum + 1, this.pageNum + 2,  '>']
          } else if (this.pageNum == totalPage) {
            this.pageArr = ['<', '1', '...', this.pageNum - 3, this.pageNum - 2, this.pageNum - 1, this.pageNum]
          }
        }else{
          this.pageArr=[]
        }
      }
    },
    mounted(){
      this.renderPage()
    }
  }
</script>

<style>
  .flip {
    font-family: poppin, 'PingFang SC', Tahoma, Arial, \5FAE\8F6F\96C5\9ED1, sans-serif;
  }

  .page-wrapper {
    clear: both;
    text-align: center;
    user-select: none;
  }

  .page-wrapper .page {
    font-size: 16px;
    font-weight: 400;
    font-family: cursive;
    display: inline-block;
    line-height: 50px;
    height: 50px;
    margin: 0 5px;
    padding: 0 21px;
    box-sizing: border-box;
    min-width: 24px;
    color: #a2a2a2 !important;
  }

  .page-wrapper .active {
    background: #42b983;
    color: #fff !important;
  }

  .page-wrapper .page:hover {
    background: #42b983;
    color: #fff !important;
  }

  .page-wrapper .disabled {
    cursor: default;
  }

  .page-wrapper .disabled:hover {
    background: #fff;
    color: #a2a2a2 !important;
  }
</style>
