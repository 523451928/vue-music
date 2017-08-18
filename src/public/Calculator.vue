<template>
    <div >
      <div class="calculator-wrapper">
        <div class="calculator">
          <div class="text-wrapper">
            <span class="close" @click="closeCalculator">&times;</span>
            <h3>{{result}}</h3>
            <p>{{enterKey}}</p>
          </div>
          <div class="key-wrapper">
            <ul>
              <li v-for="(item,index) in keys" @mousedown="addDownClass" @mouseup="removeDownClass" @click="setEnter(item)" :class="{'key-clear':index==0,
              'key-enter':index==keys.length-1,
              'key-eclear':index==keys.length-3}">
                {{item}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  import {hasClass,addClass,removeClass} from '../assets/js/dom'
  export default{
    data(){
      return {
        keys:[
          'AC', '+', '-', '*',
          '7', '8', '9', '/',
          '4', '5', '6', '.',
          '1', '2', '3','CE',
          '0','='
        ]
      }
    },
    computed:{
      ...mapState(['result','enterKey'])
    },
    methods:{
      ...mapMutations(['setEnter']),
      closeCalculator(){
        this.$emit('closeCalculator')
      },
      addDownClass(e){
        if(hasClass(e.target,'key-enter')){
          addClass(e.target,'enter-active')
        }else{
          addClass(e.target,'active')
        }
      },
      removeDownClass(e){
        if(hasClass(e.target,'key-enter')){
          removeClass(e.target,'enter-active')
        }else{
          removeClass(e.target, 'active')
        }
      }
    }
  }
</script>

<style>
  .calculator-wrapper .close{
    position: absolute;
    right: 10px;
    top:0px;
    font-size: 30px;
    transition: all .5s;
    cursor: pointer;
  }
  .calculator-wrapper .close:hover{
    transform: rotate(180deg);
  }
  .calculator-wrapper{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 100;
    top:0;
    overflow-y: auto;
  }
  .calculator{
    transition: all .5s;
    width: 330px;
    height: 575px;
    margin: 50px auto;
    background: #fff;
    background: #e0e0e0;
    border: 5px solid rgba(0,0,0,0.2);
    border-radius: 4px;
  }
  .text-wrapper{
    position: relative;
    height: 29%;
  }
  .text-wrapper h3{
    position: relative;
    top:40%;
    font-size: 58px;
    text-align: right;
    padding-right: 10px;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .text-wrapper p{
    position: relative;
    top:38%;
    padding-right: 10px;
    color: #666;
    text-align: right;
    font-size: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .key-wrapper{
    height: 71%;
    background: #f0f0f0;
  }
  .key-wrapper li{
    user-select: none;
    float: left;
    width: 25%;
    height: 81px;
    border-bottom: 1px solid #ccc;
    line-height: 81px;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 24px;
    background: #f5f5f5;
  }
  .key-wrapper .key-clear{
    color: #f63;
  }
  .key-wrapper .key-eclear{
    color: #2ad487;
  }
  .key-wrapper .key-enter{
    background: #2ad487;
    color: #fff;
    width: 75%;
  }
  .key-wrapper .enter-active{
    background: #42b983;
    /*box-shadow: 0 0 5px #60caff;*/
  }
  .key-wrapper .active{
    background: #e3e3e3;
    /*box-shadow: 0 0 5px #60caff;*/
  }
</style>
