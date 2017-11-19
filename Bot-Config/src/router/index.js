import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store/index'

import Login from '@/views/Login'
import Overview from '@/views/Overview'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Overview/:userId',
      name: 'Overview',
      component: Overview
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login') {
    if (!store.getters.isLoggedIn) {
      return next('Login')
    }
  }

  if (to.name === 'Login') {
    if (store.getters.isLoggedIn) {
      return next(from.path)
    }
  }

  return next()
})

export default router
