<template>
  <transition name="custom-classes-transition" class="animated slideInLeft fast" mode="out-in">
    <div>
      <h1>我的任务</h1>
      <div class="todo-wrapper" @click.stop="hidePick">
        <section class="todo-app">
          <header class="header">
            <div v-show="todoShow">
              <h1><input readonly v-model="date" @click.stop="selectPick"/>任务计划</h1><p class="weather">{{curentWeather}}</p>
              <input class="new-todo"
                     autofocus autocomplete="off"
                     placeholder="接下来的任务计划?"
                     v-model="newTodo"
                     @keyup.enter="addTodo">
            </div>
            <h1 v-show="recoveryShow">回收站</h1>
          </header>
          <section class="main" v-cloak>
            <div v-show="todos.length">
              <input class="toggle-all" type="checkbox" v-model="allDone" v-show="todoShow">
              <transition-group name="fade" tag="ul" class="todo-list" >
                <li v-for="todo in filteredTodos"
                    class="todo"
                    :key="todo.id"
                    :class="{ completed: todo.completed, editing: todo == editedTodo }"  v-show="todoShow" >
                  <div class="view">
                    <input class="toggle" type="checkbox" v-model="todo.completed"/>
                    <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
                    <button class="destroy" @click="removeTodo(todo)"></button>
                  </div>
                  <input class="edit" type="text"
                         v-model="todo.title"
                         v-todo-focus="todo == editedTodo"
                         @blur="doneEdit(todo)"
                         @keyup.enter="doneEdit(todo)"
                         @keyup.esc="cancelEdit(todo)">
                </li>
              </transition-group>
            </div>
            <transition-group name="fade" tag="ul" class="todo-list" >
              <li v-for="todo in recoveryTodos"
                  class="todo"
                  :key="todo.id"
                  :class="{ completed: todo.completed, editing: todo == editedTodo }"  v-show="recoveryShow">
                <div class="view">
                  <input class="toggle" type="checkbox" v-model="todo.completed"/>
                  <label >{{ todo.title }}</label>
                  <span @click="recoveryTodo(todo)">恢复</span>
                  <button class="destroy" @click="removeRtodo(todo)"></button>
                </div>
              </li>
            </transition-group>
            <p v-show="recoveryTodos.length==0&&recoveryShow">暂无！</p>
          </section>
          <footer class="footer" v-show="todos.length" v-cloak>
            <span class="todo-count" v-show="todoShow">
              {{date}}<strong> {{ remaining }}项任务待完成</strong>
            </span>
            <ul class="filters" v-show="todoShow">
              <li @click="visibility='all'"><a :class="{ selected: visibility == 'all' }">全部</a></li>
              <li @click="visibility='active'"><a :class="{ selected: visibility == 'active' }">待办</a></li>
              <li @click="visibility='completed'"><a :class="{ selected: visibility == 'completed' }">已完成</a></li>
            </ul>

            <button class="clear-completed" @click="removeCompleted"  v-show="todoShow&&remaining<todos.length">
              清除已完成任务
            </button>
          </footer>
          <button class="recovery-btn" @click="toggleRecovery" >
            {{recoveryInfo}}
          </button>
          <p class="info" v-show="todoShow">双击任务可编辑</p>
        </section>
      </div>
      <transition name="fade">
        <v-pickdate :pickStyle="pickStyle" v-show="pickShow" :pickDate="date" @output="writePut" :isEdit="isEdit" :isTime="isTime" @clearDate="clearDate" @cancelPick="hidePick"></v-pickdate>
      </transition>
      <transition name="fade">
        <v-confirm v-show="confrimShow" :msg="clearMsg" @sureFn="sureFn" @cancelFn="cancelFn">
          <span>are you sure</span>
        </v-confirm>
      </transition>
    </div>
  </transition>
</template>

<script>
  import Pickdate from '../public/Pickdate.vue'
  import Comfirm from '../public/Confirm.vue'
  import {mapState} from 'vuex'

  export default{
    data(){
      return {
        filters:{
          all: function (todos) {
            return todos
          },
          active: function (todos) {
            return todos.filter(function (todo) {
              return !todo.completed
            })
          },
          completed: function (todos) {
            return todos.filter(function (todo) {
              return todo.completed
            })
          }
        },
        confrimShow :false,
        newTodo: '',
        clearMsg:"确认彻底删除吗？",
        uid:"",
        todo:"",
        todos:[],
        recoveryInfo:"回收站",
        recoveryTodos:[],
        editedTodo: null,
        visibility: 'all',
        date: "",
        weatherIndex:"",
        changeDate: "",
        startDate: "",
        pickShow: false,
        isEdit: false,
        isTime: false,
        recoveryShow:false,
        todoShow:true,
        pickStyle: {}
      }
    },
    // watch todos change for localStorage persistence
    watch: {
      todos: {
        handler: function (todos) {
          this.save(todos)
        },
        deep: true
      },
      recoveryTodos:{
        handler:function(todos){
          this.saveRecovery(todos)
        },
        deep:true
      },
      date(val){
        this.todos=this.fetch();
        this.recoveryTodos=this.fetchRecovery();
      }
    },
    computed: {
      ...mapState([
        'weatherArr'
      ]),
      curentWeather(){
        var date=[];
        date.push(this.date.split('-')[0])
        date.push(this.date.split('-')[1])
        date=date.join("-")
        this.weatherIndex=parseInt(this.date.split('-')[2])-1;
        var weatherArr=JSON.parse(window.localStorage.getItem(date+"-weather"));
        if(weatherArr){
          var infoObj=weatherArr[this.weatherIndex];
          if(weatherArr[this.weatherIndex].area!=""){
            return infoObj.weather+"\ 地点:"+infoObj.area;
          }else{
            return '当天没记录天气!'
          }
        }else{
          return '当天没记录天气!'
        }
      },
      storageKey(){
        return 'todos-'+this.date
      },
      recoveryKey(){
        return 'recovery-'+this.date
      },
      filteredTodos: function () {
        return this.filters[this.visibility](this.todos)
      },
//      remaining: function () {
//        return this.filters.active(this.todos).length
//      },
      remaining:{
        get(){
          return this.filters.active(this.todos).length
        }
      },
      allDone: {
        get: function () {
          return this.remaining === 0
        },
        set: function (value) {
          this.todos.forEach(function (todo) {
            todo.completed = value
          })
        }
      }
    },
    filters: {
      pluralize: function (n) {
        return n === 1 ? 'item' : 'items'
      }
    },
    components: {
      'v-pickdate': Pickdate,
      'v-confirm':Comfirm
    },
    methods: {
      toggleRecovery(){
        if(this.recoveryInfo=="回收站"){
          this.recoveryShow=true;
          this.todoShow=false;
          this.recoveryInfo='返回';
        }else{
          this.recoveryShow=false;
          this.todoShow=true;
          this.recoveryInfo='回收站';
        }
      },
      fetch: function () {
        var todos = JSON.parse(localStorage.getItem(this.storageKey) || '[]')
        todos.forEach(function (todo, index) {
          todo.id = index
        })
        this.uid = todos.length
        return todos
      },
      fetchRecovery:function(){
        var todos = JSON.parse(localStorage.getItem(this.recoveryKey) || '[]')
        return todos
      },
      save: function (todos) {
        localStorage.setItem(this.storageKey, JSON.stringify(todos))
      },
      saveRecovery: function (todos){
        localStorage.setItem(this.recoveryKey, JSON.stringify(todos))
      },
      addTodo: function () {
        var value = this.newTodo && this.newTodo.trim()
        if (!value) {
          return
        }
        this.todos.push({
          id: this.uid++,
          title: value,
          completed: false
        })
        this.newTodo = ''
      },
      recoveryTodo: function (todo){
        this.todos.push(todo);
        this.recoveryTodos.splice(this.recoveryTodos.indexOf(todo), 1);
      },
      removeRtodo: function (todo){
        this.confrimShow=true;
        this.todo=todo;
      },
      sureFn:function(){
        this.recoveryTodos.splice(this.recoveryTodos.indexOf(this.todo), 1)
        this.confrimShow=false;
      },
      cancelFn:function(){
        this.confrimShow=false;
      },
      removeTodo: function (todo) {
        this.todos.splice(this.todos.indexOf(todo), 1)
        this.recoveryTodos.push(todo);
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.title
        this.editedTodo = todo
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return
        }
        this.editedTodo = null
        todo.title = todo.title.trim()
        if (!todo.title) {
          this.removeTodo(todo)
        }
      },

      cancelEdit: function (todo) {
        this.editedTodo = null
        todo.title = this.beforeEditCache
      },

      removeCompleted: function () {
        this.recoveryTodos=this.recoveryTodos.concat(this.filters.completed(this.todos));
        this.todos = this.filters.active(this.todos)
      },
      clearDate(){
        this.date = "";
        this.pickShow = false;
      },
      writePut(date){
        this.changeDate = date;
        this.date = date;
        this.pickShow = false;
      },
      hidePick(){
        this.pickShow = false;
      },
      selectPick(e){
        this.pickShow = !this.pickShow;

        this.pickStyle = {
          left: this.getOffset(e.target).left + "px",
          top: this.getOffset(e.target).top + e.target.offsetTop + 12 + "px"
        };
        this.pickDate = e.target.value;
      },
      getOffset (elm){
        var offsetObj = {
          left: elm.offsetLeft,
          top: elm.offsetTop
        }
        if (elm.offsetParent != null) {
          elm = elm.offsetParent;
          offsetObj.left += this.getOffset(elm).left;
          offsetObj.top += this.getOffset(elm).top;
        }
        return offsetObj;
      }
    },
    directives: {
      'todo-focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    },
    mounted(){
      var now=new Date();
      var year=now.getFullYear();
      var month=now.getMonth()+1>10?now.getMonth()+1:'0'+(now.getMonth()+1);
      var day=now.getDate()>10?now.getDate():'0'+now.getDate();
      this.weatherIndex=parseInt(day)-1;
      this.date=year+"-"+month+"-"+day;
      this.todos=this.fetch();
      this.recoverytodos=this.fetch();
    }
  }
</script>

<style>
  .fade-enter-active, .fade-leave-active, .fade-enter-active .confirm-wrapper, .fade-leave-active .confirm-wrapper {
    transition: all .5s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  input, textarea, select, button {
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    margin: 0em 0em 0em 0em;
    font: 13.3333px Arial;
    outline:none;
  }
  .view span{
    position: absolute;
    right: 60px;
    top: 10px;
    border: 1px solid #2ad487;
    border-radius: 2px;
    padding: 2px 4px;
    cursor: pointer;
    display: none;
    opacity: 0;
    transition: all 0.2s;
  }
  .header h1 input {
    width: 150px;
    text-align: center;
    color: #2ad487;
    font-size: 18px;
    position: relative;
    top: -5px;
  }
  .header .weather{
    margin-bottom:15px;
    font-size: 16px;
    font-weight: normal;
    line-height: 1;
  }
  .info {
    color: #666;
    padding: 15px;
    font-size: 12px;
  }

  .todo-list .todo {
    border-bottom: 1px solid #ccc;
    height: 53px;
  }

  .todo-list li .view {
    position: relative;
  }

  .filters {
    height: 30px;
    margin: 10px;
  }

  .filters .selected {
    border: 1px solid #2ad487;
    border-radius: 2px;
    padding: 2px 4px;
  }

  .clear-completed {
    position: absolute;
    right: 20px;
    bottom: 61px;
    border: none;
    background: none;
    border: 1px solid #f63;
    border-radius: 2px;
    padding: 2px 4px;
    cursor: pointer;
    outline: none;
  }
  .recovery-btn {
    position: absolute;
    right: 47px;
    top: 24px;
    border: none;
    background: none;
    border: 1px solid #cc9a9a;
    border-radius: 2px;
    padding: 2px 4px;
    cursor: pointer;
    outline: none;
  }
  .filters li a {
    margin-left: 10px;
    box-sizing: content-box;
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 2px 4px;
    box-sizing: border-box;
  }

  .filters li, .todo-count {
    float: left;
    margin: 0 20px;
  }

  .filters li {
    font-size: 14px;

  }
  .todo-count strong{
    font-weight: normal;
    color: #2ad487;
  }
  .footer {
    height: 38px;
  }

  .toggle-all:checked:before {
    color: #737373;
  }

  .todo-app {
    position: relative;
    background: #fff;
    margin: 130px 0 40px 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  .todo-app:before {
    content: '';
    position: absolute;
    clear: both;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }

  .todo-app h1 {
    font-size: 36px;
    font-weight: normal;
  }

  .todo-list .editing .edit {
    display: block;
  }

  .todo-list .editing .edit {
    height: 54px;
  }

  .todo-list .editing label, .todo-list .editing .toggle {
    display: none;
  }

  .todo-list .edit {
    display: none;
  }

  .todo-list li .destroy {
    display: none;
    position: absolute;
    top: 5px;
    cursor: pointer;
    right: 10px;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
    border: none;
    background: none;
  }

  .todo-list li .destroy:after {
    content: "×";
  }

  .todo-list li:hover .destroy,.todo-list li:hover span {
    opacity: 1;
    display: block;
  }

  .todo-wrapper {
    width: 90%;
    margin: 0 auto;
    background: #f5f5f5;
    padding: 50px;
  }

  .todo-list li .toggle {
    text-align: center;
    width: 40px;
    height: 54px;
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 0;
    margin: auto 0;
    border: none;
    -webkit-appearance: none;
    appearance: none;
  }

  .todo-list li {
    height: 60px;
  }

  .todo-list li label {
    text-align: left;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
    font-size: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .todo-list li .toggle:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" stroke-width="3"/></svg>');
  }

  .todo-list li .toggle:checked:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" stroke-width="3"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
  }

  .todo-list li.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  todo-list li label {
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  .todo-app {
    width: 800px;
    margin: 0 auto;
  }

  .todo-app h1 {
    border: none;
    background: #f5f5f5;
    text-align: center;
  }

  .toggle-all {
    position: absolute;
    top: -55px;
    left: -12px;
    width: 60px;
    height: 34px;
    text-align: center;
    border: none;
    transform: rotate(90deg);
    -webkit-appearance: none
  }

  .toggle-all:before {
    content: '❯';
    font-size: 22px;
    color: #e6e6e6;
    padding: 10px 27px 10px 27px;
  }

  .todoapp {
    background: #fff;
    margin: 130px 0 40px 0;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  .new-todo {
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  .new-todo, .edit {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: none !important;
    height: 64px;
    text-indent: 30px;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .main {
    position: relative;
    z-index: 2;
    border-top: 1px solid #e6e6e6;
  }

  .main li {
    padding: 0;
  }

  .toggle-all {
    position: absolute;
    top: -55px;
    left: -12px;
    width: 60px;
    height: 34px;
    text-align: center;
    border: none;
  }

</style>
