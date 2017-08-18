import Vue from 'vue'
import Vuex from 'vuex'
import {removeRepeat} from '../assets/js/removeRepeat'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    searchKey: '',
    bookArr: [],
    bookTotal: '',
    movieKey: '',
    movieArr: [],
    movieTotal: '',
    movieActive: '',
    movieState: '',
    musicKey: '',
    musicArr: [],
    followObj: {},
    weatherArr: [],
    weatherObj: {},
    result: 0,
    enterKey: '',
    singer: {},
    singersObj:{},
    singerShow:true,
    musicList:[],
    sequenceList:[],
    playing:false,
    playType:0,
    currentIndex:-1,
    changeIndex:true,
    autoPlay:false,
    fullScreen:false,
    songName:'',
    userInfo:{}
  },
  mutations:{
    setUserInfo(state,obj){
      state.userInfo=obj
    },
    setSongName(state,name){
      state.songName=name
    },
    setAutoPlay(state,flag){
      state.autoPlay=flag
    },
    setFullScreen(state,flag){
      state.fullScreen=flag
    },
    setChangeIndex(state,flag){
      state.changeIndex=flag
    },
    addMuisc(state,item){
      state.musicList.push(item)
      state.musicList=removeRepeat(state.musicList,'musicData','songid')
    },
    addMusicList(state,list){
      state.musicList = state.musicList.concat(list)
      state.musicList=removeRepeat(state.musicList,'musicData','songid')
    },
    clearMusic(state){
      state.musicList=[]
      state.playing=false
    },
    delMusic(state,index){
      state.musicList.splice(index,1)
    },
    setMusiclist(state,item){
      state.musicList.push(item)
      state.musicList=removeRepeat(state.musicList,'musicData','songid')
      if(window.localStorage.getItem('recentMusicList')){
        var recent=JSON.parse(window.localStorage.getItem('recentMusicList')).concat(state.musicList)
        window.localStorage.setItem('recentMusicList',JSON.stringify(removeRepeat(recent,'musicData','songid')))
      }else{
        window.localStorage.setItem('recentMusicList',JSON.stringify(state.musicList))
      }
      if(state.changeIndex){
        state.currentIndex=state.musicList.length-1
      }
    },
    setSequenceList(state,list){
      state.sequenceList=list
    },
    setPlaying(state,flag){
      state.playing=flag
    },
    setCurrentIndex(state,index){
      state.currentIndex=index
    },
    setSingerShow(state,boll){
      state.singerShow=boll
    },
    setSinger(state,obj,bigObj){
      state.singer=obj
      state.singersObj=bigObj
    },
    setEnter(state, key){
      if (key === '=') {
        if(state.enterKey===""){
          return
        }
        var idx = state.enterKey.indexOf('=')
        if (idx != -1) {
          state.result = eval(state.enterKey.substr(0, idx))
          return
        } else {
          state.result = eval(state.enterKey)
        }
      } else if (key === 'AC') {
        state.enterKey = ''
        state.result = 0
        return
      } else if (key === 'CE') {
        if (state.enterKey.length > 0) {
          state.enterKey = state.enterKey.substring(0, state.enterKey.length - 1)
        }
        return
      } else if (key === '*' || key === '/' || key === '-' || key === '+') {
        if (state.result !== 0) {
          state.enterKey = state.result
        }
      }
      state.enterKey += key
    },
    setWeatherArr(state, arr){
      state.weatherArr = arr
    },
    setWeatherObj(state, obj){
      state.weatherObj = obj
    },
    setFollowObj(state, obj){
      state.followObj = obj
    },
    setSearch(state, key){
      state.searchKey = key
    },
    setBook(state, obj){
      state.bookArr = obj
    },
    setTotal(state, n){
      state.bookTotal = n
    },
    setMovieKey(state, key){
      state.movieKey = key
    },
    setMovie(state, obj){
      state.movieArr = obj
    },
    setMovieTotal(state, n){
      state.movieTotal = n
    },
    setMovieActive(state, i){
      state.movieActive = i
    },
    setMovieState(state, n){
      state.movieState = n
    },
    setMusicKey(state, k){
      state.musicKey = k
    },
    setMusic(state, obj){
      state.musicArr = obj
    }
  },
  actions:{
    selectPlay({commit, state}, {item, index,flag}){
      commit('setMusiclist',item)
      commit('setPlaying',true)
      commit('setChangeIndex',flag)
      commit('setAutoPlay',true)
    }
  },
  getters: {
    // doneTodos:state=>{
    //   return state.todos.filter(todo=>todo.done)
    // },
    // noneTodos:state=>{
    //   return state.todos.filter(todo=>!todo.done)
    // }
  }
})
export default store
