<template>
  <div class="pop-edit" :style="styleObj">
    <input v-focus type="text" placeholder="请编辑" v-model="content" v-show="inputShow" @keyup.enter="sureFn" @keyup.esc="hideEdit"/>
    <textarea v-focus v-model="content" v-show="!inputShow" @keyup.enter="sureFn" @keyup.esc="hideEdit" ></textarea>
    <p><span>时间:</span>{{planObj.remark[planIndex].time}}</p>
    <div class="pop-btn">
      <span class="clear" @click="clear">删除</span>
      <span class="sure" @click="sureFn">确定</span>
      <span class="cancel" @click="hideEdit">关闭</span>
    </div>
    <span :class="{'dot-left':dotStyle,'dot-right':!dotStyle}"></span>
    <transition name="fade">
      <v-confrim v-show="confrimShow" :msg="msg" @sureFn="removeFn" @cancelFn="cancelFn"></v-confrim>
    </transition>
  </div>
</template>

<script>
  import Comfirm from './Confirm.vue';
  export default{
    data(){
      return {
        plan: {},
        confrimShow: false,
        msg: "确认删除吗？"
      }
    },
    props: {
      content: {
        type: String,
        default: ""
      },
      styleObj: {
        type: Object,
        default: function () {
          return {

          }
        }
      },
      planObj: {
        type: Object,
        default: function () {
          return {
            remark:[
              {time:"",content:""}
            ]
          }
        }
      },
      planName: {
        type: String,
        default: ""
      },
      planIndex: {
        type: Number,
        default: ""
      },
      dotStyle: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      inputShow(){
        if (this.content.length < 15) {
          return true;
        } else {
          return false;
        }
      }
    },
    directives:{
      focus(el){
        el.focus();
      }
    },
    methods: {
      clear(){
        this.confrimShow = true;
      },
      removeFn(){
        if (window.localStorage.getItem(this.planName) != null) {
          this.confrimShow = false;
          this.plan = JSON.parse(window.localStorage.getItem(this.planName));
          this.plan.data[this.planObj.index].remark.splice(this.planIndex, 1);
          window.localStorage.setItem(this.planName, JSON.stringify(this.plan))
          this.hideEdit();
        }
      },
      cancelFn(){
        this.confrimShow = false;
      },
      sureFn(){
        if (this.content == "") {
          this.$dialog.center("内容不能为空");
          return;
        }
        if (window.localStorage.getItem(this.planName) != null) {
          this.plan = JSON.parse(window.localStorage.getItem(this.planName));
          this.plan.data[this.planObj.index].remark[this.planIndex].content = this.content;
          window.localStorage.setItem(this.planName, JSON.stringify(this.plan))
          this.hideEdit();
        }
      },
      hideEdit(){
        this.$emit('hideEdit');
      }
    },
    components: {
      'v-confrim': Comfirm
    },
    mounted(){
      //console.log(this.planObj);
    }
  }
</script>

<style>
  .pop-edit .time-wrapper input {
    width: 44px;
    height: 26px;
    text-indent: 0;
    text-align: center;
  }

  .pop-edit {
    text-align: left;
    position: absolute;
    width: 340px;
    height: 190px;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 8px #666;
  }

  .pop-edit textarea {
    border: 1px solid #ccc;
    border-radius: 2px;
    text-indent: 6px;
    width: 95%;
    min-height: 80px;
    margin: 6px;
    resize: none;
  }

  .pop-edit input {
    border: 1px solid #ccc;
    border-radius: 2px;
    text-indent: 6px;
  }

  .pop-edit input:focus, .pop-edit textarea:focus {
    border: 1px solid #bee9ff;
    box-shadow: 0px 0px 6px #bee9ff;
  }

  .pop-edit input, .pop-edit p {
    margin: 10px;
  }

  .pop-edit p {
    font-size: 14px;
  }

  .pop-edit p span {
    color: #b2b2b2;
  }

  .pop-btn {
    height: 34px;
    border-top: 1px solid #cccccc;
    line-height: 34px;
    background: #f1f1f1;
    position: absolute;
    width: 100%;
    bottom: 0;
  }

  .pop-btn span {
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

  .pop-btn .sure {
    background: #2788c7;
    color: #fff;
    border: 1px solid #1d567d;
  }

  .pop-btn .remove, .pop-btn .clear {
    background: #eee;
    color: #151515;
    border: 1px solid #888888;
  }

  .dot-right {
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

  .dot-left {
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
