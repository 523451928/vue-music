import Vue from 'vue'
import Router from 'vue-router'
import Movie from '../components/Movie'
import Music from '../components/Music'
import Book from '../components/Book'
import Detail from '../components/Detail'
import Bdetail from '../components/Bdetail'
import Mdetail from '../components/Mdetail'
import Myfollow from '../components/Myfollow'
import Calendar from '../components/Calendar'
import Todo from '../components/Todo'
import Qmusic from '../components/Qmusic.vue'
import Singer from '../components/qmusic/Singer.vue'
import SingerDetail from '../components/qmusic/SingerDetail.vue'
import Search from '../components/Qsearch.vue'
import Toplist from '../components/Toplist.vue'
import Playlist from '../components/Playlist.vue'
import Radio from '../components/Radio.vue'
import Mvlist from '../components/Mvlist.vue'
import Album from '../components/Album.vue'
import Home from '../components/Home.vue'
import Digital from '../components/Digital.vue'
import Mymusic from '../components/MyMusic.vue'
import SongDetail from '../components/qmusic/SongDetail.vue'
import AlbumDetail from '../components/qmusic/AlbumDetail.vue'
import CompanyDetail from '../components/qmusic/CompanyDetail.vue'
import PlaylistDetail from '../components/qmusic/PlaylistDetail.vue'
import DegitalDetail from '../components/qmusic/DigitalDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Qmusic
    },
    {
      path: '/movie',
      component: Movie
    },
    {
      path: '/music',
      component: Music
    },
    {
      path: '/qmusic',
      component: Qmusic,
      children: [
        {
          path: '/qmusic/singer',
          component: Singer,
          children: [
            {
              path: ':id',
              component: SingerDetail
            }
          ]
        }, {
          path: '/qmusic/search',
          component: Search
        },{
          path:'/qmusic/toplist',
          component:Toplist
        },{
          path:'/qmusic/playlist',
          component:Playlist
        },{
          path:'/qmusic/radio',
          component:Radio
        },{
          path:'/qmusic/mv',
          component:Mvlist
        },{
          path:'/qmusic/album',
          component:Album
        },{
          path:'/qmusic/home',
          component:Home
        },{
          path:'/qmusic/digital',
          component:Digital
        },{
          path:'/qmusic/mymusic',
          component:Mymusic
        },{
          path:'/qmusic/songdetail/:id',
          component:SongDetail
        },{
          path:'/qmusic/albumdetail/:id',
          component:AlbumDetail
        },{
          path:'/qmusic/companydetail/:id',
          component:CompanyDetail
        },{
          path:'/qmusic/playlistdetail/:id',
          component:PlaylistDetail
        },{
          path:'/qmusic/degitaldetail/:id',
          component:DegitalDetail
        }
      ]
    },
    {
      path: '/follow',
      component: Myfollow
    },
    {
      path: '/calendar',
      component: Calendar
    },
    {
      path: '/todo',
      component: Todo
    },
    {
      path: '/book',
      component: Book
    },
    {
      path: '/detail/:id',
      component: Detail
    },
    {
      path: '/bdetail/:id',
      component: Bdetail
    },
    {
      path: '/mdetail/:id',
      component: Mdetail
    }
  ]
})
