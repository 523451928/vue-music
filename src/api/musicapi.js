import jsonp from '../assets/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'
axios.defaults.withCredentials = true

const baseUrl0 = "http://139.196.32.78:3000/"
const baseUrl1 = "http://139.196.32.78:3537/api/v1/"

export function topicList(){
  return axios.get(`${baseUrl1}topics`)
}

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}
export function search (key) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg?'

  const data = Object.assign({}, commonParams, {
    is_xml: 0,
    format: 'jsonp',
    key: key,
    g_tk: 502182506,
    loginUin: 523451928,
    hostUin: 0,
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function searchDetailed (key, page, remote) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?'

  const data = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    new_json: 1,
    remoteplace: remote,
    searchid: 53147067831885349,
    t: 0,
    aggr: 1,
    cr: 1,
    catZhida: 1,
    lossless: 0,
    flag_qc: 0,
    p: page,
    n: 20,
    w: key
  })
  return jsonp(url, data, options)
}

export function searchOther (key,remote,page,num,t) {   //搜索MV专辑
  const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?'
  const data = Object.assign({}, commonParams, {
    ct: 24,
    qqmusic_ver: 1298,
    remoteplace: remote,
    searchid: 78514781078414255,
    aggr: 0,
    catZhida: 1,
    lossless: 0,
    sem: 10,
    t: t,     //12MV  8专辑 7歌词
    p: page,
    n: num,
    w: key
  })
  return jsonp(url, data, options)
}

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function getMusicList(topid,begin,date) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    topid:topid,
    date:date,
    song_begin:begin,
    song_num:30,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top'
  })

  return jsonp(url, data, options)
}

export function getCategory(){
  const url="https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg"

  const data=Object.assign({},commonParams,{
    hostUin:0
  })

  return jsonp(url,data,options)
}

export function getRadiolist(){
  const url="https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg"

  const data=Object.assign({},commonParams,{
    channel:'radio',
    page:'index',
    tpl:'wk',
    new:1,
    p:Math.random()
  })

  return jsonp(url,data,options)
}

export function getMvlist(type,year,area,tag,pageno,taglist){
  const url="https://c.y.qq.com/v8/fcg-bin/getmv_by_tag"

  const data=Object.assign({},commonParams,{
    utf8:1,
    type,
    year,
    area,
    tag,
    pageno,   //从0开始
    pagecount:20,
    otype:'json',
    taglist   //1获取taglist 0不获取
  })

  return jsonp(url,data,options)
}

export function getDigital(){
  const url='https://c.y.qq.com/v8/fcg-bin/musicmall.fcg'

  const data=Object.assign({},commonParams,{
    g_tk:1875820094,
    needNewCode:0,
    cmd:'pc_index_new'
  })

  return jsonp(url,data,options)
}

export function getDigitalDetail(albumid){
  const url='https://c.y.qq.com/v8/fcg-bin/musicmall.fcg'

  const data=Object.assign({},commonParams,{
    cmd:'get_album_buy_page',
    albumid:albumid,
    p:Math.random(),
    g_tk:1875820094
  })

  return jsonp(url,data,options)
}

export function getFunsRank(begin,end){
  const url='https://c.y.qq.com/shop/fcgi-bin/fcg_album_rank'

  const data=Object.assign({},commonParams,{
    begin:begin,
    end:end,
    rankname:'uin_rank_peract_112|uin_rank_peract_112_day',
    p:Math.random(),
    g_tk:400477999
  })

  return jsonp(url,data,options)
}

export function getProfile(userid){
  const url='https://c.y.qq.com/rsc/fcgi-bin/fcg_get_profile_homepage.fcg'

  const data=Object.assign({},commonParams,{
    g_tk:400477999,
    cid:205360838,
    ct:20,
    userid:userid,
    reqfrom:1,
    reqtype:0
  })

  return jsonp(url,data,options)
}



export function getAlbum(cmd,page,sort,language,genre,year,pay,type,company){
  const url='https://c.y.qq.com/v8/fcg-bin/album_library'

  const data = Object.assign({}, commonParams ,{
    cmd,            //  firstpage, get_album_info 首次
    page,          //0
    pagesize:20,
    sort,            //1  排序
    language,        //-1 语种
    genre,           //0  流派
    year,            //1  年份
    pay,             //0  价格
    type,            //-1 类别
    company          //-1 唱片公司
  })

  return jsonp(url,data,options)
}
export function getPlaylist(cid,sid,sin,ein) {
  const url = '/api/getPlaylist'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: sin,
    ein: ein,
    sortId: sid,
    needNewCode: 0,
    categoryId: cid,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getPlaylistDetail(disstid){
  const url="/api/getPlaylistDetai"

  const data=Object.assign({},commonParams,{
    inCharset:'utf8',
    type:1,
    json:1,
    utf8:1,
    onlysong:0,
    disstid:disstid
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}

export function getSingerMv(singermid,num){
  const url='https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg'

  const data=Object.assign({},commonParams,{
    cid:205360581,
    singermid,
    order:'listen',
    begin:0,
    num
  })

  return jsonp(url,data,options)
}

export function getFunMv(singermid,num){
  const url='https://c.y.qq.com/mv/fcgi-bin/fcg_singer_mv.fcg'

  const data=Object.assign({},commonParams,{
    cid:205360581,
    singermid,
    order:'time',
    begin:0,
    num,
    cmd:1
  })

  return jsonp(url,data,options)
}

export function getSimilarSinger(singer_mid){
  const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_simsinger.fcg'

  const data=Object.assign({},commonParams,{
    utf8:1,
    singer_mid,
    start:0,
    num:5,
    g_tk:5381
  })

  return jsonp(url,data,options)
}

export function getFirstPage(){
  const url='https://c.y.qq.com/v8/fcg-bin/fcg_first_yqq.fcg'

  const data=Object.assign({},commonParams,{
    outCharset:'GB2312',
    tpl:'v12',
    page:'other',
    rnd:Math.random()
  })

  return jsonp(url,data,options)
}

export function getSongDetail(id){
  const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'

  const data=Object.assign({},commonParams,{
    albummid:id
  })

  return jsonp(url,data,options)
}

export function getAlbumDetail(id){
  const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'

  const data=Object.assign({},commonParams,{
    albummid:id
  })

  return jsonp(url,data,options)
}

export function getCompanyDetail(id){
  const url='https://c.y.qq.com/v8/fcg-bin/fcg_company_detail.fcg'

  const data=Object.assign({},commonParams,{
    type:'company',
    companyId:id,
    is_show:1
  })

  return jsonp(url,data,options)
}

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({},  {
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    g_tk: 502182506,
    loginUin: 523451928,
    hostUin: 0,
    needNewCode: 0
  }, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongLyric(musicid){
  const url = '/api/songlyric'

  const data=Object.assign({},commonParams,{
    nobase64:1,
    musicid
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getMySong(disstid){
  const url='/api/myMusic'

  const data=Object.assign({},commonParams,{
    inCharset:'utf8',
    type:1,
    json:1,
    utf8:1,
    onlysong:1,
    nosign:1,
    song_begin:0,
    song_num:30,
    ctx:1,
    disstid:disstid,
    _:1502265002592,
    g_tk:400477999
  })

  return axios.get(url,{
    params:data
  }).then((res)=>{
    return Promise.resolve(res.data)
  })
}
