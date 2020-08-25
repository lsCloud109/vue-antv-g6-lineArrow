import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home'
import LineArrow from '@/page/charts/LineArrow'
import Dagre from '@/page/charts/Dagre'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/LineArrow',
    name: 'LineArrow',
    component: LineArrow
  },
  {
    path: '/Dagre',
    name: 'Dagre',
    component: Dagre
  }
  ]
})
